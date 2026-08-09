<script setup lang="ts">
/**
 * Search + category filter. Purely presentational: it binds to the ViewModel's
 * state via v-model and owns no filtering logic of its own.
 */
defineProps<{ categories: string[]; resultCount: number; hasActiveFilters: boolean }>()

const search = defineModel<string>('search', { required: true })
const category = defineModel<string>('category', { required: true })

const emit = defineEmits<{ reset: [] }>()

/**
 * Shared look for the search field and the category select.
 *
 * Deliberately quiet: yellow is this site's action colour, so a yellow field
 * outshouts the card CTAs it sits above — and a solid white one is worse, being
 * the brightest thing on a dark page. The fields stay dark and the brand colour
 * marks focus instead, which is the one moment it carries information.
 *
 * Every value is repeated with a `dark:` variant. Nuxt UI merges these strings
 * with its own component defaults, and tailwind-merge only drops a default when
 * the incoming class conflicts at the same variant — colour mode is forced to
 * dark here, so a bare `bg-white/5` would lose to the surviving
 * `dark:bg-gray-900`.
 */
const FIELD_UI = {
  rounded: 'rounded-lg',
  base: 'transition-shadow duration-200',
  placeholder: 'placeholder-white/40 dark:placeholder-white/40',
  icon: { base: 'text-white/40 dark:text-white/40' },
  /*
   * The colours go in `variant.none`, not in `base`. Nuxt UI concatenates the
   * variant string AFTER the base one, so anything set in `base` loses the
   * tailwind-merge — the stock `variant="none"` ends in `focus:ring-0
   * focus:shadow-none`, which flattened the focus ring to zero width even
   * though `focus:ring-brand-500` was present and applied.
   */
  variant: {
    none: [
      'bg-white/5 dark:bg-white/5',
      'text-white dark:text-white',
      'ring-1 ring-inset ring-white/15 dark:ring-white/15',
      'hover:ring-white/25 dark:hover:ring-white/25',
      'focus:ring-2 focus:ring-inset focus:ring-brand-500 dark:focus:ring-brand-500',
    ].join(' '),
  },
} as const

/**
 * The dropdown panel. `USelectMenu` renders its own list in the DOM, unlike
 * `USelect`, whose list is drawn by the operating system and therefore looks
 * different on every device.
 */
const MENU_UI = {
  background: 'bg-ink-950/95 dark:bg-ink-950/95',
  ring: 'ring-1 ring-white/10 dark:ring-white/10',
  rounded: 'rounded-lg',
  shadow: 'shadow-xl shadow-ink-950/50',
  option: {
    color: 'text-white/70 dark:text-white/70',
    active: 'bg-white/5 dark:bg-white/5 text-white dark:text-white',
    selected: 'pe-7 text-brand-500 dark:text-brand-500',
    selectedIcon: {
      base: 'h-5 w-5 flex-shrink-0 text-brand-500 dark:text-brand-500',
    },
  },
} as const
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-3 sm:flex-row">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Cari nama tes..."
        size="lg"
        variant="none"
        :ui="FIELD_UI"
        class="flex-1"
        aria-label="Cari tes berdasarkan nama"
      >
        <template #trailing>
          <UButton
            v-show="search"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            class="text-white/40 hover:text-white dark:text-white/40 dark:hover:text-white"
            aria-label="Hapus pencarian"
            @click="search = ''"
          />
        </template>
      </UInput>

      <USelectMenu
        v-model="category"
        :options="categories"
        size="lg"
        variant="none"
        :ui="FIELD_UI"
        :ui-menu="MENU_UI"
        :popper="{ placement: 'bottom-start', offsetDistance: 6 }"
        class="sm:w-56"
        aria-label="Filter berdasarkan kategori"
      />
    </div>

    <div class="flex items-center justify-between gap-4">
      <p class="text-sm text-white/50">
        Menampilkan <span class="font-semibold text-white">{{ resultCount }}</span> tes
      </p>

      <UButton
        v-if="hasActiveFilters"
        variant="link"
        color="primary"
        size="xs"
        icon="i-heroicons-arrow-path-20-solid"
        :padded="false"
        @click="emit('reset')"
      >
        Reset filter
      </UButton>
    </div>
  </div>
</template>
