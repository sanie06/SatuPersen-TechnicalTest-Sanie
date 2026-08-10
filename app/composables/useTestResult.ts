import {
  BIG_FIVE_TRAITS,
  TRAIT_META,
  type BigFiveTrait,
  type ResultSummary,
  type TraitScore,
} from '~/types'

/** Verdict bands, ordered high to low. First match wins. */
const CATEGORY_BANDS = [
  {
    min: 80,
    category: 'Sangat Tinggi',
    headline: 'Profil kepribadianmu sangat menonjol',
    narrative:
      'Kamu menjawab dengan kecenderungan yang kuat di hampir semua dimensi. Ini biasanya menandakan kamu sudah cukup mengenal diri sendiri dan nyaman dengan cara kamu menjalani hidup.',
  },
  {
    min: 60,
    category: 'Tinggi',
    headline: 'Kamu punya kecenderungan yang jelas',
    narrative:
      'Beberapa dimensi terlihat lebih dominan dari yang lain. Pahami mana yang menguatkan dan mana yang perlu diseimbangkan agar kamu bisa berkembang lebih terarah.',
  },
  {
    min: 40,
    category: 'Sedang',
    headline: 'Profilmu cukup seimbang',
    narrative:
      'Tidak ada dimensi yang terlalu mendominasi. Fleksibel di banyak situasi adalah kekuatanmu, tapi pastikan kamu tetap punya arah yang kamu pegang.',
  },
  {
    min: 0,
    category: 'Rendah',
    headline: 'Kamu cenderung tenang dan selektif',
    narrative:
      'Kamu menjawab dengan kecenderungan yang rendah di banyak dimensi. Ini bukan hal buruk — bisa jadi kamu memang lebih hati-hati atau sedang berada di fase yang menuntut banyak energi.',
  },
] as const

/**
 * ViewModel — turns a finished attempt into a displayable result.
 *
 * Scoring is a plain sum per trait, then a percentage against the maximum that
 * trait could reach. Deliberately simple: the PRD puts multidimensional
 * psychometric scoring out of scope.
 *
 * Reads the same `useTestAttempt` state the test page writes, so no answers are
 * passed between routes — the result page works after a direct refresh too.
 */
export function useTestResult(testId: string) {
  const { attempt, isHydrated, questions, totalQuestions, isComplete, isFinished, reset } =
    useTestAttempt(testId)

  /** Answered vs skipped, so the view can flag a run that ran out of time. */
  const answeredCount = computed(() => Object.keys(attempt.value.answers).length)
  const unansweredCount = computed(() => totalQuestions.value - answeredCount.value)

  /** Highest score a single option can award. Derived, not hardcoded. */
  const maxOptionScore = computed(() =>
    questions.value.reduce(
      (max, question) => Math.max(max, ...question.options.map((option) => option.score)),
      0,
    ),
  )

  const traitScores = computed<TraitScore[]>(() => {
    const answers = attempt.value.answers

    return BIG_FIVE_TRAITS.map((trait: BigFiveTrait): TraitScore => {
      const traitQuestions = questions.value.filter((question) => question.trait === trait)

      const score = traitQuestions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0)
      const maxScore = traitQuestions.length * maxOptionScore.value

      return {
        trait,
        label: TRAIT_META[trait].label,
        description: TRAIT_META[trait].description,
        image: TRAIT_META[trait].image,
        score,
        maxScore,
        percentage: maxScore === 0 ? 0 : Math.round((score / maxScore) * 100),
      }
    }).filter((entry) => entry.maxScore > 0)
  })

  const summary = computed<ResultSummary>(() => {
    const totalScore = Object.values(attempt.value.answers).reduce((sum, value) => sum + value, 0)
    const maxScore = totalQuestions.value * maxOptionScore.value
    const percentage = maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100)

    const band =
      CATEGORY_BANDS.find((entry) => percentage >= entry.min) ??
      CATEGORY_BANDS[CATEGORY_BANDS.length - 1]!

    return {
      totalScore,
      maxScore,
      percentage,
      category: band.category,
      headline: band.headline,
      narrative: band.narrative,
      traits: traitScores.value,
    }
  })

  /** The trait the user scored highest on. Highlighted at the top of the page. */
  const dominantTrait = computed<TraitScore | undefined>(() =>
    traitScores.value.reduce<TraitScore | undefined>(
      (best, entry) => (!best || entry.percentage > best.percentage ? entry : best),
      undefined,
    ),
  )

  return {
    summary,
    traitScores,
    dominantTrait,
    isComplete,
    isFinished,
    answeredCount,
    unansweredCount,
    isHydrated,
    reset,
  }
}
