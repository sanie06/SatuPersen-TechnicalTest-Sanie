<script setup lang="ts">
/** Numbered "how to take this test" list on the detail page. */
defineProps<{ guidelines: readonly string[] }>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-xl font-bold">Panduan Pengisian</h2>
    <ol class="flex list-none flex-col gap-3">
      <li
        v-for="(guideline, index) in guidelines"
        :key="guideline"
        class="flex items-start gap-3 text-sm leading-relaxed text-white/70"
      >
        <span
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-xs font-extrabold text-brand-500"
        >
          {{ index + 1 }}
        </span>
        <span>{{ guideline }}</span>
      </li>
    </ol>
  </section>
</template>
