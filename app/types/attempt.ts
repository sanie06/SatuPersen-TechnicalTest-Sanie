import type { BigFiveTrait } from './question'

/**
 * Model — a user's in-progress or finished run of a test.
 *
 * This is the exact object persisted to localStorage, so any change here is a
 * storage schema change. `version` lets `useTestAttempt` discard stale payloads
 * instead of crashing on a shape it doesn't understand.
 */
export interface TestAttempt {
  version: number
  testId: string
  /** Map of question id -> chosen option score. Sparse until the test is done. */
  answers: Record<number, number>
  /** Zero-based index of the question the user was last looking at. */
  currentIndex: number
  /**
   * ISO timestamp of when the test was opened, set once and never rewritten
   * until the attempt is reset.
   *
   * The countdown is derived from this rather than stored as "seconds left":
   * a stored remainder would freeze while the page was closed, handing back
   * free time on every reload. Anchoring to a wall-clock start means the limit
   * keeps running whatever the user does with the tab.
   */
  startedAt: string | null
  /**
   * ISO timestamp of when the attempt ended — either the user answered the
   * last question, or the time ran out. Non-null means the result is viewable
   * even if some answers are missing.
   */
  completedAt: string | null
}

/** One trait's tally, normalised for rendering as a bar. */
export interface TraitScore {
  trait: BigFiveTrait
  label: string
  description: string
  /** Artwork for this dimension; shown when it comes out on top. */
  image: string
  score: number
  maxScore: number
  /** 0–100, rounded. */
  percentage: number
}

/** Overall verdict shown at the top of the result page. */
export interface ResultSummary {
  totalScore: number
  maxScore: number
  percentage: number
  category: string
  headline: string
  narrative: string
  traits: TraitScore[]
}
