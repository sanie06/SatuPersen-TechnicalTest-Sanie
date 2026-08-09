<script setup lang="ts">
const {
  searchQuery,
  selectedCategory,
  categoryOptions,
  filteredTests,
  hasActiveFilters,
  isEmpty,
  resetFilters,
} = useTestCatalog()

useHead({
  title: 'Katalog Tes — Psikotes Gratis Satu Persen',
})
</script>

<template>
  <BaseSection>
    <BaseSectionHeading
      eyebrow="Katalog"
      title="Pilih tes yang ingin kamu coba"
      subtitle="Cari berdasarkan nama atau saring per kategori. Semua tes gratis dan tidak perlu mendaftar."
      class="mb-10"
    />

    <TestCatalogFilters
      v-model:search="searchQuery"
      v-model:category="selectedCategory"
      :categories="categoryOptions"
      :result-count="filteredTests.length"
      :has-active-filters="hasActiveFilters"
      class="mb-10"
      @reset="resetFilters"
    />

    <BaseEmptyState
      v-if="isEmpty"
      title="Tes tidak ditemukan"
      description="Coba kata kunci lain, atau reset filter untuk melihat seluruh katalog."
    >
      <UButton color="primary" class="font-semibold text-ink-950" @click="resetFilters">
        Reset filter
      </UButton>
    </BaseEmptyState>

    <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <TestCard v-for="test in filteredTests" :key="test.id" :test="test" />
    </div>
  </BaseSection>
</template>
