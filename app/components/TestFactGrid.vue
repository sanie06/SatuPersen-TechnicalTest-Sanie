<script setup lang="ts">
/**
 * The four at-a-glance facts about a test: duration, question count, category,
 * price. Presentational only — the page decides what the facts are.
 */
defineProps<{ facts: readonly { icon: string; label: string; value: string }[] }>()
</script>

<template>
  <!--
    Deliberately not solid yellow: the "Mulai" button below is the one thing on
    this page that should pull the eye, and four yellow blocks above it would
    out-shout it. These stay dark with a brand-tinted gradient and yellow icons
    — present, but subordinate to the CTA.
  -->
  <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
    <div
      v-for="fact in facts"
      :key="fact.label"
      class="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/[0.09] to-white/[0.02] p-4 transition duration-300 hover:border-brand-500/40 hover:from-brand-500/[0.16]"
    >
      <dt class="flex items-center gap-1.5 text-xs text-white/50">
        <UIcon
          :name="fact.icon"
          class="h-4 w-4 text-brand-500/70 transition-colors duration-300 group-hover:text-brand-500"
        />
        {{ fact.label }}
      </dt>
      <dd class="mt-2 text-lg font-bold">{{ fact.value }}</dd>
    </div>
  </dl>
</template>
