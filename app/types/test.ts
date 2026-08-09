/**
 * Model — catalog entities.
 *
 * These mirror the shape of `data/tests.json` exactly. The JSON is imported
 * with `as Test[]`, so a schema drift shows up as a type error at build time
 * rather than as `undefined` in the UI.
 */

/** Categories a test can belong to. Drives the catalog filter dropdown. */
/**
 * Keep this list in sync with the categories actually present in
 * `data/tests.json` — an unused entry shows up in the catalog filter as an
 * option that always returns zero results.
 */
export const TEST_CATEGORIES = [
  'Kepribadian',
  'Minat & Karier',
  'Kesehatan Mental',
  'Relasi',
] as const

export type TestCategory = (typeof TEST_CATEGORIES)[number]

export interface Test {
  /** Slug used as the route param: `/psikotes/[id]`. */
  id: string
  title: string
  category: TestCategory
  /**
   * Header image path, served from `public/` (e.g. `/images/tests/mbti.webp`).
   *
   * Optional on purpose: a test without this field renders as a text-only card
   * rather than a broken one. The View also falls back to that same text-only
   * layout when the path is set but the file 404s, so entries can be listed
   * here before the artwork is uploaded.
   */
  image?: string
  /**
   * Time limit in minutes. Numeric rather than a display string like
   * "5 Menit" because the countdown derives from it — parsing prose to drive a
   * timer would break the moment the wording changed. Use `formatDuration()`
   * for display.
   */
  durationMinutes: number
  totalQuestions: number
  /** Only one test is playable in the MVP; the rest render as "Coming Soon". */
  isActive: boolean
  description: string
  /**
   * Longer background on the test, shown in a callout on the detail page.
   * Optional — the callout is dropped entirely when absent.
   */
  about?: string
  /** Optional FAQ for the detail page; the section hides when empty. */
  faq?: TestFaq[]
}

export interface TestFaq {
  question: string
  /** Plain paragraphs. Rendered as-is, so no markup. */
  answer: string
}
