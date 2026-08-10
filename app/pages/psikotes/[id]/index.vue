<script setup lang="ts">
const route = useRoute()
const testId = route.params.id as string

const { findTest } = useTestCatalog()
const test = findTest(testId)

// Unknown slug — surface a real 404 rather than rendering an empty shell.
if (!test) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tes tidak ditemukan',
    fatal: true,
  })
}

const { hasQuestions } = useTestQuestions(() => testId)
const { hasProgress, answeredCount, totalQuestions, isHydrated, isFinished, reset } =
  useTestAttempt(testId)

const isPlayable = computed(() => test.isActive && hasQuestions.value)

/** Saved progress only exists client-side, so gate the resume UI on hydration. */
const showResume = computed(() => isHydrated.value && hasProgress.value && !isFinished.value)

/**
 * Keyed on `isFinished` rather than on every question being answered: a run
 * that hit the time limit is over too, and offering to "resume" it would lead
 * to a page that immediately bounces to the result.
 */
const showFinished = computed(() => isHydrated.value && isFinished.value)

/**
 * Reached by coming back here from the result page — the only route that keeps
 * a finished attempt alive, since leaving the test's pages discards it. Clear
 * it here so the run below starts from an empty sheet and a fresh clock.
 */
function restartIfFinished() {
  if (isFinished.value) reset()
}

/** Hidden entirely when the artwork is missing, rather than showing a broken box. */
const { imageEl, showImage, markFailed } = useImageFallback(() => test.image)

const facts = computed(() => [
  {
    icon: 'i-heroicons-clock-20-solid',
    label: 'Durasi',
    value: formatDuration(test.durationMinutes),
  },
  {
    icon: 'i-heroicons-list-bullet-20-solid',
    label: 'Jumlah soal',
    value: `${test.totalQuestions} soal`,
  },
  { icon: 'i-heroicons-tag-20-solid', label: 'Kategori', value: test.category },
  { icon: 'i-heroicons-banknotes-20-solid', label: 'Biaya', value: 'Gratis' },
])

/**
 * Written against how this app actually behaves, not copied from the reference
 * layout: the test here IS time-limited and progress IS kept on refresh, which
 * is the opposite of what the original guidance says.
 */
const guidelines = computed(() => [
  'Luangkan waktumu sejenak. Cari tempat yang nyaman supaya kamu bisa fokus menjawab tanpa gangguan.',
  'Tidak ada jawaban yang benar atau salah. Pilih yang paling jujur mewakili dirimu, bukan yang terdengar paling baik.',
  `Tes ini dibatasi waktu ${formatDuration(test.durationMinutes)}. Hitung mundur hanya berjalan selama kamu berada di halaman pengerjaan.`,
  'Jawab spontan. Jawaban pertama yang terlintas biasanya paling menggambarkan dirimu.',
  'Progresmu tersimpan otomatis di browser. Kalau kamu keluar sebentar, jawaban tetap aman dan hitung mundurnya ikut berhenti sampai kamu kembali.',
  'Begitu soal terakhir terjawab atau waktu habis, ringkasan hasilmu langsung muncul.',
])

/** `UAccordion` wants `label`/`content`; the model stores question/answer. */
const faqItems = computed(() =>
  (test.faq ?? []).map((entry) => ({ label: entry.question, content: entry.answer })),
)

useHead({ title: `${test.title} — Psikotes Gratis Satu Persen` })
</script>

<template>
  <BaseSection width="narrow">
    <UButton
      to="/psikotes"
      variant="link"
      color="gray"
      icon="i-heroicons-arrow-left-20-solid"
      :padded="false"
      class="mb-8"
    >
      Kembali ke katalog
    </UButton>

    <div class="flex flex-col gap-10">
      <!-- Hero artwork, mirroring how the test appears in the catalog. -->
      <div v-if="showImage" class="mx-auto w-full max-w-md">
        <img
          ref="imageEl"
          :src="test.image"
          alt=""
          width="539"
          height="303"
          class="w-full rounded-3xl"
          @error="markFailed"
        >
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge variant="soft" color="primary" class="font-semibold">
            {{ test.category }}
          </UBadge>
          <UBadge v-if="!isPlayable" variant="soft" color="gray">Coming Soon</UBadge>
        </div>

        <h1 class="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          {{ test.title }}
        </h1>

        <p class="text-pretty text-lg leading-relaxed text-white/60">
          {{ test.description }}
        </p>
      </div>

      <!--
        Deliberately not solid yellow: the "Mulai" button directly below is the
        one thing on this page that should pull the eye, and four yellow blocks
        above it would out-shout it. These stay dark with a brand-tinted
        gradient and yellow icons — present, but subordinate to the CTA.
      -->
      <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="fact in facts"
          :key="fact.label"
          class="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/[0.09] to-white/[0.02] p-4 transition duration-300 hover:border-brand-500/40 hover:from-brand-500/[0.16]"
        >
          <dt class="flex items-center gap-1.5 text-xs text-white/50">
            <UIcon
              :name="fact.icon"
              class="h-4 w-4 text-brand-500/70 transition-colors duration-300 group-hover:text-brand-500"
            />
            {{ fact.label }}
          </dt>
          <dd class="mt-2 text-lg font-bold">{{ fact.value }}</dd>
        </div>
      </dl>

      <!-- Resume banner: only when a partly-finished attempt is in storage. -->
      <div
        v-if="showResume"
        class="glass flex flex-col gap-4 rounded-3xl border-brand-500/30 p-6"
      >
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-arrow-path-rounded-square-20-solid"
            class="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
          />
          <div class="flex flex-col gap-1">
            <p class="font-bold">Kamu punya progres yang tersimpan</p>
            <p class="text-sm text-white/60">
              {{ answeredCount }} dari {{ totalQuestions }} soal sudah terjawab. Lanjutkan dari
              tempat terakhir, atau ulangi dari awal.
            </p>
          </div>
        </div>

        <BaseProgressBar
          :value="Math.round((answeredCount / Math.max(totalQuestions, 1)) * 100)"
          size="sm"
          aria-label="Progres tersimpan"
        />
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <UButton
          v-if="isPlayable"
          :to="`/psikotes/${test.id}/mulai`"
          size="xl"
          color="primary"
          trailing-icon="i-heroicons-arrow-right-20-solid"
          class="justify-center font-bold text-ink-950"
          @click="restartIfFinished"
        >
          {{ showFinished ? 'Ulangi Tes' : showResume ? 'Lanjutkan Tes' : 'Mulai' }}
        </UButton>

        <UButton
          v-else
          size="xl"
          color="gray"
          variant="soft"
          disabled
          icon="i-heroicons-lock-closed-20-solid"
          class="justify-center"
        >
          Tes Belum Tersedia
        </UButton>

        <UButton
          v-if="showResume"
          size="xl"
          color="white"
          variant="ghost"
          icon="i-heroicons-trash-20-solid"
          class="justify-center"
          @click="reset"
        >
          Ulangi dari awal
        </UButton>

        <UButton
          v-if="showFinished"
          :to="`/psikotes/${test.id}/hasil`"
          size="xl"
          color="white"
          variant="ghost"
          icon="i-heroicons-chart-bar-20-solid"
          class="justify-center"
        >
          Lihat Hasil
        </UButton>
      </div>

      <!-- Panduan Pengisian -->
      <section class="flex flex-col gap-4">
        <h2 class="text-xl font-bold">Panduan Pengisian</h2>
        <ol class="flex list-none flex-col gap-3">
          <li
            v-for="(guideline, index) in guidelines"
            :key="guideline"
            class="flex items-start gap-3 text-sm leading-relaxed text-white/70"
          >
            <span
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-xs font-extrabold text-brand-500"
            >
              {{ index + 1 }}
            </span>
            <span>{{ guideline }}</span>
          </li>
        </ol>
      </section>

      <!--
        Background on the test itself. A brand-tinted dark panel rather than
        solid yellow: solid would read as the same surface as the "Mulai"
        button above and blunt it. Same treatment as the numbered step badges,
        so the two feel like one family.

        The body stays near-white, not brand yellow — yellow works for a single
        glyph like a step number, but a paragraph of it is tiring to read.
      -->
      <section
        v-if="test.about"
        class="rounded-3xl border border-brand-500/25 bg-brand-500/[0.12] p-6 sm:p-8"
      >
        <p class="text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
          {{ test.about }}
        </p>
      </section>

      <!-- FAQ -->
      <section v-if="faqItems.length" class="flex flex-col gap-4">
        <h2 class="text-xl font-bold">FAQ</h2>
        <!--
          The slot below must contain exactly ONE root node and nothing else,
          not even a comment. `DisclosureButton` renders as a template and
          forwards its click, id and aria props onto that single child; a second
          node makes it throw. Comments survive in dev and are stripped from the
          production build, so that failure shows up in `npm run dev` only.
        -->
        <UAccordion
          :items="faqItems"
          :ui="{
            wrapper: 'flex flex-col w-full',
            item: {
              base: 'text-sm leading-relaxed text-white/70',
              padding: 'pb-4 pt-1',
            },
          }"
        >
          <template #default="{ item, open }">
            <UButton
              variant="ghost"
              color="white"
              class="w-full justify-between border-b border-white/10 py-4 text-left"
              :ui="{ rounded: 'rounded-none' }"
            >
              <span class="font-bold text-white">{{ item.label }}</span>
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                :class="[
                  'h-5 w-5 shrink-0 text-white/50 transition-transform duration-200',
                  open && 'rotate-180',
                ]"
              />
            </UButton>
          </template>
        </UAccordion>
      </section>

      <p v-if="!isPlayable" class="text-center text-sm text-white/50">
        Tes ini masih dalam pengembangan.
        <NuxtLink to="/psikotes/big-five" class="font-semibold text-brand-500 hover:underline">
          Coba Tes Kepribadian Big Five
        </NuxtLink>
        sambil menunggu.
      </p>
    </div>
  </BaseSection>
</template>
