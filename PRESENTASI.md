# Panduan Presentasi — Psikotes Gratis Satu Persen

Dokumen ini untuk dipakai saat mempresentasikan proyek: alur demo, urutan
membedah kode, dan jawaban untuk pertanyaan yang kemungkinan muncul.

---

## 1. Skenario Demo (± 5 menit)

Jalankan `npm run dev`, buka di browser, lalu ikuti urutan ini. Setiap langkah
punya satu hal yang ingin ditunjukkan — sebutkan hal itu, jangan cuma mengklik.

### Langkah 1 — Beranda

**Klik:** buka `/`

**Tunjukkan:** angka statistik menghitung naik saat section masuk layar, dan
mengulang kalau digulir keluar lalu kembali.

**Katakan:** "Animasi ini pakai `IntersectionObserver` dan
`requestAnimationFrame` — API bawaan browser, tanpa library animasi. PRD
melarang dependensi tambahan."

### Langkah 2 — Katalog dan pencarian

**Klik:** menu Psikotes → Psikotes Gratis. Ketik `big` di kolom cari, lalu
kosongkan. Ganti filter kategori ke *Relasi*.

**Tunjukkan:** hitungan "Menampilkan N tes" berubah tanpa halaman berpindah,
dan URL tidak berubah.

**Katakan:** "Sepuluh kartu ini dirender dari `data/tests.json`, bukan ditulis
di markup. Pencarian dan filter berjalan penuh di sisi klien di
`useTestCatalog`."

### Langkah 3 — Hover kartu (khusus desktop)

**Arahkan kursor** ke kartu Big Five.

**Tunjukkan:** panel kuning berisi deskripsi muncul, tombol "Lihat Tes" tetap
terlihat dan tetap bisa diklik.

**Katakan:** "Di layar sentuh tidak ada hover, jadi deskripsinya ditampilkan
langsung di kartu. Satu komponen, dua perilaku, dibedakan lewat breakpoint."

### Langkah 4 — Halaman detail

**Klik:** kartu Big Five.

**Tunjukkan:** empat kotak fakta, panduan pengisian, FAQ yang bisa dibuka.

**Katakan:** "Halaman ini menyusun tiga komponen: `TestFactGrid`,
`TestGuidelines`, `TestFaqSection`. Halamannya sendiri hanya mengatur tata
letak."

### Langkah 5 — Mengerjakan tes

**Klik:** Mulai. Jawab 2–3 soal.

**Tunjukkan:** bar progres bertambah dengan animasi kilap, hitung mundur
berjalan di pojok kanan atas, soal berpindah otomatis setelah dijawab.

### Langkah 6 — Bukti penyimpanan (bagian terpenting)

**Lakukan:** tekan F5 di tengah tes.

**Tunjukkan:** jawaban yang tadi dipilih masih tersorot, posisi soal sama, dan
hitung mundur **melanjutkan** angka sebelumnya — bukan kembali ke 5:00.

**Katakan:** "Ini kriteria penerimaan nomor 4 di PRD. Semua state ada di
`localStorage`, ditulis lewat satu composable `usePersistentState`."

**Lanjutkan:** buka DevTools → Application → Local Storage, tunjukkan objeknya:

```json
{"version":3,"testId":"big-five","answers":{"1":4},"currentIndex":1,
 "startedAt":"2026-...","elapsedMs":4984,"completedAt":null}
```

### Langkah 7 — Timer berhenti saat keluar

**Klik:** tombol Keluar, tunggu beberapa detik, lalu klik Lanjutkan Tes.

**Tunjukkan:** hitung mundur melanjutkan dari angka terakhir, bukan berkurang
selama di luar.

**Katakan:** "`startedAt` menandai babak yang sedang berjalan, `elapsedMs`
menabung babak yang sudah selesai. Keluar halaman menutup babak."

### Langkah 8 — Hasil

**Selesaikan** sisa soal → Lihat Hasil.

**Tunjukkan:** skor total, dimensi paling menonjol, rincian per dimensi, dan
rekomendasi tes lain di bawah.

**Klik:** Beranda, lalu kembali ke detail Big Five.

**Tunjukkan:** tombolnya kembali "Mulai" — attempt yang sudah selesai dibuang
begitu pengguna meninggalkan halaman tes, jadi tesnya bisa diulang.

### Langkah 9 — Responsif

**Buka** DevTools responsive, set 390px, telusuri ulang dari beranda.

**Tunjukkan:** hero menumpuk dengan gambar di atas, statistik tetap empat
kolom sebaris, kartu manfaat jadi 2×2, langkah punya satu tombol "Lihat
Deskripsi".

---

## 2. Urutan Membedah Kode

Bedah dari Model ke View. Ini juga urutan yang membuat MVVM masuk akal saat
dijelaskan.

| Urutan | File | Satu kalimat penjelas |
|---|---|---|
| 1 | `app/types/` | Bentuk data. `TestAttempt` sekaligus skema localStorage. |
| 2 | `data/tests.json` | Sumber katalog, di luar `app/`, dibaca juga saat build untuk menentukan rute prerender. |
| 3 | `app/composables/usePersistentState.ts` | Satu-satunya tempat kode menyentuh localStorage. |
| 4 | `app/composables/useTestAttempt.ts` | State pengerjaan: jawaban, posisi soal, babak waktu. |
| 5 | `app/composables/useTestResult.ts` | Penilaian. Tidak ada komponen yang menghitung skor. |
| 6 | `app/pages/psikotes/[id]/mulai.vue` | View: merender dan mengirim event, tidak menyimpan apa pun. |
| 7 | `app/components/base/` | Komponen tanpa pengetahuan domain: section, heading, progress bar. |

**Aturan yang bisa kamu sebut sebagai prinsip:** komponen tidak pernah
menyentuh `localStorage` dan tidak pernah menghitung skor. Kalau ada yang
bertanya "di mana logikanya?", jawabannya selalu `app/composables/`.

---

## 3. Pertanyaan yang Mungkin Muncul

**"Kenapa tidak pakai Pinia?"**
PRD menetapkan `useState` dari Nuxt 3 dikombinasikan dengan localStorage.
`useState` sudah memberi state global yang aman untuk SSR; Pinia akan jadi
dependensi tambahan tanpa menambah kemampuan yang dibutuhkan di sini.

**"Timernya bisa dicurangi, dong?"**
Bisa, dan itu tidak bisa dihindari tanpa backend. Semua state ada di browser
pengguna — siapa pun bisa mengosongkan localStorage. Karena PRD melarang
backend, saya memilih perilaku yang jujur: timer sebagai pemandu ritme, bukan
pengawas ujian. Perilakunya juga dinyatakan terang di panduan halaman detail.

**"Kenapa cuma satu tes yang jalan?"**
Sesuai PRD: satu tes fungsional dari sepuluh entri katalog. Sembilan sisanya
menampilkan "Coming Soon". Bank soal berupa registry di `useTestQuestions`
yang di-key per id tes, jadi menambah tes berarti menambah satu entri, bukan
mengubah alur.

**"Bagaimana kalau skema localStorage berubah?"**
`TestAttempt.version` dinaikkan dan payload lama dibuang oleh penjaga
`isTestAttempt`. Ini sudah terjadi sekali: v3 memecah jam jadi `elapsedMs` +
`startedAt`, dan payload v2 dibuang karena artinya berbeda.

**"Kenapa tidak ada unit test?"**
Tidak ada framework test di proyek ini. Verifikasi dilakukan lewat
`npm run typecheck`, `npm run generate`, dan pengecekan langsung di browser
pada beberapa lebar layar. Untuk cakupan MVP satu minggu ini, saya
memprioritaskan alur yang benar-benar dipakai pengguna.

**"AI dipakai untuk apa?"**
Jawab spesifik: pembuatan struktur awal, refactor, dan penelusuran bug seperti
konflik `z-index` dan jebakan merge kelas Nuxt UI. Setiap perubahan diverifikasi
di browser sebelum diterima.
