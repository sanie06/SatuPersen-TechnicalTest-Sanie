import type { Benefit, HeadlineWord, LandingStep, Tagline } from '~/types'

/**
 * ViewModel — every piece of copy and artwork the landing page renders.
 *
 * The page used to declare these four lists inline, which made it both the
 * content source and the layout. Pulling them out leaves `index.vue` doing one
 * job — arranging sections — and puts the copy where a non-developer can find
 * it without reading markup. Same reasoning as `usePlatformStats`.
 */
export function useLandingContent() {
  /**
   * Illustrations served straight from `public/`, so swapping the file is
   * enough — change the extension here if you upload a `.webp`/`.jpg`/`.svg`.
   */
  const heroImage = '/images/hero.png'
  const ctaImage = '/images/hero2.png'

  /**
   * `brand` marks the yellow words; on hover each lights in the other's colour.
   * `breakAfter` pins the two-line shape rather than letting the text wrap
   * wherever the column happens to end — kept as data, not a literal `<br>`,
   * so the per-word hover still works.
   */
  const headlineWords: HeadlineWord[] = [
    { text: 'Kenali' },
    { text: 'Dirimu', brand: true, breakAfter: true },
    { text: 'Maksimalkan' },
    { text: 'Potensimu', brand: true },
  ]

  /**
   * The strip sits on white, where `brand-500` measures 1.63:1 and `brand-700`
   * only 3.77:1 — enough for large bold text but not at the 16px mobile size.
   * `brand-800` clears 4.5:1 at both, which is why the View uses that shade.
   */
  const taglines: Tagline[] = [
    { lead: '1% Better', accent: 'Everyday' },
    { lead: 'Achieving and Maintaining', accent: 'The Good Life' },
    { lead: 'Know Yourself', accent: 'Better' },
  ]

  const steps: LandingStep[] = [
    {
      icon: 'i-heroicons-pencil-square-20-solid',
      // Custom artwork is optional: until the file exists the Heroicon above is
      // used, so icons can be swapped in one at a time.
      image: '/images/icons/jawab-dengan-jujur.svg',
      title: 'Jawab dengan Jujur',
      description:
        'Isi setiap pertanyaan sesuai kondisi kamu yang sebenarnya, bukan jawaban yang dianggap ideal.',
    },
    {
      icon: 'i-heroicons-moon-20-solid',
      image: '/images/icons/tempat-tenang.svg',
      title: 'Cari Tempat yang Tenang',
      description:
        'Luangkan waktu di tempat yang nyaman supaya kamu bisa fokus dan tidak terburu-buru.',
    },
    {
      icon: 'i-heroicons-light-bulb-20-solid',
      image: '/images/icons/refleksi-hasil.svg',
      title: 'Refleksikan Hasilnya',
      description:
        'Setelah hasil keluar, coba pikirkan bagian mana yang paling relevan dengan kehidupanmu sehari-hari.',
    },
    {
      icon: 'i-heroicons-chat-bubble-left-right-20-solid',
      image: '/images/icons/diskusikan-hasil.svg',
      title: 'Diskusikan Bila Perlu',
      description:
        'Ceritakan hasilnya ke orang terdekat, atau lanjutkan ke psikolog profesional kalau butuh pendampingan lebih jauh.',
    },
  ]

  const benefits: Benefit[] = [
    {
      icon: 'i-heroicons-banknotes-20-solid',
      title: 'Gratis selamanya',
      description: 'Tanpa biaya tersembunyi dan tanpa perlu memasukkan data kartu.',
    },
    {
      icon: 'i-heroicons-bolt-20-solid',
      title: 'Tanpa daftar akun',
      description: 'Langsung kerjakan. Tidak ada formulir pendaftaran yang menghalangi.',
    },
    {
      icon: 'i-heroicons-shield-check-20-solid',
      title: 'Jawaban tersimpan aman',
      description: 'Progresmu disimpan di browser sendiri, bukan di server kami.',
    },
    {
      icon: 'i-heroicons-academic-cap-20-solid',
      title: 'Basis ilmiah',
      description: 'Disusun mengacu pada model psikologi yang dipakai luas di dunia akademik.',
    },
  ]

  return { heroImage, ctaImage, headlineWords, taglines, steps, benefits }
}
