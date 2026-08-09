<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const testId = route.params.id as string

const { findTest } = useTestCatalog()
const test = findTest(testId)

if (!test) {
  throw createError({ statusCode: 404, statusMessage: 'Tes tidak ditemukan', fatal: true })
}

const {
  attempt,
  questions,
  totalQuestions,
  currentIndex,
  currentQuestion,
  currentAnswer,
  answeredCount,
  progress,
  isFirstQuestion,
  isLastQuestion,
  isComplete,
  isHydrated,
  isFinished,
  startedAt,
  start,
  selectAnswer,
  goTo,
  next,
  previous,
  finish,
} = useTestAttempt(testId)

const { label: timeLabel, isExpired, isCritical } = useTestTimer(
  startedAt,
  test.durationMinutes,
)

/**
 * Runs once the stored attempt has been read.
 *
 * A finished attempt is sent straight to its result. Without this, navigating
 * back into the test after finishing would reopen the questions and let the
 * answers behind a closed result be edited.
 *
 * Otherwise start the clock. Stamping earlier than hydration would overwrite
 * the saved `startedAt` of a run in progress with "now", silently granting a
 * full fresh limit on every reload.
 */
watch(
  isHydrated,
  (hydrated) => {
    if (!hydrated) return

    if (isFinished.value) {
      router.replace(`/psikotes/${testId}/hasil`)
      return
    }

    start()
  },
  { immediate: true },
)

/**
 * Time up: close the attempt and show whatever was answered. `replace` rather
 * than `push` so the back button doesn't drop the user into an expired test.
 */
watch(isExpired, (expired) => {
  if (!expired || isFinished.value) return

  finish()
  router.replace(`/psikotes/${testId}/hasil`)
})

/** Per-question dot state, so the user can see and reach any skipped item. */
const steps = computed(() =>
  questions.value.map((question, index) => ({
    index,
    id: question.id,
    isCurrent: index === currentIndex.value,
    isAnswered: attempt.value.answers[question.id] !== undefined,
  })),
)

// A catalog entry with no question set can't be taken — send the user back to
// the detail page rather than rendering an empty question card.
if (!test.isActive || questions.value.length === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tes ini belum tersedia',
    fatal: true,
  })
}

function handleSelect(score: number) {
  const question = currentQuestion.value
  if (!question) return

  selectAnswer(question.id, score)

  // Auto-advance so answering feels continuous, but stop on the last question
  // so the user can review before submitting.
  if (!isLastQuestion.value) {
    setTimeout(() => next(), 200)
  }
}

function handleFinish() {
  finish()
  router.push(`/psikotes/${testId}/hasil`)
}

useHead({ title: `Mengerjakan ${test.title} — Satu Persen` })
</script>

<template>
  <BaseSection width="narrow">
    <div class="mb-8 flex flex-col gap-5">
      <div class="flex items-center justify-between gap-4">
        <UButton
          :to="`/psikotes/${testId}`"
          variant="link"
          color="gray"
          icon="i-heroicons-arrow-left-20-solid"
          :padded="false"
        >
          Keluar
        </UButton>

        <div class="flex items-center gap-4">
          <p class="text-sm tabular-nums text-white/50">
            {{ answeredCount }} / {{ totalQuestions }} terjawab
          </p>

          <!--
            `aria-live="off"`: a countdown announcing itself every second would
            talk over the question. The remaining time is still reachable on
            demand via its label.
          -->
          <p
            v-if="isHydrated"
            aria-live="off"
            :aria-label="`Sisa waktu ${timeLabel}`"
            :class="[
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums transition-colors',
              isCritical
                ? 'bg-red-500/15 text-red-400'
                : 'bg-white/5 text-white/70',
            ]"
          >
            <UIcon name="i-heroicons-clock-20-solid" class="h-4 w-4" />
            {{ timeLabel }}
          </p>
        </div>
      </div>

      <BaseProgressBar shine :value="progress" aria-label="Progres pengerjaan tes" />
    </div>

    <!-- Wait for localStorage before painting, so a restored answer doesn't
         pop in after the question has already rendered unselected. -->
    <div v-if="!isHydrated" class="glass flex flex-col gap-4 rounded-3xl p-8">
      <USkeleton class="h-4 w-24" />
      <USkeleton class="h-7 w-full" />
      <USkeleton v-for="n in 4" :key="n" class="h-14 w-full rounded-2xl" />
    </div>

    <QuestionCard
      v-else-if="currentQuestion"
      :key="currentQuestion.id"
      :question="currentQuestion"
      :selected="currentAnswer"
      :position="currentIndex + 1"
      :total="totalQuestions"
      class="animate-fade-up"
      @select="handleSelect"
    />

    <div class="mt-6 flex items-center justify-between gap-3">
      <UButton
        color="white"
        variant="ghost"
        size="lg"
        icon="i-heroicons-arrow-left-20-solid"
        :disabled="isFirstQuestion"
        @click="previous"
      >
        Sebelumnya
      </UButton>

      <UButton
        v-if="isLastQuestion"
        size="lg"
        color="primary"
        :disabled="!isComplete"
        class="font-bold text-ink-950"
        @click="handleFinish"
      >
        Lihat Hasil
      </UButton>

      <UButton
        v-else
        size="lg"
        color="primary"
        variant="soft"
        trailing-icon="i-heroicons-arrow-right-20-solid"
        @click="next"
      >
        Selanjutnya
      </UButton>
    </div>

    <p
      v-if="isLastQuestion && !isComplete"
      class="mt-4 text-center text-sm text-white/50"
    >
      Masih ada {{ totalQuestions - answeredCount }} soal yang belum terjawab.
    </p>

    <!-- Jump-to-question dots: quick way back to a skipped item. -->
    <div class="mt-10 flex flex-wrap justify-center gap-2">
      <button
        v-for="step in steps"
        :key="step.id"
        type="button"
        :aria-label="`Ke soal ${step.index + 1}${step.isAnswered ? ' (sudah terjawab)' : ''}`"
        :aria-current="step.isCurrent ? 'step' : undefined"
        :class="[
          'h-2.5 rounded-full transition-all duration-300',
          step.isCurrent
            ? 'w-8 bg-brand-500'
            : step.isAnswered
              ? 'w-2.5 bg-brand-500/40 hover:bg-brand-500/70'
              : 'w-2.5 bg-white/20 hover:bg-white/40',
        ]"
        @click="goTo(step.index)"
      />
    </div>
  </BaseSection>
</template>
