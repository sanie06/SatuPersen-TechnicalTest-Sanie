<script setup lang="ts">
/**
 * Search + category filter. Purely presentational: it binds to the ViewModel's
 * state via v-model and owns no filtering logic of its own.
 */
defineProps<{ categories: string[]; resultCount: number; hasActiveFilters: boolean }>()

const search = defineModel<string>('search', { required: true })
const category = defineModel<string>('category', { required: true })

const emit = defineEmits<{ reset: [] }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-3 sm:flex-row">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Cari nama tes..."
        size="lg"
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
            aria-label="Hapus pencarian"
            @click="search = ''"
          />
        </template>
      </UInput>

      <USelect
        v-model="category"
        :options="categories"
        size="lg"
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
