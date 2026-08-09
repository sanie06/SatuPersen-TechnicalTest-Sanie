<script setup lang="ts">
/**
 * The four "kenapa Satu Persen" cards, dealt out as a scattered cascade.
 *
 * Two layouts in one set of elements: a plain stack/grid up to `md`, and the
 * scatter from `lg`. The scatter is deliberately not mobile — overlapping
 * rotated cards on a 390px screen bury each other's text, and the PRD is
 * explicit about mobile-first.
 */
defineProps<{
  benefits: readonly { icon: string; title: string; description: string }[]
}>()

/**
 * Where each card lands once the scatter kicks in: stepping right, with the
 * vertical offset alternating so cards 1 and 3 sit level, and 2 and 4 sit
 * level one step below.
 *
 * The z-order climbs with the index so each card covers the one before it.
 * Reversing it buries the icon of the card underneath, since the cards run
 * left-to-right while their icon sits top-left.
 */
const layout = [
  { position: 'lg:left-0 lg:top-0 lg:z-10', tilt: 'lg:-rotate-6' },
  { position: 'lg:left-[24%] lg:top-10 lg:z-20', tilt: 'lg:rotate-3' },
  { position: 'lg:left-[48%] lg:top-0 lg:z-30', tilt: 'lg:-rotate-3' },
  // Anchored right, not at a fourth percentage: percentages measure the card's
  // left edge, so an evenly spaced last card overhangs the stage by its own
  // width and pushes a horizontal scrollbar onto the page at 1024px.
  { position: 'lg:right-0 lg:top-10 lg:z-40', tilt: 'lg:rotate-6' },
]

/** Stagger between cards, in milliseconds. */
const DROP_DELAY_MS = 200

const { el, isVisible, isReady } = useReveal({ threshold: 0.2 })
</script>

<template>
  <!--
    One horizontal row at every width. Below `lg` it scrolls: four 208px cards
    need 850px of room and a phone offers about 358px, so fitting all four on
    screen at once would leave roughly 85px each — narrower than the words in
    them. The row keeps the desktop shape and readable text; the trade is a
    swipe.

    The negative margin must match `BaseSection`'s gutter exactly — `px-4
    sm:px-6`. Bleeding wider than the gutter pushes a horizontal scrollbar onto
    the whole page, which is what `-mx-6` did at 390px where the gutter is only
    16px.
  -->
  <div
    ref="el"
    :tabindex="0"
    class="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pt-2 sm:-mx-6 sm:px-6 lg:relative lg:mx-auto lg:block lg:h-[19rem] lg:max-w-4xl lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0"
  >
    <div
      v-for="(benefit, index) in benefits"
      :key="benefit.title"
      :class="[
        layout[index]?.position,
        'w-52 shrink-0 snap-start lg:absolute lg:w-64',
        // Before the observer runs, and under reduced motion, the cards render
        // in place. Only an armed observer is allowed to hide them.
        isReady && !isVisible ? 'opacity-0' : '',
        isReady && isVisible ? 'drop-in' : '',
      ]"
      :style="{ animationDelay: `${index * DROP_DELAY_MS}ms` }"
    >
      <!--
        Tilt sits on the inner element on purpose: `dropIn` animates
        `transform`, so a rotation on the same element would be overwritten for
        the whole animation and snap into place at the end. Hover lift is safe
        here — Tailwind composes translate and rotate into one transform.

        The gloss is TWO background layers on one element, not a `::before`
        overlay: a positioned pseudo-element paints above the card's own text
        and would wash it out. The first layer shades the bottom-right corner
        with the page background colour, the second is the yellow body.

        The shade stops at 0.4 alpha and the body copy is solid rather than
        faded: measured against the darkest corner, 0.45 with faded copy came
        out at 3.02 contrast, under the 4.5 WCAG AA needs. This pairing floors
        at 4.78 while looking the same.

        Fully opaque, which matters once the cards overlap — anything
        translucent lets the card beneath show through and the two blocks of
        text tangle into noise.

        `lg:pr-16` clears the strip the next card overlaps, plus what the tilt
        adds, so the covered part is only ever padding.
      -->
      <div
        :class="layout[index]?.tilt"
        class="flex h-full flex-col gap-2.5 rounded-3xl border border-brand-200/70 bg-[linear-gradient(to_top_left,rgba(13,13,26,0.4),transparent_55%),linear-gradient(to_bottom_right,#fce047,#f5c518)] p-4 text-ink-950 shadow-2xl shadow-brand-500/20 transition duration-300 hover:-translate-y-1 hover:border-white hover:shadow-brand-500/40 lg:gap-3 lg:p-6 lg:pr-16"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-950/10 lg:h-11 lg:w-11"
        >
          <UIcon :name="benefit.icon" class="h-4 w-4 text-ink-950 lg:h-5 lg:w-5" />
        </div>
        <h3 class="text-sm font-bold lg:text-base">{{ benefit.title }}</h3>
        <p class="text-xs leading-relaxed text-ink-950 lg:text-sm">{{ benefit.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * Drops in from above and settles with a small overshoot — the control point
 * past 1 on the curve is what produces the bounce, no keyframe needed for it.
 *
 * `both` matters: it holds the opening frame during the stagger delay, so a
 * card that hasn't started yet stays invisible instead of flashing in place.
 *
 * The global `prefers-reduced-motion` rule in `main.css` collapses this to a
 * single instant frame, so no separate opt-out is needed here.
 */
@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-200px) scale(1.2);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.drop-in {
  animation: dropIn 2s cubic-bezier(0.25, 1.5, 0.40, 1) both;
}
</style>
