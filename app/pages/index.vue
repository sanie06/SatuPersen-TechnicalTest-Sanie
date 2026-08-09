<script setup lang="ts">
const { stats } = usePlatformStats()

/**
 * Hero illustration. Served from `public/`, so swapping the file is enough —
 * change the extension here if you upload a .webp/.jpg/.svg instead.
 */
const HERO_IMAGE = '/images/hero.png'

const {
  imageEl: heroImageEl,
  showImage: showHeroImage,
  markFailed: markHeroFailed,
} = useImageFallback(HERO_IMAGE)

/** Illustration paired with the closing call to action. */
const HERO2_IMAGE = '/images/hero2.png'

const {
  imageEl: ctaImageEl,
  showImage: showCtaImage,
  markFailed: markCtaImageFailed,
} = useImageFallback(HERO2_IMAGE)

/**
 * Headline, split per word so each lights up on its own hover. `brand: true`
 * marks the yellow words — those glow white, the white ones glow yellow, so
 * each lights in the other's colour.
 *
 * `breakAfter` forces the two-line shape rather than letting the text wrap
 * wherever the column happens to end. Kept as data instead of a literal `<br>`
 * so the per-word hover still works.
 */
const headlineWords = [
  { text: 'Kenali' },
  { text: 'Dirimu', brand: true, breakAfter: true },
  { text: 'Maksimalkan' },
  { text: 'Potensimu', brand: true },
]

/**
 * Scrolling tagline strip between the hero and Fact Check. `accent` is the part
 * rendered in brand colour; `brand-800` rather than `brand-500`: the strip is
 * white, and measured on it brand-500 gives 1.63:1 and brand-700 only 3.77:1 —
 * which passes for large bold text but fails at the 16px mobile size. brand-800
 * clears 4.5:1 at both sizes.
 */
const taglines = [
  { lead: '1% Better', accent: 'Everyday' },
  { lead: 'Achieving and Maintaining', accent: 'The Good Life' },
  { lead: 'Know Yourself', accent: 'Better' },
]

const steps = [
  {
    icon: 'i-heroicons-pencil-square-20-solid',
    // Custom artwork under `public/`. Until the file exists the Heroicon above
    // is used instead, so icons can be swapped in one at a time.
    image: '/images/icons/jawab-dengan-jujur.png',
    title: 'Jawab dengan Jujur',
    description:
      'Isi setiap pertanyaan sesuai kondisi kamu yang sebenarnya, bukan jawaban yang dianggap ideal.',
  },
  {
    icon: 'i-heroicons-moon-20-solid',
    title: 'Cari Tempat yang Tenang',
    description:
      'Luangkan waktu di tempat yang nyaman supaya kamu bisa fokus dan tidak terburu-buru.',
  },
  {
    icon: 'i-heroicons-light-bulb-20-solid',
    title: 'Refleksikan Hasilnya',
    description:
      'Setelah hasil keluar, coba pikirkan bagian mana yang paling relevan dengan kehidupanmu sehari-hari.',
  },
  {
    icon: 'i-heroicons-chat-bubble-left-right-20-solid',
    title: 'Diskusikan Bila Perlu',
    description:
      'Ceritakan hasilnya ke orang terdekat, atau lanjutkan ke psikolog profesional kalau butuh pendampingan lebih jauh.',
  },
]

const benefits = [
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
</script>

<template>
  <div>
    <!--
      Hero: text column left, illustration right on desktop. Below `lg` the two
      stack, illustration after the CTAs so the reading order stays
      headline -> pitch -> action.
    -->
    <BaseSection spacing="loose">
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <div class="flex flex-col items-start gap-8 text-left">
          <UBadge variant="soft" color="primary" size="lg" class="font-semibold">
            Gratis - Tanpa daftar akun
          </UBadge>

          <!--
            Sized per breakpoint to hold the two-line shape everywhere, because
            the column width does not grow monotonically: it is full-width up to
            `md`, then halves at `lg` when the illustration appears beside it,
            and only widens again at `xl` once the section hits its max width.
            Measured against "Maksimalkan Potensimu", the longer line:

              390px  column 342 -> 30px
              640px  column 592 -> 48px
              768px  column 720 -> 60px
              1024px column 468 -> 40px   (drops: two columns start here)
              1280px column 532 -> 48px + tighter tracking (needs 527)
          -->
          <h1
            class="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-[2.5rem] xl:text-5xl xl:tracking-tighter"
          >
            <!--
              The `{{ ' ' }}` between words is deliberate: Vue's compiler drops
              whitespace between elements when it spans a newline, which would
              run the words together. Keeping it outside the span also keeps
              the hover target to the word itself.
            -->
            <template v-for="(word, index) in headlineWords" :key="word.text"
              ><span
                class="headline-word"
                :class="word.brand ? 'text-brand-500 glow-cool' : 'glow-warm'"
                >{{ word.text }}</span
              ><br v-if="word.breakAfter"><template v-else>{{
                index < headlineWords.length - 1 ? ' ' : ''
              }}</template></template
            >
          </h1>

          <p class="max-w-lg text-pretty text-lg leading-relaxed text-gray-300">
            Pahami diri minat, bakat, dan keunikan karaktermu. Karena setiap satu persen dari
            dirimu terlalu berharga untuk dilewatkan.
          </p>

          <div class="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
            <UButton
              to="/psikotes"
              size="xl"
              color="primary"
              trailing-icon="i-heroicons-arrow-right-20-solid"
              class="justify-center font-bold text-ink-950"
            >
              Mulai Tes Gratis
            </UButton>
            <NuxtLink
              to="#cara-kerja"
              class="text-base font-medium text-white underline-offset-4 transition-opacity hover:underline hover:opacity-80"
            >
              Lihat cara kerjanya
            </NuxtLink>
          </div>
        </div>

        <!--
          Illustration column. Hidden entirely until the file exists, so the
          hero degrades to a single text column rather than showing a broken
          image. Explicit width/height reserve the space and prevent layout
          shift once it loads.
        -->
        <div v-if="showHeroImage" class="relative mx-auto w-full max-w-lg lg:max-w-none">
          <img
            ref="heroImageEl"
            :src="HERO_IMAGE"
            alt="Ilustrasi orang mengamati dirinya sendiri lewat kaca pembesar"
            width="539"
            height="463"
            fetchpriority="high"
            class="relative w-full rounded-3xl"
            @error="markHeroFailed"
          >

          <!--
            Floating overlay, pushed clear of the yellow blob into the dark
            space above and to the right of the illustration.

            Two nested elements on purpose: the outer one owns the position
            (including its `translate-x`), the inner one owns the float
            animation. Both write to `transform`, so sharing an element would
            let the keyframes wipe out the offset.

            The rightward overhang is switched off between `lg` and `xl`: there
            the section has not yet reached its max width, so the image column
            already touches the viewport edge and the card would spill past it.
          -->
          <div
            class="absolute -top-8 right-0 z-10 sm:-right-4 lg:right-0 xl:-right-8"
          >
            <HeroProgressCard class="animate-float motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- Scrolling tagline strip, full-bleed between the dark hero and the yellow band. -->
    <BaseMarquee :items="taglines" />

    <!--
      Fact Check / social proof. The brand yellow is full-bleed on the section
      itself, so it reads as a band across the page; the content sits on a dark
      card floating inside it.
    -->
    <div class="bg-brand-500 pb-3 pt-16 sm:pb-3 sm:pt-24">
      <BaseSection spacing="none">
        <BaseReveal>
          <!--
            Dark card with the brand glow bleeding in from the bottom-left, using
            only the PRD palette. The blobs carry no negative z-index: the card
            paints its own background, so a `-z-10` child would render behind it
            and vanish.

            `clip-path` is NOT redundant next to `overflow-hidden`. A blurred
            child forces its own compositing layer, and the rounded overflow clip
            is skipped on it — the blob's square bounding box then pokes out past
            the corner as a visible notch. clip-path is applied at composite time,
            so it holds.
          -->
          <div
            class="relative isolate overflow-hidden rounded-4xl bg-ink-950 px-6 py-16 [clip-path:inset(0_round_2rem)] sm:px-12"
          >
            <!--
              Blue rather than brand yellow. A yellow glow sat directly behind the
              yellow figures and dragged their contrast to 3.97:1 — under the
              4.5:1 minimum — and it also collided with the yellow band framing
              this card. ink-900 (#16213E) lifts the surface without competing
              with anything in the foreground.
            -->
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -bottom-48 -left-40 h-[32rem] w-[32rem] rounded-full bg-ink-900 blur-3xl"
            />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -bottom-28 left-0 h-56 w-[24rem] rounded-full bg-ink-900/70 blur-3xl"
            />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -top-24 right-0 h-[24rem] w-[24rem] rounded-full bg-ink-900/60 blur-3xl"
            />

            <div class="relative">
              <BaseSectionHeading
                title="Dipercaya oleh Ribuan Orang"
                subtitle="Jejak langkah nyata kami dalam mendampingi perjalananmu menuju versi terbaik dirimu."
                align="center"
                class="mb-12"
              />

              <StatHighlights :stats="stats" />
            </div>
          </div>
        </BaseReveal>
      </BaseSection>
    </div>

    <!--
      Cara Kerja. Same yellow-band + dark-card treatment as Fact Check above,
      but the glow enters from the opposite corner so the two stacked bands read
      as separate panels rather than one repeated block.
    -->
    <div id="cara-kerja" class="bg-brand-500 pb-16 pt-3 sm:pb-24 sm:pt-3">
      <BaseSection spacing="none">
        <BaseReveal>
          <div
            class="relative isolate overflow-hidden rounded-4xl bg-ink-950 px-6 py-16 [clip-path:inset(0_round_2rem)] sm:px-12"
          >
            <!-- Same blue treatment as Fact Check, entering from the opposite
                 corner so the two stacked cards don't read as one repeated block. -->
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -bottom-48 -right-40 h-[32rem] w-[32rem] rounded-full bg-ink-900 blur-3xl"
            />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -top-24 left-0 h-[24rem] w-[24rem] rounded-full bg-ink-900/60 blur-3xl"
            />

            <div class="relative">
              <BaseSectionHeading
                title="Cara Memaksimalkan Hasil Psikotes"
                subtitle="Tanpa ribet, tanpa tekanan. Ambil waktu sejenak, dan progresmu akan otomatis tersimpan agar kamu bisa melanjutkannya kapan saja."
                align="center"
                class="mb-12"
              />

              <!-- No per-step cards: boxing them on top of the dark panel would
                   cover the glow, the same way it did in Fact Check. -->
              <!--
                One swipeable row below `lg`, a four-column grid above it.
                Four cards abreast on a 390px screen leaves ~90px each, which
                is too narrow to read, so the row scrolls instead of shrinking.

                `-mx-6 px-6` lets the strip bleed to the panel edges so a card
                is visibly cut off at the right — the cue that there is more to
                swipe to. `tabindex` because a scroll container is not reachable
                by keyboard on its own.

                Dividers only once all four sit in one row; in the scrolling
                strip they would trail off the side.
              -->
              <ol
                :tabindex="0"
                class="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:px-12 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 lg:divide-x lg:divide-white/10"
              >
                <li
                  v-for="(step, index) in steps"
                  :key="step.title"
                  class="flex w-[78%] shrink-0 snap-start flex-col gap-4 sm:w-[42%] lg:w-auto lg:shrink lg:px-6 lg:first:pl-0 lg:last:pr-0"
                >
                  <div class="flex items-center gap-3">
                    <span
                      class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-sm font-extrabold tabular-nums text-brand-500"
                    >
                      {{ String(index + 1).padStart(2, '0') }}
                    </span>
                    <StepIcon :icon="step.icon" :image="step.image" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <h3 class="text-lg font-bold">{{ step.title }}</h3>
                    <p class="text-sm leading-relaxed text-white/60">{{ step.description }}</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </BaseReveal>
      </BaseSection>
    </div>

    <!-- Keunggulan -->
    <BaseSection>
      <BaseReveal>
        <BaseSectionHeading
          eyebrow="Kenapa Satu Persen"
          title="Dibuat untuk dipakai, bukan untuk dijual"
          subtitle="Tujuannya sederhana: bantu kamu memahami diri sendiri sedikit lebih baik setiap hari."
          class="mb-12"
        />

        <BenefitScatter :benefits="benefits" />
      </BaseReveal>
    </BaseSection>

    <!-- CTA penutup -->
    <BaseSection spacing="tight">
      <BaseReveal>
        <div class="glass relative overflow-hidden rounded-4xl px-6 py-12 sm:px-12">
          <!--
            Glow behind the copy. Kept fully inside the panel: at `-left-16
            -top-24` three quarters of it fell outside, `overflow-hidden` cut
            the rest square, and what survived read as a stain wedged into the
            corner rather than a round glow.
          -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute left-4 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl"
          />

          <div class="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div class="flex flex-col items-start gap-6 text-left">
              <h2 class="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
                Siap mengenal dirimu lebih baik?
              </h2>
              <p class="max-w-xl text-pretty leading-relaxed text-white/60">
                Mulai dari Tes Kepribadian Big Five. Sepuluh soal, lima menit, langsung dapat
                hasilnya.
              </p>
              <UButton
                to="/psikotes"
                size="xl"
                color="primary"
                trailing-icon="i-heroicons-arrow-right-20-solid"
                class="font-bold text-ink-950"
              >
                Lihat Katalog Tes
              </UButton>
            </div>

            <!--
              Sized to the copy beside it, not to the hero illustration. At the
              hero's width the artwork stood taller than the heading, paragraph
              and button stacked together, so the left column was left with a
              large empty gap under its button.

              The column itself is `auto` in the grid above, so it shrinks to
              the image rather than holding a half-width track open.
            -->
            <div v-if="showCtaImage" class="relative mx-auto w-full max-w-xs lg:mx-0">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-6 rounded-full bg-brand-500/20 blur-3xl"
              />
              <img
                ref="ctaImageEl"
                :src="HERO2_IMAGE"
                alt=""
                width="522"
                height="478"
                loading="lazy"
                class="relative w-full rounded-3xl"
                @error="markCtaImageFailed"
              >
            </div>
          </div>
        </div>
      </BaseReveal>
    </BaseSection>
  </div>
</template>
