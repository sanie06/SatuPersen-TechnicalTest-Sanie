<script setup lang="ts">
import type { TraitScore } from '~/types'

defineProps<{ traits: TraitScore[] }>()
</script>

<template>
  <ul class="flex flex-col gap-6">
    <li v-for="trait in traits" :key="trait.trait" class="flex flex-col gap-2">
      <div class="flex items-baseline justify-between gap-4">
        <p class="font-semibold">{{ trait.label }}</p>
        <p class="shrink-0 text-sm tabular-nums text-white/50">
          {{ trait.score }} / {{ trait.maxScore }}
        </p>
      </div>

      <BaseProgressBar :value="trait.percentage" size="sm" :aria-label="trait.label" />

      <p class="text-sm leading-relaxed text-white/50">{{ trait.description }}</p>
    </li>
  </ul>
</template>
