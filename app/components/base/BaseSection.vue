<script setup lang="ts">
/**
 * Page section wrapper: consistent max-width, gutters, and vertical rhythm.
 * Every page composes these instead of repeating `mx-auto max-w-6xl px-4 ...`.
 */
withDefaults(
  defineProps<{
    /** `narrow` for reading/flow pages, `wide` for grids and the landing page. */
    width?: 'narrow' | 'wide'
    /**
     * Vertical padding. `none` hands the spacing to the parent — used by the
     * full-bleed colour bands, which need different top and bottom values.
     */
    spacing?: 'none' | 'tight' | 'normal' | 'loose'
  }>(),
  { width: 'wide', spacing: 'normal' },
)

const widthClass = {
  narrow: 'max-w-3xl',
  wide: 'max-w-6xl',
} as const

const spacingClass = {
  none: '',
  tight: 'py-8',
  normal: 'py-12 sm:py-16',
  loose: 'py-16 sm:py-24',
} as const
</script>

<template>
  <section :class="['mx-auto w-full px-4 sm:px-6', widthClass[width], spacingClass[spacing]]">
    <slot />
  </section>
</template>
