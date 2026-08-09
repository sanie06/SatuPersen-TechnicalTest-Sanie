<script setup lang="ts">
/**
 * Brand-styled progress bar. Used both as live test progress and as the static
 * score visualisation on the result page — same component, same look.
 */
const props = withDefaults(
  defineProps<{
    /** 0–100. Clamped, so callers don't have to guard their arithmetic. */
    value: number
    label?: string
    /** Renders the percentage next to the label. */
    showValue?: boolean
    size?: 'sm' | 'md'
    /** Announce updates to screen readers as the user progresses. */
    ariaLabel?: string
    /**
     * Sweeps a highlight across the filled part, on a loop. Opt-in because the
     * result page uses this same component for a finished score, where a bar
     * that keeps moving would suggest something is still in progress.
     */
    shine?: boolean
  }>(),
  { showValue: false, size: 'md', shine: false },
)

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.value))))

const heightClass = computed(() => (props.size === 'sm' ? 'h-1.5' : 'h-2.5'))
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div v-if="label || showValue" class="flex items-baseline justify-between gap-4">
      <span v-if="label" class="text-sm font-medium text-white/70">{{ label }}</span>
      <span v-if="showValue" class="text-sm font-bold tabular-nums text-brand-500">
        {{ clamped }}%
      </span>
    </div>

    <div
      :class="['w-full overflow-hidden rounded-full bg-white/10', heightClass]"
      role="progressbar"
      :aria-valuenow="clamped"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="ariaLabel ?? label"
    >
      <div
        class="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-brand-400 to-brand-500 transition-[width] duration-500 ease-out"
        :style="{ width: `${clamped}%` }"
      >
        <!-- Clipped by the fill, so the highlight only ever travels across the
             completed part rather than the empty track behind it. -->
        <span
          v-if="shine"
          aria-hidden="true"
          class="progress-shine absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * Starts one bar-width off to the left and travels two widths right, so the
 * highlight enters from outside the fill and leaves the same way — no visible
 * pop-in at either edge.
 *
 * The global `prefers-reduced-motion` rule in `main.css` collapses this to a
 * single instant frame, so no separate opt-out is needed here.
 */
@keyframes progressShine {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(200%);
  }
}

.progress-shine {
  animation: progressShine 2s ease-in-out infinite;
}
</style>
