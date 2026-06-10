# Landing YummyYumz

Landing page React + Vite untuk brand `YummyYumz`. Proyek ini berisi halaman utama, katalog, serta halaman tentang dan kontak dengan perilaku CTA yang lebih jujur.

## Halaman

- `/` berisi hero, cerita brand, katalog singkat, pengemasan, dan CTA
- `/catalog` berisi katalog penuh
- `/about` berisi profil singkat brand dan form kontak

## Catatan implementasi

- Navigasi memakai `react-router-dom`
- Smooth scrolling dikelola oleh `@studio-freight/lenis`
- Form kontak dan footer tidak lagi dummy; keduanya membentuk tautan WhatsApp dari input pengguna
- Data utama dipusatkan di `src/data/siteData.js`

## Perintah

- `npm install`
- `npm run dev`
- `npm run test`
- `npm run lint`
- `npm run build`

## Verifikasi terakhir

Status terakhir setelah perapihan:

- `npm run test` lulus
- `npm run lint` lulus
- `npm run build` lulus
