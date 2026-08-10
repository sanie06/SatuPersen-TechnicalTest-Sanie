<script setup lang="ts">
import type { TestFaq } from '~/types'

const props = defineProps<{ entries: readonly TestFaq[] }>()

/** `UAccordion` wants `label`/`content`; the Model stores question/answer. */
const items = computed(() =>
  props.entries.map((entry) => ({ label: entry.question, content: entry.answer })),
)
</script>

<template>
  <section v-if="items.length" class="flex flex-col gap-4">
    <h2 class="text-xl font-bold">FAQ</h2>
    <!--
      The slot below must contain exactly ONE root node and nothing else, not
      even a comment. `DisclosureButton` renders as a template and forwards its
      click, id and aria props onto that single child; a second node makes it
      throw. Comments survive in dev and are stripped from the production build,
      so that failure shows up in `npm run dev` only.
    -->
    <UAccordion
      :items="items"
      :ui="{
        wrapper: 'flex flex-col w-full',
        item: {
          base: 'text-sm leading-relaxed text-white/70',
          padding: 'pb-4 pt-1',
        },
      }"
    >
      <template #default="{ item, open }">
        <UButton
          variant="ghost"
          color="white"
          class="w-full justify-between border-b border-white/10 py-4 text-left"
          :ui="{ rounded: 'rounded-none' }"
        >
          <span class="font-bold text-white">{{ item.label }}</span>
          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            :class="[
              'h-5 w-5 shrink-0 text-white/50 transition-transform duration-200',
              open && 'rotate-180',
            ]"
          />
        </UButton>
      </template>
    </UAccordion>
  </section>
</template>
