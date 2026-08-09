<script setup lang="ts">
export interface MarqueeItem {
  /** Leading words, rendered in the base text colour. */
  lead: string
  /** Trailing words, rendered in the accent colour. */
  accent?: string
}

const props = withDefaults(
  defineProps<{
    items: MarqueeItem[]
    /** Seconds for one full pass. Higher = slower. */
    duration?: number
    /**
     * How many times the list repeats inside one copy. A copy must be wider
     * than the viewport or the strip shows empty space at the trailing edge;
     * with a handful of short phrases one pass is not enough on a wide screen.
     */
    repeat?: number
  }>(),
  { duration: 30, repeat: 2 },
)

/** The list repeated `repeat` times — the content of a single copy. */
const loopItems = computed(() =>
  Array.from({ length: props.repeat }, () => props.items).flat(),
)
</script>

<template>
  <div class="relative overflow-hidden bg-white py-5">
    <!--
      The track holds `loopItems` twice. The animation shifts it by exactly
      -50%, which lands the second copy precisely where the first started — so
      the loop restarts with no visible seam. Any other offset would jump.
    -->
    <div
      class="marquee-track flex w-max motion-reduce:animate-none"
      :style="{ '--marquee-duration': `${duration}s` }"
    >
      <div
        v-for="copy in 2"
        :key="copy"
        class="flex shrink-0 items-center"
        :aria-hidden="copy === 2 ? 'true' : undefined"
      >
        <span v-for="(item, index) in loopItems" :key="`${item.lead}-${index}`" class="flex items-center">
          <span class="whitespace-nowrap px-8 text-base font-bold text-ink-950 sm:px-12 sm:text-xl">
            {{ item.lead }}
            <span v-if="item.accent" class="text-brand-800">{{ item.accent }}</span>
          </span>
          <!-- Separator between phrases, so they don't read as one sentence. -->
          <span aria-hidden="true" class="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-800" />
        </span>
      </div>
    </div>
  </div>
</template>
