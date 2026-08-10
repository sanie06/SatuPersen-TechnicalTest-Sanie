# Psikotes Gratis — Satu Persen

MVP platform psikotes gratis untuk Satu Persen (SP Collective). Dibangun dengan Nuxt, Nuxt UI, dan Tailwind CSS, dengan struktur folder mengikuti pola MVVM.

**Live demo:** _(isi setelah deploy — lihat bagian [Deployment](#deployment))_

---

## Menjalankan proyek secara lokal

Syarat: **Node.js 18+** (dikembangkan dan diuji pada Node 22).

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server di http://localhost:3000
npm run dev
```

Perintah lain:

| Perintah            | Fungsi                                              |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Development server dengan hot reload.               |
| `npm run generate`  | Build statis (SSG). Output ada di `.output/public`. |
| `npm run preview`   | Menyajikan hasil build statis secara lokal.         |
| `npm run format`    | Prettier + pengurutan class Tailwind                |
| `npm run typecheck` | Mengecek seluruh tipe TypeScript (`vue-tsc`).       |

---

## Struktur folder

Proyek memakai layout direktori Nuxt 4 (`future.compatibilityVersion: 4`), sehingga seluruh kode aplikasi berada di `app/` dan alias `~` menunjuk ke sana, sedangkan `~~` menunjuk ke root proyek.

```
.
├── data/                          # Mock data (di luar srcDir, diakses via ~~)
│   ├── tests.json                 # 10 tes katalog, 1 di antaranya isActive
│   └── questions-big-five.json    # 10 soal untuk tes yang aktif
│
├── app/
│   ├── types/                     # MODEL — kontrak data
│   │   ├── test.ts                # Test, TestCategory
│   │   ├── question.ts            # Question, BigFiveTrait, TRAIT_META
│   │   ├── attempt.ts             # TestAttempt (skema localStorage), ResultSummary
│   │   └── index.ts               # Satu pintu import: `~/types`
│   │
│   ├── composables/               # VIEWMODEL — seluruh logika & state
│   │   ├── usePersistentState.ts  # useState + localStorage (satu-satunya akses storage)
│   │   ├── useTestCatalog.ts      # sumber data katalog, search, filter kategori
│   │   ├── useTestQuestions.ts    # registry soal per test id
│   │   ├── useTestAttempt.ts      # navigasi soal, simpan jawaban, progress
│   │   └── useTestResult.ts       # skoring dan penyusunan ringkasan hasil
│   │
│   ├── components/                # VIEW — komponen presentasional
│   │   ├── base/                  # primitif yang dipakai lintas halaman
│   │   │   ├── BaseSection.vue        # lebar + padding konsisten
│   │   │   ├── BaseSectionHeading.vue # eyebrow + judul + subjudul
│   │   │   ├── BaseProgressBar.vue    # dipakai untuk progress tes & visual skor
│   │   │   └── BaseEmptyState.vue     # panel kosong / tidak ditemukan
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── TestCard.vue           # kartu katalog, termasuk state "Coming Soon"
│   │   ├── TestCatalogFilters.vue # search bar + dropdown kategori
│   │   ├── QuestionCard.vue       # satu soal + pilihan jawaban
│   │   └── TraitScoreList.vue     # rincian skor per dimensi
│   │
│   ├── layouts/default.vue
│   ├── pages/                     # VIEW — routing
│   │   ├── index.vue                      # /
│   │   └── psikotes/
│   │       ├── index.vue                  # /psikotes
│   │       └── [id]/
│   │           ├── index.vue              # /psikotes/[id]
│   │           ├── mulai.vue              # /psikotes/[id]/mulai
│   │           └── hasil.vue              # /psikotes/[id]/hasil
│   │
│   ├── assets/css/main.css        # Tailwind entry + utility .glass
│   ├── app.config.ts              # binding tema Nuxt UI (primary = brand)
│   ├── app.vue
│   └── error.vue                  # halaman 404 / error
│
├── nuxt.config.ts
└── tailwind.config.ts             # palet brand
```

### Kenapa MVVM

Pemisahannya dibuat tegas supaya logika bisa diuji dan dipakai ulang tanpa menyentuh UI:

- **Model (`app/types/`)** — hanya deklarasi tipe. `TestAttempt` sekaligus menjadi skema data yang ditulis ke `localStorage`, sehingga perubahan bentuk data langsung ketahuan sebagai type error.
- **ViewModel (`app/composables/`)** — semua state, filtering, penyimpanan, dan skoring. Tidak ada satu pun komponen yang mengakses `localStorage` atau menghitung skor sendiri.
- **View (`app/pages/`, `app/components/`)** — hanya merender dan meneruskan event. `TestCatalogFilters.vue`, misalnya, tidak tahu cara memfilter apa pun; ia hanya `v-model` ke state milik ViewModel.

### Penerapan DRY

- `usePersistentState` adalah **satu-satunya** tempat `localStorage` disentuh. Penanganan SSR, payload korup, dan quota penuh ditulis sekali di sana, lalu dipakai ulang oleh composable lain.
- `BaseProgressBar` dipakai untuk tiga hal sekaligus: progress pengerjaan, visualisasi skor total, dan bar per dimensi.
- `BaseSection` menghilangkan pengulangan `mx-auto max-w-6xl px-4 ...` di setiap halaman.
- Warna brand hanya didefinisikan di `tailwind.config.ts`, lalu di-map ke Nuxt UI lewat `app.config.ts`, sehingga seluruh `UButton`/`UBadge`/`UInput` otomatis ikut tanpa prop warna satu per satu.
- Rute yang di-_prerender_ dibaca langsung dari `data/tests.json` di `nuxt.config.ts` — menambah tes aktif tidak perlu mengubah konfigurasi.

---

## Alur data

```
data/*.json
   ↓  (import sekali, langsung di-cast ke tipe Model)
useTestCatalog / useTestQuestions
   ↓
useTestAttempt  ←→  usePersistentState  ←→  localStorage
   ↓
useTestResult (skoring)
   ↓
pages + components (render saja)
```

**Penyimpanan jawaban.** Setiap kali pengguna memilih jawaban, `useTestAttempt` menulis ulang seluruh objek `TestAttempt` ke `localStorage` dengan kunci `satupersen:attempt:<testId>`. Saat halaman dimuat ulang, nilai tersimpan dibaca pada `onMounted` — bukan saat render pertama — supaya HTML hasil prerender dan render pertama di klien tetap identik dan tidak memicu hydration mismatch. Selama proses itu berlangsung, halaman menampilkan skeleton, bukan konten kosong.

Payload yang rusak atau berasal dari versi skema lama (`version` tidak cocok) akan dibuang diam-diam dan tes dimulai dari awal, alih-alih membuat halaman gagal render.

**Skoring.** Sengaja dibuat sederhana sesuai batasan PRD: penjumlahan skor per dimensi Big Five, lalu dipersentasekan terhadap skor maksimum dimensi tersebut. Tidak ada normalisasi psikometrik.

---

## Tech stack

| Bagian    | Pilihan                     | Catatan                                                                                     |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| Framework | Nuxt 3.21 (mode SSG)        | `nuxt generate`, seluruh rute di-prerender jadi HTML statis.                                |
| UI        | Nuxt UI v2                  | Versi 2 dipilih karena PRD mensyaratkan Tailwind v3; Nuxt UI v3+ sudah memakai Tailwind v4. |
| Styling   | Tailwind CSS v3             | Palet brand di `tailwind.config.ts`.                                                        |
| Bahasa    | TypeScript strict           | `npm run typecheck` bersih tanpa error.                                                     |
| State     | `useState` + `localStorage` | Lewat `usePersistentState`.                                                                 |

### Desain

Mengikuti panduan brand pada PRD: kuning `#F5C518` sebagai aksen, latar gelap `#0D0D1A`, sentuhan glassmorphism pada kartu dan panel overlay, sudut membulat, dan pendekatan mobile-first.

---

## Deployment

Output-nya statis murni, jadi bisa dihosting di mana saja.

**Vercel** — import repository, lalu gunakan:

- Build command: `npm run generate`
- Output directory: `.output/public`

**Netlify** — sama:

- Build command: `npm run generate`
- Publish directory: `.output/public`

Setelah live, isi tautannya di bagian atas README ini.

---

## Pemanfaatan AI

Proyek ini dikerjakan dengan bantuan **Claude (Claude Code)** untuk scaffolding struktur folder, penulisan komponen berulang, dan penyusunan mock data. Keputusan arsitektur — pemisahan MVVM, memusatkan akses `localStorage` di satu composable, serta memilih Nuxt UI v2 agar tetap kompatibel dengan Tailwind v3 — diambil dan diverifikasi secara manual, termasuk lewat `npm run typecheck` dan pemeriksaan hasil build statis.

---

## Catatan cakupan

Sesuai batasan MVP pada PRD, hal berikut **tidak** termasuk: autentikasi, backend atau database, dan logika skoring psikologi yang kompleks. Dari 10 tes di katalog, hanya **Tes Kepribadian Big Five** yang dapat dikerjakan; sembilan lainnya ditandai "Coming Soon" dan tombolnya dinonaktifkan.

Hasil tes bersifat edukatif dan bukan diagnosis klinis.
