<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const testId = route.params.id as string

const { findTest, recommendTests } = useTestCatalog()
const test = findTest(testId)

if (!test) {
  throw createError({ statusCode: 404, statusMessage: 'Tes tidak ditemukan', fatal: true })
}

const { summary, dominantTrait, isFinished, unansweredCount, isHydrated, reset } =
  useTestResult(testId)

/**
 * Answers live only in localStorage, so this is unknowable until hydration.
 * Until then the page shows a skeleton rather than a misleading empty state.
 *
 * Keyed on `isFinished`, not on every question being answered: a run that hit
 * the time limit is closed with blanks left, and it still deserves its score.
 * Unanswered questions simply contribute zero.
 */
const showResult = computed(() => isHydrated.value && isFinished.value)
const showEmpty = computed(() => isHydrated.value && !isFinished.value)

/** Finished with blanks means the clock ran out — worth saying so plainly. */
const ranOutOfTime = computed(() => isFinished.value && unansweredCount.value > 0)

/** Where to go next, once there is a result to move on from. */
const recommended = computed(() => recommendTests(testId))

/**
 * Artwork for the winning dimension. Hidden entirely until the file exists, so
 * the callout falls back to text rather than showing a broken image.
 */
const {
  imageEl: traitImageEl,
  showImage: showTraitImage,
  markFailed: markTraitImageFailed,
} = useImageFallback(() => dominantTrait.value?.image)

function retake() {
  reset()
  router.push(`/psikotes/${testId}/mulai`)
}

useHead({ title: `Hasil ${test.title} — Satu Persen` })
</script>

<template>
  <div>
    <BaseSection width="narrow">
      <!-- Waiting on localStorage -->
      <div v-if="!isHydrated" class="flex flex-col gap-6">
        <USkeleton class="h-8 w-48" />
        <USkeleton class="h-48 w-full rounded-3xl" />
        <USkeleton class="h-64 w-full rounded-3xl" />
      </div>

      <!-- No finished attempt in storage -->
      <BaseEmptyState
        v-else-if="showEmpty"
        icon="i-heroicons-clipboard-document-list-20-solid"
        title="Belum ada hasil untuk ditampilkan"
        description="Kamu belum menyelesaikan tes ini. Kerjakan semua soal dulu, hasilnya akan muncul otomatis di sini."
      >
        <UButton
          :to="`/psikotes/${testId}/mulai`"
          color="primary"
          size="lg"
          class="font-semibold text-ink-950"
        >
          Kerjakan Tes
        </UButton>
      </BaseEmptyState>

      <div v-else-if="showResult" class="flex flex-col gap-8">
        <!--
          Each block reveals on its own, staggered, matching the landing page's
          section fades. `BaseReveal` also rewinds when it scrolls out, so the
          motion replays on the way back down.
        -->
        <BaseReveal>
          <div class="flex flex-col gap-2">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Hasil Tes</p>
            <h1 class="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              {{ test.title }}
            </h1>
          </div>
        </BaseReveal>

        <!-- Timed out: say so, rather than letting a low score look like a verdict. -->
        <BaseReveal v-if="ranOutOfTime" :delay="80">
          <div
            class="flex items-start gap-3 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5"
          >
            <UIcon
              name="i-heroicons-clock-20-solid"
              class="mt-0.5 h-5 w-5 shrink-0 text-amber-400"
            />
            <div class="flex flex-col gap-1">
              <p class="font-bold text-amber-200">Waktu habis</p>
              <p class="text-sm leading-relaxed text-amber-100/70">
                {{ unansweredCount }} soal tidak sempat terjawab dan dihitung nol, jadi skor di
                bawah belum menggambarkan dirimu sepenuhnya. Ulangi tes untuk hasil yang lebih
                akurat.
              </p>
            </div>
          </div>
        </BaseReveal>

        <!-- Headline score -->
        <BaseReveal :delay="160">
          <div class="glass rounded-4xl p-6 sm:p-8">
            <div class="flex flex-col gap-6">
              <div class="flex flex-wrap items-end justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <p class="text-sm text-white/50">Skor total</p>
                  <p class="text-5xl font-extrabold tabular-nums">
                    {{ summary.totalScore }}
                    <span class="text-2xl font-bold text-white/30">/ {{ summary.maxScore }}</span>
                  </p>
                </div>

                <UBadge size="lg" variant="soft" color="primary" class="font-bold">
                  {{ summary.category }}
                </UBadge>
              </div>

              <BaseProgressBar :value="summary.percentage" show-value aria-label="Skor total" />

              <div class="flex flex-col gap-2 border-t border-white/10 pt-6">
                <h2 class="text-lg font-bold">{{ summary.headline }}</h2>
                <p class="text-pretty leading-relaxed text-white/60">{{ summary.narrative }}</p>
              </div>
            </div>
          </div>
        </BaseReveal>

        <!-- Dominant trait callout -->
        <BaseReveal v-if="dominantTrait" :delay="240">
          <div class="glass overflow-hidden rounded-3xl">
            <!--
              Fixed 16:9 box with `object-cover`. Artwork drawn at 16:9 fills it
              exactly with no crop; anything off-ratio loses a sliver of its edges
              rather than sitting in empty letterbox bars, and nothing is ever
              stretched out of shape.
            -->
            <div v-if="showTraitImage" class="aspect-video w-full overflow-hidden bg-white/5">
              <img
                ref="traitImageEl"
                :src="dominantTrait.image"
                :alt="`Ilustrasi dimensi ${dominantTrait.label}`"
                width="1920"
                height="1080"
                class="h-full w-full object-cover"
                @error="markTraitImageFailed"
              >
            </div>

            <div class="flex items-start gap-4 p-6">
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10"
              >
                <UIcon name="i-heroicons-star-20-solid" class="h-5 w-5 text-brand-500" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="text-sm text-white/50">Dimensi paling menonjol</p>
                <p class="text-lg font-bold">{{ dominantTrait.label }}</p>
                <p class="text-sm leading-relaxed text-white/60">{{ dominantTrait.description }}</p>
              </div>
            </div>
          </div>
        </BaseReveal>

        <!-- Per-dimension breakdown -->
        <BaseReveal :delay="320">
          <div class="glass flex flex-col gap-6 rounded-3xl p-6 sm:p-8">
            <BaseSectionHeading
              title="Rincian per dimensi"
              subtitle="Semakin panjang batangnya, semakin kuat kecenderungan kamu di dimensi tersebut."
            />
            <TraitScoreList :traits="summary.traits" />
          </div>
        </BaseReveal>

        <BaseReveal :delay="400">
          <div class="flex flex-col gap-3 sm:flex-row">
            <UButton
              size="xl"
              color="primary"
              icon="i-heroicons-arrow-path-20-solid"
              class="justify-center font-bold text-ink-950"
              @click="retake"
            >
              Ulangi Tes
            </UButton>
            <UButton
              to="/psikotes"
              size="xl"
              color="white"
              variant="ghost"
              class="justify-center"
            >
              Jelajahi Tes Lain
            </UButton>
          </div>
        </BaseReveal>

        <BaseReveal :delay="480">
          <p class="text-center text-xs leading-relaxed text-white/40">
            Hasil ini bersifat edukatif dan bukan diagnosis klinis.
          </p>
        </BaseReveal>
      </div>
    </BaseSection>

    <!--
      Recommendations live in their own full-width section: three cards inside
      the narrow result column would be squeezed to roughly 230px each.
    -->
    <BaseSection v-if="showResult && recommended.length" spacing="tight">
      <BaseReveal>
        <BaseSectionHeading
          eyebrow="Lanjutkan"
          title="Rekomendasi tes untukmu"
          subtitle="Tes lain yang dekat dengan yang barusan kamu kerjakan."
          class="mb-8"
        />
      </BaseReveal>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <BaseReveal v-for="(item, index) in recommended" :key="item.id" :delay="index * 100">
          <TestCard :test="item" />
        </BaseReveal>
      </div>
    </BaseSection>
  </div>
</template>
