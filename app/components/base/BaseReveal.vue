<script setup lang="ts">
/**
 * Fades and lifts its content into place when it scrolls into view, and rewinds
 * once it has fully left, so the motion plays again on the way back.
 *
 * Wraps content rather than being a directive so it composes with the existing
 * layout components without a plugin.
 */
const props = withDefaults(
  defineProps<{
    /** Fraction visible before it triggers. */
    threshold?: number
    /** Stagger, in milliseconds, for items revealing as a group. */
    delay?: number
  }>(),
  { threshold: 0.15, delay: 0 },
)

const { el, isVisible, isReady } = useReveal({ threshold: props.threshold })

/**
 * Only hide once the observer is actually running. Before mount — and under
 * reduced motion, where `isReady` never flips — the content renders in its
 * final state, so nothing is ever stranded invisible.
 */
const isHidden = computed(() => isReady.value && !isVisible.value)
</script>

<template>
  <div
    ref="el"
    class="transition-all duration-700 ease-out motion-reduce:transition-none"
    :class="isHidden ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'"
    :style="{ transitionDelay: isHidden ? '0ms' : `${delay}ms` }"
  >
    <slot />
  </div>
</template>
