/**
 * ViewModel — the countdown for a timed test.
 *
 * Time left is *derived* from the attempt's `startedAt` against the wall clock,
 * never stored as a remainder. That is what makes it survive a refresh without
 * handing back free time: reloading recomputes the same deadline, and closing
 * the tab for five minutes really does cost five minutes.
 *
 * A ticking `now` only exists to re-render the label once a second; the deadline
 * itself does not depend on the interval ever having run, so a throttled
 * background tab cannot stretch the limit.
 */
export function useTestTimer(
  startedAt: MaybeRefOrGetter<string | null>,
  durationMinutes: MaybeRefOrGetter<number>,
) {
  const now = ref(Date.now())
  let ticker: ReturnType<typeof setInterval> | undefined

  const totalMs = computed(() => toValue(durationMinutes) * 60_000)

  const deadline = computed(() => {
    const start = toValue(startedAt)
    if (!start) return null

    const parsed = new Date(start).getTime()
    // A hand-edited storage payload could carry an unparseable date; treat it
    // as "not started" rather than instantly expiring the attempt.
    return Number.isNaN(parsed) ? null : parsed + totalMs.value
  })

  /** Falls back to the full duration before the clock starts. */
  const remainingMs = computed(() =>
    deadline.value === null ? totalMs.value : Math.max(0, deadline.value - now.value),
  )

  const isRunning = computed(() => deadline.value !== null && remainingMs.value > 0)

  const isExpired = computed(() => deadline.value !== null && remainingMs.value === 0)

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
