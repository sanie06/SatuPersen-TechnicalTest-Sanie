<script setup lang="ts">
/**
 * The "cara memaksimalkan hasil" steps.
 *
 * Two behaviours from one set of elements: a 2x2 grid of collapsed titles on
 * mobile, where tapping a card reveals its description, and the plain
 * four-column layout with every description already visible from `lg` up.
 *
 * The description is written once and shown or hidden with classes rather than
 * rendered twice — `lg:block` beats a bare `hidden` because Tailwind emits its
 * breakpoint variants after the base utilities.
 */
defineProps<{
  steps: readonly { icon: string; image?: string; title: string; description: string }[]
}>()

/** Indices currently expanded. Independent toggles, so two can be compared. */
const openSteps = ref<number[]>([])

function toggle(index: number): void {
  const at = openSteps.value.indexOf(index)
  if (at === -1) openSteps.value.push(index)
  else openSteps.value.splice(at, 1)
}

const isOpen = (index: number) => openSteps.value.includes(index)
</script>

<template>
  <!--
    Dividers only once all four sit in one row; in the 2x2 grid below `lg` they
    would cut across the layout rather than between the steps.
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

      <!--
        A button below `lg` and inert text above it: at desktop width the
        description is always on screen, so a control that toggles nothing
        would be a trap for keyboard and screen-reader users. `pointer-events`
        and `tabindex` both have to go, not just the chevron.
      -->
      <button
        type="button"
        :aria-expanded="isOpen(index)"
        :aria-controls="`step-desc-${index}`"
        :tabindex="undefined"
        class="flex items-start justify-between gap-2 text-left lg:pointer-events-none"
        @click="toggle(index)"
      >
        <h3 class="text-base font-bold lg:text-lg">{{ step.title }}</h3>
        <UIcon
          name="i-heroicons-chevron-down-20-solid"
          :class="[
            'mt-0.5 h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 lg:hidden',
            isOpen(index) && 'rotate-180',
          ]"
        />
      </button>

      <p
        :id="`step-desc-${index}`"
        :class="[
          'text-xs leading-relaxed text-white/60 lg:block lg:text-sm',
          isOpen(index) ? 'block' : 'hidden',
        ]"
      >
        {{ step.description }}
      </p>
    </li>
  </ol>
</template>
