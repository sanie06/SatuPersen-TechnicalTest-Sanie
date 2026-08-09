import { discardFinishedAttempt } from '~/composables/useTestAttempt'

/** `/psikotes/<id>` and everything under it; `null` for the catalog itself. */
function testIdFromPath(path: string): string | null {
  return /^\/psikotes\/([^/]+)/.exec(path)?.[1] ?? null
}

/**
 * Clears a completed attempt once the user navigates out of that test's pages.
 *
 * Without this, finishing a test left its result in localStorage forever: the
 * detail page's primary action bounced straight back to the result screen and
 * the test could not be retaken.
 *
 * Only fires on client-side navigation between two different tests' pages (or
 * out of the test flow entirely). On a first load or a hard refresh `from`
 * equals `to`, so a result survives reloading the page it lives on.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return

  const leaving = testIdFromPath(from.path)
  if (!leaving || leaving === testIdFromPath(to.path)) return

  discardFinishedAttempt(leaving)
})
