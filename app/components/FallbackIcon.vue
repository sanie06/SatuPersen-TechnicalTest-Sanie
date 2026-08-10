<script setup lang="ts">
/**
 * Renders custom artwork when the file exists, and the given Heroicon when it
 * does not — so icons can be swapped in one at a time without the page ever
 * showing a broken image.
 *
 * A component rather than inline markup because `useImageFallback` registers a
 * mount hook per instance. Used directly inside a `v-for` it would bind to the
 * page instead of to each item, and one missing file would blank them all.
 *
 * Sizing and colour come from the caller's `class`, which falls through to
 * whichever branch renders.
 */
const props = defineProps<{
  /** Heroicon name, used when `image` is absent or fails to load. */
  icon: string
  /** Path under `public/`, e.g. `/images/icons/star-result.svg`. */
  image?: string
}>()

const { imageEl, showImage, markFailed } = useImageFallback(() => props.image)
</script>

<template>
  <!-- Decorative: the heading beside it already carries the meaning. -->
  <img
    v-if="showImage"
    ref="imageEl"
    :src="image"
    alt=""
    width="96"
    height="96"
    loading="lazy"
    class="object-contain"
    @error="markFailed"
  />
  <UIcon v-else :name="icon" />
</template>
