/**
 * ViewModel — animates a number from zero up to its target.
 *
 * Driven by `requestAnimationFrame`, not a timer: rAF is paced by the display's
 * refresh rate and pauses in background tabs, so the count neither stutters nor
 * burns cycles off-screen. No library involved.
 *
 * Visibility comes from `useReveal`, so this shares one trigger implementation
 * with the section fade-ins. The count replays on every scroll past — leaving
 * the viewport entirely rewinds it to zero.
 *
 * Bind the returned `el` to the element that should trigger the count.
 */
export function useCountUp(
  target: MaybeRefOrGetter<number>,
  options: { duration?: number; threshold?: number } = {},
) {
  const { duration = 1600, threshold = 0.4 } = options

  const { el, isVisible, isReady } = useReveal({ threshold })

  /**
   * Seeded with the final value rather than zero so the prerendered HTML shows
   * the real number — correct for search engines and for anyone without JS, and
   * it keeps server and client markup identical during hydration.
   */
  const current = ref(toValue(target))

  let frame = 0

  function animate() {
    const to = toValue(target)
    const startedAt = performance.now()

    cancelAnimationFrame(frame)

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      // easeOutCubic — fast at first, settling gently on the final number.
      const eased = 1 - (1 - progress) ** 3

      current.value = Math.round(to * eased)

      if (progress < 1) frame = requestAnimationFrame(tick)
      else current.value = to
    }

    frame = requestAnimationFrame(tick)
  }

  watch(isVisible, (visible) => {
    // `isReady` is false under reduced motion or without observer support; in
    // that case the number simply stays at its final value.
    if (!isReady.value) return

    if (visible) {
      animate()
    }
    else {
      cancelAnimationFrame(frame)
      current.value = 0
    }
  })

  onMounted(() => {
    // Rewind so the first pass counts up rather than sitting on the answer.
    // Skipped when reveal is inactive, which keeps the final value on screen.
    nextTick(() => {
      if (isReady.value && !isVisible.value) current.value = 0
    })
  })

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return { el, current }
}
