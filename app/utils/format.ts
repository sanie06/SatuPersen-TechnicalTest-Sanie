/** "5 Menit" — the display form of `Test.durationMinutes`. */
export function formatDuration(minutes: number): string {
  return `${minutes} Menit`
}

/**
 * "4:07" — a countdown label. Rounds up so a fresh 5-minute timer reads "5:00"
 * rather than "4:59", and so the last second shows "0:01" instead of "0:00".
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
