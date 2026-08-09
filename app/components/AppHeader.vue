<script setup lang="ts">
const route = useRoute()
const toast = useToast()

const isMenuOpen = ref(false)

/**
 * Premium has no page in this MVP. Rather than link to a route that would 404,
 * it is marked unavailable and explains itself when clicked.
 */
function notifyPremiumUnavailable() {
  isMenuOpen.value = false
  toast.add({
    title: 'Psikotes Premium belum tersedia',
    description: 'Fitur ini masih dalam pengembangan. Semua tes gratis sudah bisa dikerjakan.',
    icon: 'i-heroicons-sparkles-20-solid',
    color: 'amber',
  })
}

const psikotesItems = [
  [
    {
      label: 'Psikotes Premium',
      icon: 'i-heroicons-sparkles-20-solid',
      // UDropdown renders this as a button, so no route is requested.
      click: notifyPremiumUnavailable,
    },
    {
      label: 'Psikotes Gratis',
      icon: 'i-heroicons-gift-20-solid',
      to: '/psikotes',
    },
  ],
]

const isHomeActive = computed(() => route.path === '/')

/** Highlight the Psikotes trigger on any `/psikotes*` route. */
const isPsikotesActive = computed(() => route.path.startsWith('/psikotes'))

/**
 * Nav item styling. The active page keeps the brand colour permanently so the
 * user can tell where they are; other items adopt it only while hovered.
 *
 * Plain elements rather than `UButton` on purpose. UButton's ghost variant
 * ships `dark:text-white` and `dark:hover:bg-gray-900`, and with colour mode
 * forced to dark those defaults beat anything passed in via `class` — the
 * active item stayed white and hover did nothing. Owning the classes outright
 * avoids the specificity fight entirely.
 */
const NAV_BASE =
  'rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200'

function navLinkClass(active: boolean) {
  return active
    ? `${NAV_BASE} bg-brand-500/10 text-brand-500 hover:bg-brand-500/15`
    : `${NAV_BASE} text-white/70 hover:bg-brand-500/10 hover:text-brand-500`
}

// Close the mobile drawer on navigation, otherwise it stays open over the new page.
watch(() => route.fullPath, () => (isMenuOpen.value = false))
</script>

<template>
  <header class="sticky top-0 z-50 glass border-x-0 border-t-0">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2" aria-label="Satu Persen — beranda">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-extrabold text-ink-950"
        >
          1%
        </span>
        <span class="text-base font-bold tracking-tight">Satu Persen</span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
        <NuxtLink to="/" :class="navLinkClass(isHomeActive)">Beranda</NuxtLink>

        <!-- Panel styling (glass surface, spacing, item states) lives in
             app.config.ts so it applies to every dropdown. -->
        <UDropdown
          :items="psikotesItems"
          :popper="{ placement: 'bottom-start', offsetDistance: 10 }"
        >
          <button
            type="button"
            :class="['flex items-center gap-1', navLinkClass(isPsikotesActive)]"
          >
            Psikotes
            <UIcon name="i-heroicons-chevron-down-20-solid" class="h-4 w-4 opacity-60" />
          </button>
        </UDropdown>

        <UButton to="/psikotes" color="primary" class="ml-2 font-semibold text-ink-950">
          Mulai Tes
        </UButton>
      </nav>

      <UButton
        class="sm:hidden"
        variant="ghost"
        color="white"
        :icon="isMenuOpen ? 'i-heroicons-x-mark-20-solid' : 'i-heroicons-bars-3-20-solid'"
        :aria-label="isMenuOpen ? 'Tutup menu' : 'Buka menu'"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      />
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="isMenuOpen"
        class="border-t border-white/10 px-4 pb-4 pt-2 sm:hidden"
        aria-label="Navigasi mobile"
      >
        <NuxtLink to="/" :class="['block', navLinkClass(isHomeActive)]">Beranda</NuxtLink>

        <!-- Dropdowns are awkward on touch, so the group is flattened here. -->
        <p class="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          Psikotes
        </p>
        <button
          type="button"
          :class="['flex w-full items-center gap-2', navLinkClass(false)]"
          @click="notifyPremiumUnavailable"
        >
          <UIcon name="i-heroicons-sparkles-20-solid" class="h-4 w-4" />
          Psikotes Premium
        </button>
        <NuxtLink
          to="/psikotes"
          :class="['flex items-center gap-2', navLinkClass(isPsikotesActive)]"
        >
          <UIcon name="i-heroicons-gift-20-solid" class="h-4 w-4" />
          Psikotes Gratis
        </NuxtLink>

        <UButton to="/psikotes" color="primary" block class="mt-3 font-semibold text-ink-950">
          Mulai Tes
        </UButton>
      </nav>
    </Transition>
  </header>
</template>
