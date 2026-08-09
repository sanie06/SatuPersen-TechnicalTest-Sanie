import testsData from '~~/data/tests.json'
import { TEST_CATEGORIES, type Test, type TestCategory } from '~/types'

/** Sentinel for "no category filter". Keeps the select a plain string union. */
export const ALL_CATEGORIES = 'Semua' as const

type CategoryFilter = typeof ALL_CATEGORIES | TestCategory

// Cast once, at the only point the raw JSON enters the app. Everything
// downstream is typed.
const tests = testsData as Test[]

/**
 * ViewModel — the test catalog: source data, search, and category filtering.
 *
 * Filtering is client-side and derived (`computed`), so typing in the search
 * box re-renders the grid without a route change, per the acceptance criteria.
 */
export function useTestCatalog() {
  // `useState` rather than `ref` so the query survives navigating to a test
  // detail page and back — the user returns to the list they had filtered.
  const searchQuery = useState<string>('catalog:search', () => '')
  const selectedCategory = useState<CategoryFilter>('catalog:category', () => ALL_CATEGORIES)

  /** Options for the filter dropdown, with "Semua" first. */
  const categoryOptions = computed<CategoryFilter[]>(() => [ALL_CATEGORIES, ...TEST_CATEGORIES])

  const filteredTests = computed<Test[]>(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const category = selectedCategory.value

    return tests.filter((test) => {
      const matchesCategory = category === ALL_CATEGORIES || test.category === category
      if (!matchesCategory) return false

      if (!query) return true
      // Match the description too, so searching "karier" finds relevant tests
      // even when the word isn't in the title.
      return (
        test.title.toLowerCase().includes(query) ||
        test.description.toLowerCase().includes(query)
      )
    })
  })

  const hasActiveFilters = computed(
    () => searchQuery.value.trim() !== '' || selectedCategory.value !== ALL_CATEGORIES,
  )

  const isEmpty = computed(() => filteredTests.value.length === 0)

  function resetFilters(): void {
    searchQuery.value = ''
    selectedCategory.value = ALL_CATEGORIES
  }

  /** Lookup by route param. Returns `undefined` for an unknown id. */
  function findTest(id: string): Test | undefined {
    return tests.find((test) => test.id === id)
  }

  /**
   * Tests to suggest after finishing `currentId`.
   *
   * Same category first, since that is the closest match, then anything else to
   * top up — with only one test per category in places, restricting this to the
   * category alone would often return one card or none.
   *
   * Playable tests are ordered ahead of "Coming Soon" ones within each group, so
   * the moment another test is switched on it surfaces without touching this.
   */
  function recommendTests(currentId: string, limit = 3): Test[] {
    const current = findTest(currentId)
    const pool = tests.filter((test) => test.id !== currentId)

    const playableFirst = (a: Test, b: Test) => Number(b.isActive) - Number(a.isActive)

    const sameCategory = pool
      .filter((test) => test.category === current?.category)
      .sort(playableFirst)

    const rest = pool
      .filter((test) => test.category !== current?.category)
      .sort(playableFirst)

    return [...sameCategory, ...rest].slice(0, limit)
  }

  return {
    tests,
    searchQuery,
    selectedCategory,
    categoryOptions,
    filteredTests,
    hasActiveFilters,
    isEmpty,
    resetFilters,
    findTest,
    recommendTests,
  }
}
