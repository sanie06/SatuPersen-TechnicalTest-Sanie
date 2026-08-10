<script setup lang="ts">
/**
 * A step's icon: a custom image when one is supplied and actually loads,
 * otherwise the Heroicon that step already had.
 *
 * A component rather than inline markup because `useImageFallback` registers a
 * mount hook per instance — used inside a `v-for` in the page it would bind to
 * the page, not to each item, and one missing file would blank them all.
 */
const props = defineProps<{
  /** Heroicon name, used when `image` is absent or fails to load. */
  icon: string
  /** Path under `public/`, e.g. `/images/icons/jawab-dengan-jujur.png`. */
  image?: string
}>()

const { imageEl, showImage, markFailed } = useImageFallback(() => props.image)
</script>

<template>
  <!--
    Decorative: the step's own heading says the same thing, so an alt text here
    would just be read out twice.
  -->
  <img
    v-if="showImage"
    ref="imageEl"
    :src="image"
    alt=""
    width="96"
    height="96"
    loading="lazy"
    class="h-6 w-6 object-contain"
    @error="markFailed"
  />
  <UIcon v-else :name="icon" class="h-6 w-6 text-white/30" />
</template>
