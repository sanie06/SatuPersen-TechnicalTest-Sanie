import type { Question, TestAttempt } from '~/types'

/**
 * Bumped whenever `TestAttempt` changes shape; older payloads are discarded.
 * v2 added `startedAt` — a v1 payload has no start time, so its countdown
 * could not be reconstructed and the attempt is dropped rather than resumed
 * with a wrong clock.
 */
const ATTEMPT_VERSION = 2

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

  /** Wall-clock start of the countdown; null until `start()` runs. */
  const startedAt = computed(() => attempt.value.startedAt)

  /**
   * Stamps the start time on first entry to the test. Deliberately a no-op
   * afterwards: re-stamping on every mount would hand the user a fresh clock
   * on each reload, which is exactly what the time limit is meant to prevent.
   */
  function start(): void {
    if (attempt.value.startedAt) return
    attempt.value = { ...attempt.value, startedAt: new Date().toISOString() }
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
    start,
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
