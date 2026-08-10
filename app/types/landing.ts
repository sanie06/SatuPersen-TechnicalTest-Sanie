/**
 * Model — the landing page's editorial content.
 *
 * Typed here rather than inferred at the call site so a copy change that drops
 * a field fails the build instead of rendering a blank.
 */

/** One word of the hero headline. Split per word so each can light up alone. */
export interface HeadlineWord {
  text: string
  /** Rendered in the brand accent colour. */
  brand?: boolean
  /** Forces a line break after this word, fixing the headline's two-line shape. */
  breakAfter?: boolean
}

/** One phrase in the scrolling strip below the hero. */
export interface Tagline {
  lead: string
  /** The part rendered in the accent colour. */
  accent: string
}

/** One numbered step in "Cara Memaksimalkan Hasil Psikotes". */
export interface LandingStep {
  /** Heroicon name, used until `image` exists. */
  icon: string
  /** Optional custom artwork under `public/`, e.g. `/images/icons/foo.png`. */
  image?: string
  title: string
  description: string
}

/** One selling point in "Kenapa Satu Persen". */
export interface Benefit {
  icon: string
  title: string
  description: string
}
