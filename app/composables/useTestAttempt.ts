import type { Question, TestAttempt } from '~/types'

/**
 * Bumped whenever `TestAttempt` changes shape; older payloads are discarded.
 * v3 split the clock into `elapsedMs` plus a per-sitting `startedAt`, so a v2
 * payload's single start time would be read as one enormous sitting.
 */
const ATTEMPT_VERSION = 3

const storageKey = (testId: string) => `satupersen:attempt:${testId}`

/** Guards against corrupt or outdated localStorage payloads. */
function isTestAttempt(value: unknown): value is TestAttempt {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<TestAttempt>

  return (
    candidate.version === ATTEMPT_VERSION &&
    typeof candidate.testId === 'string' &&
    typeof candidate.currentIndex === 'number' &&
    (candidate.startedAt === null || typeof candidate.startedAt === 'string') &&
    typeof candidate.elapsedMs === 'number' &&
    typeof candidate.answers === 'object' &&
    candidate.answers !== null
  )
}

/**
 * ViewModel — running a test: question navigation, answer capture, progress,
 * and refresh-safe persistence.
 *
 * Every mutation writes the whole attempt back to localStorage through
 * `usePersistentState`, which satisfies the acceptance criterion that answers
 * survive a browser refresh.
 */
export function useTestAttempt(testId: string) {
  const { questions } = useTestQuestions(() => testId)

  const { state: attempt, isHydrated, clear } = usePersistentState<TestAttempt>(
    storageKey(testId),
    () => ({
      version: ATTEMPT_VERSION,
      testId,
      answers: {},
      currentIndex: 0,
      startedAt: null,
      elapsedMs: 0,
      completedAt: null,
    }),
    { validate: isTestAttempt },
  )

  const totalQuestions = computed(() => questions.value.length)

  /**
   * Clamped so a stored index can't point past the end of the question set
   * (e.g. the JSON shrank since the attempt was saved).
   */
  const currentIndex = computed(() =>
    Math.min(Math.max(attempt.value.currentIndex, 0), Math.max(totalQuestions.value - 1, 0)),
  )

  const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value])

  /** The score the user picked for the question on screen, if any. */
  const currentAnswer = computed<number | undefined>(() => {
    const question = currentQuestion.value
    return question ? attempt.value.answers[question.id] : undefined
  })

  const answeredCount = computed(() => Object.keys(attempt.value.answers).length)

  /** 0–100. Reflects questions answered, not questions visited. */
  const progress = computed(() =>
    totalQuestions.value === 0
      ? 0
      : Math.round((answeredCount.value / totalQuestions.value) * 100),
  )

  const isFirstQuestion = computed(() => currentIndex.value === 0)
  const isLastQuestion = computed(() => currentIndex.value === totalQuestions.value - 1)
  const isComplete = computed(
    () => totalQuestions.value > 0 && answeredCount.value === totalQuestions.value,
  )

  /** True once the user has answered anything — drives "Lanjutkan" vs "Mulai". */
  const hasProgress = computed(() => answeredCount.value > 0)

  /**
   * Ended, whether or not every question was answered. The result page keys off
   * this so a run that hit the time limit still shows a score.
   */
  const isFinished = computed(() => attempt.value.completedAt !== null)

  /** Start of the current sitting; null while the countdown is paused. */
  const startedAt = computed(() => attempt.value.startedAt)

  /** Time banked from previous sittings. */
  const elapsedMs = computed(() => attempt.value.elapsedMs)

  /**
   * Opens a sitting. A no-op if one is already open, so a re-render cannot
   * silently restart the clock and hand back the time already spent.
   */
  function start(): void {
    if (attempt.value.startedAt) return
    attempt.value = { ...attempt.value, startedAt: new Date().toISOString() }
  }

  /**
   * Closes the current sitting and banks its duration. Called when the user
   * leaves the question page, so the countdown freezes rather than running on
   * while they are somewhere else.
   *
   * Idempotent: with no sitting open there is nothing to bank, and calling it
   * twice must not charge the same seconds again.
   */
  function pause(): void {
    const start = attempt.value.startedAt
    if (!start) return

    const parsed = new Date(start).getTime()
    const spent = Number.isNaN(parsed) ? 0 : Math.max(0, Date.now() - parsed)

    attempt.value = {
      ...attempt.value,
      startedAt: null,
      elapsedMs: attempt.value.elapsedMs + spent,
    }
  }

  function selectAnswer(questionId: number, score: number): void {
    // Replace the map rather than mutating it so the deep watcher in
    // usePersistentState fires reliably for newly added keys.
    attempt.value = {
      ...attempt.value,
      answers: { ...attempt.value.answers, [questionId]: score },
    }
  }

  function goTo(index: number): void {
    const clamped = Math.min(Math.max(index, 0), Math.max(totalQuestions.value - 1, 0))
    attempt.value = { ...attempt.value, currentIndex: clamped }
  }

  function next(): void {
    if (!isLastQuestion.value) goTo(currentIndex.value + 1)
  }

  function previous(): void {
    if (!isFirstQuestion.value) goTo(currentIndex.value - 1)
  }

  /**
   * Stamps completion. Called when the user answers the last question and when
   * the timer expires. Idempotent so the timer can't overwrite a manual finish.
   */
  function finish(): void {
    if (attempt.value.completedAt) return
    attempt.value = { ...attempt.value, completedAt: new Date().toISOString() }
  }

  function reset(): void {
    clear()
  }

  return {
    attempt,
    isHydrated,
    questions,
    totalQuestions,
    currentIndex,
    currentQuestion,
    currentAnswer,
    answeredCount,
    progress,
    isFirstQuestion,
    isLastQuestion,
    isComplete,
    hasProgress,
    isFinished,
    startedAt,
    elapsedMs,
    start,
    pause,
    selectAnswer,
    goTo,
    next,
    previous,
    finish,
    reset,
  }
}

/**
 * Drops a *finished* attempt so the test can be taken again from scratch.
 *
 * In-progress attempts are deliberately left alone: they are what the
 * "Lanjutkan Tes" resume flow and the refresh-safety acceptance criterion rely
 * on. Only a run that already produced a result is cleared.
 *
 * Callable outside a component (route middleware) — `usePersistentState`
 * skips its mount-time work when there is no instance, and the in-memory
 * `useState` value it reads was already hydrated by the page the user is
 * leaving.
 */
export function discardFinishedAttempt(testId: string): void {
  const { isFinished, reset } = useTestAttempt(testId)
  if (isFinished.value) reset()
}

/**
 * Freezes a test's countdown from outside a component — route middleware runs
 * before the page unmounts, so the persisting watcher is still alive to write
 * the banked time.
 */
export function pauseAttemptTimer(testId: string): void {
  const { pause } = useTestAttempt(testId)
  pause()
}
