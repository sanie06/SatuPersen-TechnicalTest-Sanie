<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)
</script>

<template>
  <NuxtLayout>
    <BaseSection width="narrow" spacing="loose">
      <div class="flex flex-col items-center gap-6 text-center">
        <p class="text-gradient-brand text-7xl font-extrabold">{{ error.statusCode }}</p>

        <h1 class="text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
          {{ isNotFound ? 'Halaman tidak ditemukan' : 'Ada yang tidak beres' }}
        </h1>

        <p class="max-w-md text-pretty leading-relaxed text-white/60">
          {{
            isNotFound
              ? 'Tes yang kamu cari mungkin sudah dipindahkan atau belum tersedia. Coba lihat katalog lengkapnya.'
              : 'Coba muat ulang halaman ini. Kalau masih bermasalah, kembali ke katalog tes.'
          }}
        </p>

        <div class="flex flex-col gap-3 sm:flex-row">
          <UButton
            size="lg"
            color="primary"
            class="justify-center font-semibold text-ink-950"
            @click="clearError({ redirect: '/psikotes' })"
          >
            Ke Katalog Tes
          </UButton>
          <UButton
            size="lg"
            color="white"
            variant="ghost"
            class="justify-center"
            @click="clearError({ redirect: '/' })"
          >
            Kembali ke Beranda
          </UButton>
        </div>
      </div>
    </BaseSection>
  </NuxtLayout>
</template>
