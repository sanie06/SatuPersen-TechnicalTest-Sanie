<script setup lang="ts">
import type { PlatformStat } from '~/composables/usePlatformStats'

defineProps<{ stats: PlatformStat[] }>()
</script>

<template>
  <!--
    No individual cards: these sit inside a dark panel that carries its own
    glow, and boxing each figure would cover that glow up. Hairline dividers
    separate the columns instead, and only from `sm` up — in the 2x2 grid below
    that they would cut across the layout rather than between the figures.
  -->
  <dl
    class="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-white/10"
  >
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="flex flex-col items-center gap-1.5 px-2 text-center sm:px-6"
    >
      <!-- `tabular-nums` keeps the width steady while the digits climb, so the
           column doesn't jitter mid-animation. -->
      <dt class="text-4xl font-extrabold tabular-nums tracking-tight text-brand-500 sm:text-5xl">
        <BaseCountUp :value="stat.value" />
      </dt>
      <dd class="text-sm font-medium text-white/60">{{ stat.label }}</dd>
    </div>
  </dl>
</template>
