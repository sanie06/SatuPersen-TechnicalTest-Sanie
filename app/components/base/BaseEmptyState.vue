<script setup lang="ts">
/** Shared empty/not-found panel. Action is optional via the default slot. */
withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
  }>(),
  { icon: 'i-heroicons-magnifying-glass-20-solid' },
)
</script>

<template>
  <div class="glass flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10">
      <UIcon :name="icon" class="h-7 w-7 text-brand-500" />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-lg font-bold">{{ title }}</p>
      <p v-if="description" class="max-w-sm text-sm leading-relaxed text-white/60">
        {{ description }}
      </p>
    </div>

    <slot />
  </div>
</template>
