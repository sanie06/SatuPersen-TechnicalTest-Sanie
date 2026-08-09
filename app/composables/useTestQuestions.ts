import bigFiveQuestions from '~~/data/questions-big-five.json'
import type { Question } from '~/types'

/**
 * Registry of question sets, keyed by test id.
 *
 * Only `big-five` is playable in the MVP. Activating another test is two
 * edits — add its JSON here, flip `isActive` in `tests.json` — and every page,
 * route prerender, and progress bar picks it up with no further changes.
 */
const QUESTION_SETS: Record<string, Question[]> = {
  'big-five': bigFiveQuestions as Question[],
}

/**
 * ViewModel — question data for a given test.
 *
 * `testId` is a getter rather than a plain string so this stays reactive when
 * called with a route param that can change without remounting.
 */
export function useTestQuestions(testId: MaybeRefOrGetter<string>) {
  const questions = computed<Question[]>(() => QUESTION_SETS[toValue(testId)] ?? [])

  /** False when a test is listed in the catalog but has no question set yet. */
  const hasQuestions = computed(() => questions.value.length > 0)

  return { questions, hasQuestions }
}
