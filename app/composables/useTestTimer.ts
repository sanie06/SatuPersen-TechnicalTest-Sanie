/**
 * ViewModel — the countdown for a timed test.
 *
 * Time spent is `elapsedMs` — banked from previous sittings — plus the wall
 * clock since `startedAt`, the moment the current sitting began. A `null`
 * `startedAt` means no sitting is open, so the countdown is frozen: leaving the
 * question page stops the clock, and coming back resumes it where it was.
 *
 * Within a sitting the elapsed portion still comes from the wall clock rather
 * than being counted down in a variable, so a throttled or backgrounded tab
 * cannot stretch the limit. The ticking `now` only exists to re-render the
 * label once a second.
 */
export function useTestTimer(
  startedAt: MaybeRefOrGetter<string | null>,
  elapsedMs: MaybeRefOrGetter<number>,
  durationMinutes: MaybeRefOrGetter<number>,
) {
  const now = ref(Date.now())
  let ticker: ReturnType<typeof setInterval> | undefined

  const totalMs = computed(() => toValue(durationMinutes) * 60_000)

  /** Milliseconds burned in the sitting that is open right now, if any. */
  const currentSittingMs = computed(() => {
    const start = toValue(startedAt)
    if (!start) return 0

    const parsed = new Date(start).getTime()
    // A hand-edited storage payload could carry an unparseable date; count it
    // as nothing rather than instantly expiring the attempt.
    return Number.isNaN(parsed) ? 0 : Math.max(0, now.value - parsed)
  })

  const spentMs = computed(() => toValue(elapsedMs) + currentSittingMs.value)

  const remainingMs = computed(() => Math.max(0, totalMs.value - spentMs.value))

  /** True only while a sitting is open — paused is not running. */
  const isRunning = computed(() => toValue(startedAt) !== null && remainingMs.value > 0)

  /**
   * Keyed on the clock having actually been used: a fresh attempt has spent
   * nothing, and must not read as expired before the user has begun.
   */
  const isExpired = computed(() => spentMs.value > 0 && remainingMs.value === 0)

  /** 0–100, counting down. Drives the visual timer bar. */
  const percentageLeft = computed(() =>
    totalMs.value === 0 ? 0 : Math.round((remainingMs.value / totalMs.value) * 100),
  )

  /** True in the last minute, so the view can escalate the styling. */
  const isCritical = computed(() => isRunning.value && remainingMs.value <= 60_000)

  const label = computed(() => formatCountdown(remainingMs.value))

  onMounted(() => {
    now.value = Date.now()
    ticker = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onBeforeUnmount(() => {
    if (ticker) clearInterval(ticker)
  })

  return { remainingMs, totalMs, isRunning, isExpired, isCritical, percentageLeft, label }
}
