export interface PlatformStat {
  /** Highlighted figure, e.g. "7+". Rendered in the brand accent colour. */
  value: string
  label: string
}

/**
 * ViewModel — static social-proof figures for the landing page.
 *
 * Kept out of the component so the numbers live next to the rest of the app's
 * data rather than being buried in markup, and can later be swapped for a real
 * source without touching the View.
 */
export function usePlatformStats() {
  const stats: PlatformStat[] = [
    { value: '7+', label: 'Tahun Pengalaman' },
    { value: '98%', label: 'Tingkat Kepuasan' },
    { value: '500+', label: 'Tools Psikotes' },
    { value: '24/7', label: 'Expert Support' },
  ]

  return { stats }
}
