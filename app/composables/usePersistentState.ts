/**
 * ViewModel primitive — `useState` that survives a page refresh.
 *
 * This is the single place localStorage is touched in the whole app. Every
 * other composable persists through it, so there is exactly one implementation
 * of the SSR-safety and corrupt-payload handling below.
 *
 * Why not just `useState` + `watch` at each call site:
 *  - During SSG/SSR there is no `window`, so reads must be deferred to the
 *    client. Doing that inline in every composable is the same code four times.
 *  - A hand-edited or half-written localStorage entry would throw inside
 *    `JSON.parse` and blank the page. It's caught once, here.
 *
 * The initial render always uses `defaultValue` so server HTML and the first
 * client render agree; the stored value is applied on mount, after hydration.
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: () => T,
  options: {
    /** Rejects stored values that no longer match the current model shape. */
    validate?: (value: unknown) => value is T
  } = {},
) {
  const state = useState<T>(key, defaultValue)

  /** False until the stored value has been read, so views can skip a flash. */
  const isHydrated = useState<boolean>(`${key}:hydrated`, () => false)

  function read(): T | null {
    if (import.meta.server) return null

    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return null

      const parsed: unknown = JSON.parse(raw)
      if (options.validate && !options.validate(parsed)) {
        window.localStorage.removeItem(key)
        return null
      }

      return parsed as T
    } catch {
      // Corrupt or unreadable (private mode, quota, manual edit). Start fresh
      // rather than blocking the user from taking the test.
      return null
    }
  }

  function write(value: T): void {
    if (import.meta.server) return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or blocked. The in-memory state still works for this
      // session, so failing silently is better than interrupting the test.
    }
  }

  function clear(): void {
    state.value = defaultValue()
    if (import.meta.client) {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Nothing actionable.
      }
    }
  }

  // Route middleware reads this state too, and there is no component instance
  // there — `onMounted` would warn and never fire. Skipping the whole block is
  // correct in that case: the page that owns the key already hydrated it, and
  // `useState` keeps that value in memory across client-side navigation.
  if (getCurrentInstance())
    onMounted(() => {
      // Read from storage only once per page load. `useState` keeps the value in
      // memory across client-side navigation, so a second read would be wasted
      // work — and could overwrite newer in-memory state with a stale payload.
      if (!isHydrated.value) {
        const stored = read()
        if (stored !== null) state.value = stored

        isHydrated.value = true
      }

      // The watcher, unlike the read, must be registered by EVERY component that
      // uses this key. Vue binds it to the calling component's scope and disposes
      // it on unmount, so navigating detail -> mulai would otherwise leave the
      // state with no watcher at all and silently stop persisting.
      //
      // Registered after the read above so restoring a stored value doesn't
      // immediately trigger a redundant write-back of what we just loaded.
      watch(state, (value) => write(value), { deep: true, flush: 'post' })
    })

  return { state, isHydrated, clear }
}
