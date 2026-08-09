/**
 * Model — question entities and scoring.
 */

/**
 * Big Five dimensions. Each question contributes to exactly one of them, which
 * keeps scoring to a plain sum per dimension (no factor analysis — out of scope
 * per the PRD).
 */
export const BIG_FIVE_TRAITS = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'neuroticism',
] as const

export type BigFiveTrait = (typeof BIG_FIVE_TRAITS)[number]

/**
 * Indonesian labels + blurbs, keyed by trait. Used on the result page.
 *
 * `image` is served from `public/`, so dropping the file in is enough — no code
 * change. A missing file degrades to a text-only result rather than a broken
 * image. Change the extension here if you upload .webp/.jpg/.svg instead.
 *
 * Note `neuroticism`: the questions are worded so a high score means calm, not
 * anxious, which keeps every dimension pointing the same way (higher is
 * better). The artwork should show composure, not distress.
 */
export const TRAIT_META: Record<
  BigFiveTrait,
  { label: string; description: string; image: string }
> = {
  openness: {
    label: 'Keterbukaan',
    description: 'Seberapa terbuka kamu terhadap ide, pengalaman, dan hal baru.',
    image: '/images/hasil/openness.jpg',
  },
  conscientiousness: {
    label: 'Kehati-hatian',
    description: 'Seberapa terstruktur dan disiplin kamu dalam mengejar tujuan.',
    image: '/images/hasil/conscientiousness.jpg',
  },
  extraversion: {
    label: 'Ekstraversi',
    description: 'Seberapa besar energimu tumbuh dari interaksi dengan orang lain.',
    image: '/images/hasil/extraversion.jpg',
  },
  agreeableness: {
    label: 'Keramahan',
    description: 'Seberapa besar kecenderunganmu untuk bekerja sama dan berempati.',
    image: '/images/hasil/agreeableness.jpg',
  },
  neuroticism: {
    label: 'Stabilitas Emosi',
    description: 'Seberapa tenang kamu saat menghadapi tekanan dan perubahan.',
    image: '/images/hasil/neuroticism.jpg',
  },
}

export interface QuestionOption {
  label: string
  /** 1–4. Higher means stronger agreement with the trait being measured. */
  score: number
}

export interface Question {
  id: number
  question: string
  trait: BigFiveTrait
  options: QuestionOption[]
}
