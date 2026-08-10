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
   * ISO timestamp of when the CURRENT sitting began, or `null` while the
   * countdown is paused — the user has left the question page.
   *
   * Paired with `elapsedMs` below, this makes the clock stop when the user
   * steps away and resume where it left off. Time inside a sitting is still
   * derived from the wall clock rather than counted down in a variable, so a
   * throttled or backgrounded tab cannot stretch the limit.
   */
  startedAt: string | null
  /**
   * Milliseconds already spent across previous sittings, banked each time the
   * user leaves the question page. Time in the current sitting is added on top
   * and is not included here until it ends.
   */
  elapsedMs: number
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
