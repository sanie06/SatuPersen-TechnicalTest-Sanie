/**
 * ViewModel — tracks whether an element is currently in the viewport.
 *
 * The single source of "is this on screen" for scroll-triggered motion: both
 * the section fade-ins and the statistic count-up read from it, so the trigger
 * logic exists once.
 *
 * The motion replays: scrolling back up and down through a section plays it
 * again. What it does NOT do is toggle on every small scroll adjustment — see
 * the two-threshold arrangement below.
 *
 * Bind `el` to the element being watched.
 */
export function useReveal(
  options: {
    /** Fraction of the element that must be visible to count as revealed. */
    threshold?: number
    /** Reveal once and stop watching, instead of replaying on every pass. */
    once?: boolean
  } = {},
) {
  const { threshold = 0.15, once = false } = options

  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  /**
   * False until mounted. Views use this to decide whether to apply their
   * hidden state at all — prerendered HTML must render fully visible, both for
   * anyone without JS and to keep server and client markup identical during
   * hydration.
   */
  const isReady = ref(false)

  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Reduced motion, or no observer support: stay visible forever. Leaving
    // `isReady` false means the view never applies its hidden state, so content
    // can't end up stranded off-screen.
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined' || !el.value) {
      isVisible.value = true
      return
    }

    isReady.value = true

    /*
     * Two thresholds, deliberately far apart — this is hysteresis, and it is
     * what stops the flicker.
     *
     * Revealing and rewinding on the SAME threshold means an element parked at
     * that exact point crosses it back and forth on every tiny scroll
     * adjustment, and the animation strobes. So: reveal as soon as `threshold`
     * of the element is on screen, but only rewind once it is completely gone
     * (ratio 0). Between those two points nothing changes state, which is a
     * wide enough dead zone that no amount of nudging can retrigger it.
     */
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.intersectionRatio >= threshold) {
          isVisible.value = true
          if (once) observer?.disconnect()
        }
        else if (!once && !entry.isIntersecting) {
          // Fully off screen: rewind so the next pass plays the motion again.
          isVisible.value = false
        }
      },
      { threshold: [0, threshold] },
    )

    observer.observe(el.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { el, isVisible, isReady }
}
