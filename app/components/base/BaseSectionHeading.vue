<script setup lang="ts">
/** Eyebrow + title + subtitle triplet, used above every major section. */
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
    align?: 'left' | 'center'
    /** `dark` inverts the text for headings sitting on a light/brand surface. */
    tone?: 'light' | 'dark'
  }>(),
  { align: 'left', tone: 'light' },
)
</script>

<template>
  <div :class="['flex flex-col gap-3', align === 'center' && 'items-center text-center']">
    <p
      v-if="eyebrow"
      :class="[
        'text-xs font-bold uppercase tracking-[0.2em]',
        tone === 'dark' ? 'text-ink-950/70' : 'text-brand-500',
      ]"
    >
      {{ eyebrow }}
    </p>

    <h2
      :class="[
        'text-balance text-2xl font-extrabold tracking-tight sm:text-3xl',
        tone === 'dark' && 'text-ink-950',
      ]"
    >
      {{ title }}
    </h2>

    <p
      v-if="subtitle"
      :class="[
        'max-w-2xl text-pretty leading-relaxed',
        tone === 'dark' ? 'text-ink-950/75' : 'text-white/60',
      ]"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
