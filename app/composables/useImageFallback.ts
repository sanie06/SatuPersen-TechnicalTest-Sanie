/**
 * ViewModel — tracks whether an image actually loaded, so views can fall back
 * to a layout without it instead of showing a broken-image icon.
 *
 * The `@error` event alone is not enough on a prerendered page: the browser
 * starts fetching from the static HTML long before Vue hydrates, so a 404 fires
 * its error event with no listener attached yet and is lost. `verify()` re-reads
 * the element's real state on mount — a finished load with zero intrinsic width
 * means it failed.
 *
 * Bind `imageEl` as the `<img>` ref and `markFailed` to its `@error`.
 */
export function useImageFallback(src: MaybeRefOrGetter<string | undefined>) {
  const imageEl = ref<HTMLImageElement | null>(null)
  const hasError = ref(false)

  const showImage = computed(() => Boolean(toValue(src)) && !hasError.value)

  function verify(): void {
    const el = imageEl.value
    if (el && el.complete && el.naturalWidth === 0) hasError.value = true
  }

  function markFailed(): void {
    hasError.value = true
  }

  onMounted(verify)

  // A component instance can be reused for a different image (e.g. when a list
  // is filtered), so retry rather than staying in the failed state.
  watch(
    () => toValue(src),
    () => {
      hasError.value = false
      nextTick(verify)
    },
  )

  return { imageEl, hasError, showImage, markFailed }
}
