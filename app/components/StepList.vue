<script setup lang="ts">
import type { LandingStep } from '~/types'

/**
 * The "cara memaksimalkan hasil" steps.
 *
 * Two behaviours from one set of elements: a 2x2 grid of titles on mobile with
 * a single control that opens every description at once, and the plain
 * four-column layout with all of them already visible from `lg` up.
 *
 * Each description is written once and revealed with classes rather than
 * rendered twice — the `lg:` variants below beat the collapsed state because
 * Tailwind emits its breakpoint variants after the base utilities.
 */
defineProps<{ steps: readonly LandingStep[] }>()

const isOpen = ref(false)
</script>

<template>
  <div class="flex flex-col gap-6 lg:gap-0">
    <!--
      One control for all four, rather than a chevron per card: with the cards
      this narrow, four separate toggles left the grid jumping around as rows
      resized independently.

      Placed above the grid so it lands directly under the section subtitle,
      which lives in the page. Keeping it here rather than lifting the open
      state into `index.vue` keeps the toggle and what it toggles together.
    -->
    <button
      type="button"
      :aria-expanded="isOpen"
      :aria-controls="steps.map((_, index) => `step-desc-${index}`).join(' ')"
      class="mx-auto flex items-center gap-1.5 text-sm font-medium text-white underline underline-offset-4 transition-opacity hover:opacity-80 lg:hidden"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? 'Sembunyikan Deskripsi' : 'Lihat Deskripsi' }}
      <UIcon
        name="i-heroicons-chevron-down-20-solid"
        :class="[
          'h-4 w-4 transition-transform duration-300 motion-reduce:transition-none',
          isOpen && 'rotate-180',
        ]"
      />
    </button>

    <!--
      Dividers only once all four sit in one row; in the 2x2 grid below `lg`
      they would cut across the layout rather than between the steps.
    -->
    <ol
      class="grid grid-cols-2 items-start gap-x-4 gap-y-6 sm:gap-x-6 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10"
    >
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        class="flex flex-col gap-3 lg:gap-4 lg:px-6 lg:first:pl-0 lg:last:pr-0"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-sm font-extrabold tabular-nums text-brand-500"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <StepIcon :icon="step.icon" :image="step.image" />
        </div>

        <h3 class="text-base font-bold lg:text-lg">{{ step.title }}</h3>

        <!--
          Animating `grid-template-rows` from `0fr` to `1fr` is what makes this
          slide instead of snap. Height cannot be transitioned from `0` to
          `auto`, and measuring each paragraph in JS to fake it would break the
          moment the text reflows at another width. The child needs `min-h-0`
          or it refuses to shrink below its content.
        -->
        <div
          :id="`step-desc-${index}`"
          class="grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none lg:grid-rows-[1fr] lg:opacity-100"
          :class="isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        >
          <p class="min-h-0 overflow-hidden text-xs leading-relaxed text-white/60 lg:text-sm">
            {{ step.description }}
          </p>
        </div>
      </li>
    </ol>

  </div>
</template>
