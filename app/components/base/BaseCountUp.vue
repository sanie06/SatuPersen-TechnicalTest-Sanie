<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Display string, e.g. "7+", "98%", "500+", "24/7". */
    value: string
    /** Milliseconds for the full count. */
    duration?: number
  }>(),
  { duration: 1600 },
)

/**
 * Splits a leading number off the rest of the string, so only the digits
 * animate and any decoration rides along unchanged:
 *
 *   "98%"  -> 98 + "%"
 *   "500+" -> 500 + "+"
 *   "24/7" -> 24 + "/7"   (counts to 24, keeps "/7" fixed)
 *
 * A value with no leading digits ("Gratis") returns null and renders as-is
 * rather than animating to a meaningless zero.
 */
const parsed = computed(() => {
  const match = props.value.match(/^(\d+)(.*)$/)
  if (!match) return null

  return { number: Number(match[1]), suffix: match[2] ?? '' }
})

const { el, current } = useCountUp(() => parsed.value?.number ?? 0, {
  duration: props.duration,
})
</script>

<template>
  <span v-if="parsed">
    <!--
      The ticking number is hidden from assistive tech: a screen reader would
      otherwise announce a stream of meaningless intermediate values. The real
      figure is exposed once, as text, alongside it.
    -->
    <span ref="el" aria-hidden="true">{{ current }}{{ parsed.suffix }}</span>
    <span class="sr-only">{{ value }}</span>
  </span>

  <span v-else>{{ value }}</span>
</template>
