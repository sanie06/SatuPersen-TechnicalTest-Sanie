<script setup lang="ts">
import type { PlatformStat } from '~/composables/usePlatformStats'

defineProps<{ stats: PlatformStat[] }>()
</script>

<template>
  <!--
    No individual cards: these sit inside a dark panel that carries its own
    glow, and boxing each figure would cover that glow up. Hairline dividers
    separate the columns instead, and only from `sm` up — below that each
    column is about 60px wide and a divider would crowd the digits.

    Four columns at every width. On a 320px screen that leaves roughly 60px
    per figure, which is why the type steps down so far: the numbers drop from
    48px to 18px and the labels to 10px so all four still fit side by side.
  -->
  <dl class="grid grid-cols-4 sm:divide-x sm:divide-white/10">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="flex flex-col items-center gap-1 px-1 text-center sm:gap-1.5 sm:px-6"
    >
      <!-- `tabular-nums` keeps the width steady while the digits climb, so the
           column doesn't jitter mid-animation. -->
      <dt class="text-lg font-extrabold tabular-nums tracking-tight text-brand-500 sm:text-4xl lg:text-5xl">
        <BaseCountUp :value="stat.value" />
      </dt>
      <dd class="text-[0.625rem] font-medium leading-tight text-white/60 sm:text-xs lg:text-sm">{{ stat.label }}</dd>
    </div>
  </dl>
</template>
