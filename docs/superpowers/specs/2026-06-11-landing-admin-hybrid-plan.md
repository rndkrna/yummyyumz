# Rencana implementasi landing dan admin basic

Tanggal: 2026-06-11

## Tujuan implementasi

Mengerjakan perubahan pada `landing` dan `dashboard` secara bertahap dengan urutan yang meminimalkan risiko kerusakan visual maupun struktur data.

Hasil akhir yang dituju:

- `landing` memiliki halaman `About`, `Contact`, dan `FAQ` yang terpisah
- `Home` memiliki section `Moment` berbasis slider
- struktur data konten lebih rapi dan siap dilanjutkan
- `dashboard` memiliki admin basic untuk mengelola `menu` dan `moment`

## Urutan kerja

### 1. Rapikan struktur data bersama

Fokus:

- menata ulang `siteData`
- memisahkan data bisnis, katalog, moment, dan faq
- menyiapkan bentuk data yang konsisten untuk dipakai `landing` dan `dashboard`

Pekerjaan:

- audit isi `landing/src/data/siteData.js`
- pecah atau rapikan ekspor data agar lebih mudah dibaca
- tambahkan data `momentSlides`
- tambahkan data `faqItems`
- pastikan struktur item produk dan moment punya field yang stabil

Alasan urutan ini:

Komponen baru dan editor admin akan jauh lebih mudah dikerjakan bila sumber datanya sudah jelas sejak awal.

### 2. Perbarui routing dan navbar `landing`

Fokus:

- memisahkan halaman gabungan menjadi halaman terpisah
- memastikan navigasi baru siap sebelum komponen halaman diganti

Pekerjaan:

- ubah `landing/src/App.jsx` untuk route baru
- perbarui `Navbar.jsx`
- ganti link `ABOUT & CONTACT` menjadi `ABOUT` dan `CONTACT`
- tambahkan link `FAQ`
- pastikan semua transisi dan perilaku scroll tetap aman

Kriteria cek:

- route `/about`, `/contact`, dan `/faq` bisa dibuka
- menu desktop dan mobile tetap berfungsi

### 3. Pecah halaman `About` dan `Contact`

Fokus:

- memisahkan tanggung jawab visual dan konten
- mempertahankan gaya desain utama

Pekerjaan:

- buat halaman `About.jsx` baru
- buat halaman `Contact.jsx` baru
- pindahkan logika form WhatsApp hanya ke `Contact`
- pertahankan atau poles animasi yang masih relevan
- sesuaikan CTA dari teaser `About` di halaman utama

Kriteria cek:

- `About` terasa sebagai halaman cerita brand
- `Contact` terasa sebagai halaman aksi pemesanan
- form WhatsApp tetap valid dan berfungsi

### 4. Tambah halaman `FAQ`

Fokus:

- memberi halaman informasi yang cepat dipindai

Pekerjaan:

- buat file halaman `FAQ.jsx`
- buat komponen accordion bila perlu
- hubungkan dengan data `faqItems`
- jaga gaya visual tetap satu keluarga dengan halaman lain

Kriteria cek:

- accordion dapat dibuka-tutup dengan baik
- tampilan tetap rapi saat item FAQ banyak atau sedikit

### 5. Ubah section `Delivery` menjadi `Moment`

Fokus:

- mengganti tema section terakhir tanpa merusak komposisi utama

Pekerjaan:

- refactor `DeliveryBox.jsx` menjadi komponen `Moment`
- ubah copy, label, highlight, dan badge
- sesuaikan id section dan anchor bila diperlukan
- pastikan ritme layout kiri-kanan tetap familiar dengan screenshot acuan

Kriteria cek:

- section baru tetap terasa menyatu dengan homepage
- tidak ada sisa copy lama bertema packaging/delivery

### 6. Bangun slider foto `Moment`

Fokus:

- membuat area visual lebih hidup dan interaktif

Pekerjaan:

- buat state slide aktif
- tambahkan autoplay
- tambahkan tombol `prev` dan `next`
- tambahkan indikator slide
- hubungkan ke `momentSlides`
- siapkan fallback aman bila data kosong

Kriteria cek:

- slide otomatis berganti
- kontrol manual bekerja
- tampilan tetap bagus di mobile

### 7. Poles visual `landing`

Fokus:

- menaikkan kualitas visual tanpa mengubah identitas utamanya

Pekerjaan:

- rapikan hierarchy tipografi
- perbaiki spacing dan keseimbangan blok
- perkuat CTA dan hover state
- cek konsistensi warna, shadow, dan radius
- review section `Catalog` agar tetap sejalan dengan halaman baru

Kriteria cek:

- semua halaman terasa satu sistem visual
- interaksi terasa lebih halus dan premium

### 8. Bangun admin basic di `dashboard`

Fokus:

- mengubah dashboard statis menjadi area kerja konten sederhana

Pekerjaan:

- rancang ulang layout `dashboard/src/App.jsx`
- tambahkan area `Kelola Menu`
- tambahkan area `Kelola Moment`
- buat daftar item dan form editor
- tambahkan aksi tambah, edit, hapus lokal

Kriteria cek:

- admin bisa mengelola dua jenis data
- state lokal berubah dengan benar setelah aksi

### 9. Samakan bentuk data `dashboard` dan `landing`

Fokus:

- memastikan fondasi sinkronisasi di tahap berikutnya tetap ringan

Pekerjaan:

- cek field data yang dibaca landing
- samakan nama field di admin editor
- hindari bentuk state yang berbeda terlalu jauh

Kriteria cek:

- data hasil editor mudah dipetakan ke data yang dibaca landing

### 10. Verifikasi akhir

Fokus:

- memastikan implementasi stabil

Pekerjaan:

- uji routing semua halaman `landing`
- uji form `Contact`
- uji slider `Moment`
- uji alur admin `menu`
- uji alur admin `moment`
- jalankan `npm run lint` dan `npm run build` pada `landing`
- jalankan `npm run lint` dan `npm run build` pada `dashboard`

## Risiko dan mitigasi

### Risiko 1

Pemisahan halaman `About` dan `Contact` dapat memutus CTA atau tautan lama.

Mitigasi:

- audit semua link yang menuju `/about`
- perbarui CTA dan anchor setelah route baru aktif

### Risiko 2

Slider `Moment` bisa terasa berat atau terlalu ramai.

Mitigasi:

- pakai transisi ringan
- batasi elemen kontrol agar tidak mengganggu visual utama
- siapkan fallback sederhana saat data sedikit

### Risiko 3

Admin basic berpotensi memiliki bentuk data yang tidak cocok dengan `landing`.

Mitigasi:

- tentukan kontrak field sebelum membangun editor
- pakai struktur data yang sama untuk kedua aplikasi sebisa mungkin

## Prioritas implementasi

Prioritas tinggi:

- struktur data
- route dan navbar baru
- halaman `About`, `Contact`, `FAQ`
- section `Moment` dan slider

Prioritas menengah:

- visual polish `landing`
- admin basic `dashboard`

Prioritas akhir:

- penyelarasan akhir bentuk data
- verifikasi lint dan build

## Hasil file yang kemungkinan berubah

### `landing`

- `src/App.jsx`
- `src/components/Navbar.jsx`
- `src/components/sections/DeliveryBox.jsx` atau file penggantinya
- `src/components/sections/Catalog.jsx`
- `src/data/siteData.js`
- `src/pages/Home.jsx`
- `src/pages/About.jsx`
- `src/pages/Contact.jsx`
- `src/pages/FAQ.jsx`
- file komponen pendukung baru bila diperlukan

### `dashboard`

- `src/App.jsx`
- `src/App.css`
- file komponen admin baru bila diperlukan

## Catatan eksekusi

Pekerjaan sebaiknya dijalankan dalam urutan di atas. Jika implementasi langsung dimulai, tahap paling aman adalah mengerjakan `landing` lebih dulu sampai struktur data, routing, dan halaman baru stabil, lalu baru masuk ke admin basic di `dashboard`.
