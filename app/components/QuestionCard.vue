<script setup lang="ts">
import type { Question } from '~/types'

defineProps<{
  question: Question
  /** The score currently selected for this question, if any. */
  selected?: number
  /** 1-based position, for the "Soal 3 dari 10" caption. */
  position: number
  total: number
}>()

const emit = defineEmits<{ select: [score: number] }>()
</script>

<template>
  <div class="glass flex flex-col gap-6 rounded-3xl p-6 sm:p-8">
    <div class="flex flex-col gap-3">
      <!-- Only the current number carries the brand colour; the total is
           muted so the eye lands on where you are, not how many there are.
           Muted here means a faded white — the card sits on the dark
           background, where a faded black would simply disappear. -->
      <p class="text-xs font-bold uppercase tracking-[0.2em]">
        <span class="text-brand-500">Soal {{ position }}</span>
        <span class="text-white/40"> dari {{ total }}</span>
      </p>
      <h2 class="text-balance text-xl font-bold leading-snug sm:text-2xl">
        {{ question.question }}
      </h2>
    </div>

    <fieldset class="flex flex-col gap-3">
      <legend class="sr-only">Pilih jawaban yang paling menggambarkan dirimu</legend>

      <button
        v-for="option in question.options"
        :key="option.label"
        type="button"
        :aria-pressed="selected === option.score"
        :class="[
          'flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition duration-200',
          selected === option.score
            ? 'border-brand-500 bg-brand-500/10 text-white'
            : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25 hover:bg-white/[0.06]',
        ]"
        @click="emit('select', option.score)"
      >
        <span
          :class="[
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition',
            selected === option.score ? 'border-brand-500' : 'border-white/25',
          ]"
        >
          <span v-if="selected === option.score" class="h-2.5 w-2.5 rounded-full bg-brand-500" />
        </span>

        <span class="text-sm font-medium sm:text-base">{{ option.label }}</span>
      </button>
    </fieldset>
  </div>
</template>
