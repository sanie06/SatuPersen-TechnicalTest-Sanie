# Gambar header kartu tes

Taruh gambar di folder ini. Nama file harus sama persis dengan nilai `image`
di `data/tests.json` — itu satu-satunya tempat nama file ditentukan.

## Format

Bebas: **PNG, JPG, SVG, atau WebP**. Keempatnya sudah diuji dan render sama
rapinya. Kode hanya memakai `<img src>` biasa, jadi format apa pun yang
didukung browser akan jalan.

Boleh campur antar tes — misalnya satu tes pakai `.svg`, sisanya `.png`.
Yang penting ekstensi di `tests.json` cocok dengan file yang diunggah.

| Format | Catatan |
|---|---|
| **PNG** | Dipakai untuk 8 gambar saat ini. Aman, mendukung transparansi. |
| **JPG** | Paling ringan untuk foto. Tidak mendukung transparansi. |
| **SVG** | Tajam di layar retina, ukuran file kecil untuk ilustrasi flat. |
| **WebP** | Dipakai untuk `love-language` dan `enneagram`. Paling kecil. |

## Spesifikasi

| Hal | Nilai |
|---|---|
| Rasio | 16:9 |
| Ukuran | 1200 × 675 px |
| Berat | < 150 KB per file |

Rasio wajib seragam antar tes. Gambar tetap dipaksa ke 16:9 lewat `object-cover`,
jadi file dengan rasio lain tidak merusak layout — tapi bagian tepinya akan
terpotong.

Teks di dalam gambar tidak terbaca screen reader. Judul tes sudah ada sebagai
teks tepat di bawah gambar, jadi ini bukan masalah.

## Nama file yang dibaca saat ini

```
big-five.png              minat-bakat-karier.png
mbti.png                  skrining-depresi.png
love-language.webp        burnout.png
attachment-style.png      red-flag-check.png
enneagram.webp            minat-bakat-umum.png
```

Mau pakai format lain? Ubah ekstensinya di `data/tests.json`, contoh:

```json
"image": "/images/tests/mbti.jpg"
```

## Kalau gambar belum ada

Kartu otomatis tampil tanpa gambar — tidak ada ikon rusak. Jadi aman diunggah
bertahap. Untuk menonaktifkan gambar pada satu tes secara permanen, hapus field
`image` dari entri tes itu di `data/tests.json`.

Catatan: selama sebagian tes sudah bergambar dan sebagian belum, kartu tanpa
gambar akan ikut meregang mengikuti tinggi baris grid sehingga terlihat ada
ruang kosong. Ini normal dan hilang sendiri begitu semua gambar lengkap.
