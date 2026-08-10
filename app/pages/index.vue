<script setup lang="ts">
const { stats } = usePlatformStats()
const { heroImage, ctaImage, headlineWords, taglines, steps, benefits } = useLandingContent()

const {
  imageEl: heroImageEl,
  showImage: showHeroImage,
  markFailed: markHeroFailed,
} = useImageFallback(heroImage)

const {
  imageEl: ctaImageEl,
  showImage: showCtaImage,
  markFailed: markCtaImageFailed,
} = useImageFallback(ctaImage)
</script>

<template>
  <div>
    <!--
      Hero: text column left, illustration right on desktop. Below `lg` the two
      stack with the illustration on top — `order` puts it first there without
      moving it in the DOM, so the reading order for screen readers and the
      source stays headline -> pitch -> action.
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
            class="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-4.5xl xl:text-5xl xl:tracking-tighter"
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
                :class="word.brand ? 'glow-cool text-brand-500' : 'glow-warm'"
                >{{ word.text }}</span
              ><br v-if="word.breakAfter" /><template v-else>{{
                index < headlineWords.length - 1 ? ' ' : ''
              }}</template></template
            >
          </h1>

          <p class="max-w-lg text-pretty text-lg leading-relaxed text-gray-300">
            Pahami diri minat, bakat, dan keunikan karaktermu. Karena setiap satu persen dari dirimu
            terlalu berharga untuk dilewatkan.
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
              class="text-base font-medium text-white underline underline-offset-4 transition-opacity hover:opacity-80"
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
        <div
          v-if="showHeroImage"
          class="relative order-first mx-auto w-full max-w-lg lg:order-none lg:max-w-none"
        >
          <img
            ref="heroImageEl"
            :src="heroImage"
            alt="Ilustrasi orang mengamati dirinya sendiri lewat kaca pembesar"
            width="539"
            height="463"
            fetchpriority="high"
            class="relative w-full rounded-3xl"
            @error="markHeroFailed"
          />

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
          <div class="absolute -top-8 right-0 z-10 sm:-right-4 lg:right-0 xl:-right-8">
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
              class="pointer-events-none absolute -bottom-48 -left-40 h-128 w-128 rounded-full bg-ink-900 blur-3xl"
            />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -bottom-28 left-0 h-56 w-96 rounded-full bg-ink-900/70 blur-3xl"
            />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-ink-900/60 blur-3xl"
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
              class="pointer-events-none absolute -bottom-48 -right-40 h-128 w-128 rounded-full bg-ink-900 blur-3xl"
            />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute -top-24 left-0 h-96 w-96 rounded-full bg-ink-900/60 blur-3xl"
            />

            <div class="relative">
              <BaseSectionHeading
                title="Cara Memaksimalkan Hasil Psikotes"
                subtitle="Tanpa ribet, tanpa tekanan. Ambil waktu sejenak, dan progresmu akan otomatis tersimpan agar kamu bisa melanjutkannya kapan saja."
                align="center"
                class="mb-5 lg:mb-12"
              />

              <!-- No per-step cards: boxing them on top of the dark panel would
                   cover the glow, the same way it did in Fact Check. -->
              <StepList :steps="steps" />
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
          title="Akses gratis ke instrumen psikologi berkualitas, kapan pun kamu butuh arahan."
          subtitle="Tujuannya sederhana: bantu kamu memahami diri sendiri sedikit lebih baik setiap hari."
          class="mb-12"
        />

        <BenefitCards :benefits="benefits" />
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
                :src="ctaImage"
                alt=""
                width="522"
                height="478"
                loading="lazy"
                class="relative w-full rounded-3xl"
                @error="markCtaImageFailed"
              />
            </div>
          </div>
        </div>
      </BaseReveal>
    </BaseSection>
  </div>
</template>
