import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Test } from './app/types'

// Read the catalog at build time so prerendered routes stay in sync with the
// data. Adding an active test to tests.json is enough — no config edit needed.
const tests: Test[] = JSON.parse(
  readFileSync(fileURLToPath(new URL('./data/tests.json', import.meta.url)), 'utf-8'),
)

// Every test gets a detail page so a pasted URL resolves, even for the ones
// still marked "Coming Soon". The test-taking and result routes only exist for
// tests that are actually playable.
const detailRoutes = tests.map((test) => `/psikotes/${test.id}`)

const attemptRoutes = tests
  .filter((test) => test.isActive)
  .flatMap((test) => [`/psikotes/${test.id}/mulai`, `/psikotes/${test.id}/hasil`])

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt 4 directory layout: application code lives in `app/`, so `~` resolves
  // to `app/` and `~~` to the project root. Without this the aliases silently
  // point at the root and `~/types` resolves to nothing.
  future: { compatibilityVersion: 4 },

  modules: ['@nuxt/ui'],

  tailwindcss: {
    // Our own entry file — @nuxtjs/tailwindcss injects it and runs the
    // @tailwind directives through PostCSS. Listing it under `css` instead
    // would ship it unprocessed.
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },

  // Brand is dark-first; skip the flash of light theme on load.
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  ui: {
    global: true,
  },

  // SSG. Static pages are prerendered; anything driven by localStorage
  // hydrates on the client.
  ssr: true,

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/psikotes', ...detailRoutes, ...attemptRoutes],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Psikotes Gratis — Satu Persen',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Kenali dirimu lebih dalam lewat psikotes gratis dari Satu Persen. Tanpa daftar, hasil langsung keluar.',
        },
      ],
    },
  },
})
