<script setup lang="ts">
import type { Test } from '~/types'

const props = defineProps<{ test: Test }>()

const toast = useToast()

/**
 * Inactive tests stay visible in the grid but are not navigable — the card
 * renders as a plain `div` and the CTA explains why.
 */
const isLocked = computed(() => !props.test.isActive)

/**
 * Resolved here in setup, not inline in the template. Calling
 * `resolveComponent()` inside a `:is` binding expression returns the raw
 * string "NuxtLink", which Vue then renders as an unknown element — an inert
 * tag with no anchor and no click handling.
 */
const NuxtLinkComponent = resolveComponent('NuxtLink')

const rootComponent = computed(() => (isLocked.value ? 'div' : NuxtLinkComponent))

/** Only NuxtLink understands `to`; a div would just get a stray attribute. */
const rootProps = computed(() =>
  isLocked.value ? {} : { to: `/psikotes/${props.test.id}` },
)

/**
 * Falls back to the text-only card layout when the artwork is missing — not
 * uploaded yet, wrong extension, typo in the path.
 */
const { imageEl, showImage, markFailed } = useImageFallback(() => props.test.image)

function notifyComingSoon() {
  toast.add({
    title: 'Tes belum tersedia',
    description: `"${props.test.title}" masih dalam pengembangan. Coba Tes Kepribadian Big Five dulu, ya.`,
    icon: 'i-heroicons-clock-20-solid',
    color: 'amber',
  })
}
</script>

<template>
  <component
    :is="rootComponent"
    v-bind="rootProps"
    :class="[
      'glass group relative isolate flex h-full flex-col overflow-hidden rounded-3xl',
      isLocked ? 'opacity-60' : 'glass-hover cursor-pointer',
    ]"
  >
    <!--
      Header image. Fixed 16:9 box so every card in a row is the same height
      regardless of the file's intrinsic dimensions, and so nothing shifts once
      the image finishes loading.
      `alt=""` is deliberate: the title sits directly below, so announcing the
      artwork too would just repeat it.
    -->
    <div v-if="showImage" class="relative aspect-video w-full shrink-0 overflow-hidden bg-white/5">
      <img
        ref="imageEl"
        :src="test.image"
        alt=""
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover"
        @error="markFailed"
      >
      <!-- Softens the seam between artwork and card body. -->
      <div class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-950/60 to-transparent" />
    </div>

    <!--
      Content column. The reveal overlay is scoped to THIS block rather than the
      whole card, so the artwork stays visible on hover. When there is no image,
      this block fills the card and the overlay covers it entirely — one rule
      handles both layouts.
    -->
    <div class="relative flex flex-1 flex-col gap-4 p-6">
      <!--
        Base layer: title and metadata. Fades back as the overlay comes up.

        Gated to `sm`, matching the overlay. Below that the overlay never
        appears, so an ungated fade just empties the card — and on touch the
        hover state sticks after a tap, leaving it blank until the user taps
        somewhere else.
      -->
      <div
        class="flex flex-1 flex-col gap-4 transition-opacity duration-300 sm:group-hover:opacity-0 sm:group-focus-within:opacity-0"
      >
        <div class="flex items-start justify-between gap-3">
          <UBadge variant="soft" color="primary" size="xs" class="font-semibold">
            {{ test.category }}
          </UBadge>

          <UBadge v-if="isLocked" variant="soft" color="gray" size="xs" class="shrink-0">
            Coming Soon
          </UBadge>
          <UIcon
            v-else
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-5 w-5 shrink-0 text-white/30"
          />
        </div>

        <div class="flex flex-1 flex-col gap-2">
          <h3 class="text-balance text-lg font-bold leading-snug">{{ test.title }}</h3>

          <!--
            Touch devices have no hover, so the reveal overlay below would never
            fire and the description would be unreachable. Show it inline on
            small screens instead; from `sm` up the overlay takes over.
          -->
          <p class="line-clamp-3 text-pretty text-sm leading-relaxed text-white/60 sm:hidden">
            {{ test.description }}
          </p>
        </div>

        <div class="flex items-center gap-4 text-xs text-white/50">
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-clock-20-solid" class="h-4 w-4" />
            {{ formatDuration(test.durationMinutes) }}
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-list-bullet-20-solid" class="h-4 w-4" />
            {{ test.totalQuestions }} soal
          </span>
        </div>
      </div>

      <!--
        CTA sits above the overlay (z-20) so it stays clickable and legible once
        the yellow panel is revealed.
      -->
      <UButton
        v-if="isLocked"
        block
        color="gray"
        variant="soft"
        icon="i-heroicons-lock-closed-20-solid"
        class="relative z-20 transition-colors group-hover:bg-ink-950 group-hover:text-white"
        @click="notifyComingSoon"
      >
        Belum Tersedia
      </UButton>

      <!--
        Active cards render the CTA as a span, not a button. A <button> nested
        inside the card's <a> is invalid HTML and swallows the click instead of
        letting it reach the link.
      -->
      <span
        v-else
        class="relative z-20 flex w-full items-center justify-center gap-x-2 rounded-full bg-brand-500 px-3 py-2 text-sm font-semibold text-ink-950 shadow-sm transition-colors duration-300 group-hover:bg-ink-950 group-hover:text-brand-500"
      >
        Lihat Tes
      </span>
    </div>

    <!--
      Reveal overlay. Sits at card level, not inside the content block, so it
      covers the header image too — on hover the card shows the description
      only, not the artwork.

      `pointer-events-none` is essential: without it the overlay would eat the
      click that should follow the link. The CTA above carries `z-20` and so
      still renders on top and stays clickable.

      `group-focus-within` mirrors the hover state for keyboard users, who never
      trigger :hover and would otherwise never see the description.
    -->
    <div
      class="pointer-events-none absolute inset-0 z-10 hidden translate-y-4 flex-col justify-center gap-3 bg-brand-500 px-6 pb-20 pt-6 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none sm:flex"
    >
      <!-- Labels the panel so it reads as an explanation rather than a caption. -->
      <p
        aria-hidden="true"
        class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ink-950/60"
      >
        <UIcon name="i-heroicons-information-circle-20-solid" class="h-4 w-4" />
        Deskripsi
      </p>

      <!-- The title repeats what the base layer already announces, so it is
           hidden from assistive tech to avoid reading it twice. The description
           is NOT hidden: this overlay is its only home on desktop. -->
      <p aria-hidden="true" class="text-balance text-lg font-extrabold leading-snug text-ink-950">
        {{ test.title }}
      </p>
      <p class="text-pretty text-sm font-medium leading-relaxed text-ink-950">
        {{ test.description }}
      </p>
    </div>
  </component>
</template>
