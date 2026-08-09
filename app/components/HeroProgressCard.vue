<script setup lang="ts">
/**
 * Floating overlay on the hero illustration: a progress meter that fills to
 * 100%, standing in for the "satu persen" idea of getting to know yourself
 * a little at a time.
 *
 * Reuses `useCountUp` rather than growing its own timer — that composable
 * already runs on `requestAnimationFrame` with an ease-out curve and waits for
 * the element to be on screen. The same number drives both the label and the
 * bar width, so the two can never disagree.
 */
withDefaults(defineProps<{ label?: string }>(), { label: 'Berprogres 1% setiap harinya' })

/**
 * Longer than the visible fill: rounding lands the displayed number on 100 at
 * roughly 83% of the curve, so the meter finishes noticeably earlier than the
 * duration set here.
 */
const { el, current } = useCountUp(100, { duration: 5400, threshold: 0.3 })
</script>

<template>
  <!--
    No fixed width: the card shrinks to fit its label. With `whitespace-nowrap`
    below, a fixed width risks the text spilling past the card's own edge the
    moment the wording changes.
  -->
  <div
    ref="el"
    class="rounded-xl border border-white/20 bg-white/10 p-3 shadow-lg shadow-ink-950/40 backdrop-blur-md"
  >
    <p class="whitespace-nowrap text-xs text-white">{{ label }}</p>

    <p class="mt-1.5 text-lg font-bold tabular-nums text-brand-500">
      <!-- Hidden from assistive tech: a screen reader would otherwise read out
           every intermediate number. The bar below carries the real value. -->
      <span aria-hidden="true">{{ current }}%</span>
    </p>

    <div
      class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-700"
      role="progressbar"
      :aria-valuenow="current"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label"
    >
      <div class="h-full rounded-full bg-brand-500" :style="{ width: `${current}%` }" />
    </div>
  </div>
</template>
