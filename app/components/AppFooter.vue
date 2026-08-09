<template>
  <footer class="mt-24 border-t border-white/10">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div class="flex items-center gap-2">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-extrabold text-ink-950"
        >
          1%
        </span>
        <p class="text-sm text-white/60">
          &copy; {{ new Date().getFullYear() }} Satu Persen — SP Collective
        </p>
      </div>

      <p class="max-w-md text-xs leading-relaxed text-white/40">
        Hasil tes ini bersifat edukatif dan bukan diagnosis klinis. Jika kamu sedang merasa
        tertekan, pertimbangkan berbicara dengan psikolog profesional.
      </p>
    </div>
  </footer>
</template>
