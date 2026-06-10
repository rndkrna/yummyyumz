# Desain perbaikan proyek

Tanggal: 2026-06-11

## Tujuan

Melakukan perbaikan menyeluruh pada dua aplikasi di folder ini, yaitu `landing` dan `dashboard`, dengan fokus pada stabilitas, kebersihan kode, kejelasan perilaku UI, dan kesiapan pengembangan lanjutan.

Perbaikan ini tidak mencakup redesign total, backend baru, atau integrasi Supabase sungguhan. Targetnya adalah menghasilkan basis kode yang lebih bersih, lolos verifikasi teknis, dan lebih jujur terhadap kondisi fitur yang tersedia.

## Ruang lingkup

### `landing`

- Memperbaiki arsitektur `SmoothScroll` agar `Navbar` benar-benar berada di dalam `SmoothScrollContext`.
- Memperbaiki cleanup listener/animasi GSAP dan Lenis agar tidak meninggalkan callback saat unmount.
- Membersihkan error lint sampai `npm run lint` lolos.
- Merapikan import yang tidak dipakai, ref yang tidak dipakai, dan pola effect yang tidak ideal.
- Memusatkan data hardcoded utama ke struktur konfigurasi/data lokal yang lebih jelas.
- Mengubah form dan CTA dummy menjadi perilaku yang nyata dan tidak menyesatkan.
- Merapikan tautan eksternal dan atribut keamanan link.
- Menghapus dependensi yang tidak dipakai bila aman dilakukan.

### `dashboard`

- Mengganti halaman template bawaan Vite menjadi dashboard yang benar-benar representatif.
- Menyediakan struktur UI sederhana dan siap dikembangkan: header, kartu ringkasan, panel status, daftar aktivitas atau placeholder data yang jelas.
- Merapikan dependensi yang belum dipakai.
- Memastikan `build` dan `lint` lolos.

## Pendekatan

### Opsi yang dipilih

Pendekatan yang dipakai adalah perbaikan menyeluruh bertahap.

Urutan kerja:

1. Menstabilkan fondasi teknis `landing`.
2. Membersihkan lint dan struktur data `landing`.
3. Membuat perilaku form dan CTA lebih jujur/berguna.
4. Merombak `dashboard` dari template menjadi UI dashboard yang layak.
5. Membersihkan dependensi dan menjalankan verifikasi akhir.

### Alasan memilih pendekatan ini

- Risiko perubahan lebih terkendali dibanding refactor agresif sekaligus.
- Temuan audit sebelumnya dapat ditutup satu per satu dengan verifikasi jelas.
- Hasil akhir tetap menyentuh seluruh proyek tanpa perlu redesign besar.

## Desain teknis

### Arsitektur `landing`

- `SmoothScroll` akan dijadikan pembungkus yang benar-benar menaungi komponen yang membutuhkan akses ke context, termasuk `Navbar`.
- State instance Lenis tidak akan dikelola dengan pola yang menimbulkan error lint yang tidak perlu bila ada alternatif yang lebih aman.
- Callback yang didaftarkan ke `gsap.ticker` akan disimpan dengan referensi yang bisa dibersihkan secara tepat saat cleanup.
- Data bisnis dasar seperti kontak, daftar produk, jam buka, dan tautan sosial akan dipindahkan ke konstanta atau modul data lokal agar tidak tersebar di banyak komponen.

### UX form dan CTA `landing`

- Form kontak tidak akan dibiarkan terlihat seolah mengirim data padahal tidak melakukan apa-apa.
- Pilihan implementasi yang diprioritaskan adalah mengarahkan input pengguna ke WhatsApp melalui URL terformat, karena ini tidak memerlukan backend baru dan tetap memberi hasil nyata.
- Bila ada CTA yang belum memiliki fungsi bisnis nyata, label atau perilakunya akan disesuaikan agar tidak misleading.

### Arsitektur `dashboard`

- `dashboard` akan diubah dari template menjadi halaman ringkas yang memiliki identitas produk.
- Isi akan berbentuk dashboard statis namun realistis, misalnya:
  - kartu statistik utama
  - status operasional
  - daftar pesanan terbaru atau aktivitas terbaru
  - panel tindakan cepat
- Struktur komponen akan dibuat sederhana agar mudah dikembangkan ke integrasi data nyata di tahap berikutnya.

## Error handling

- Form ke WhatsApp akan memvalidasi input minimum sebelum membentuk pesan.
- Link eksternal akan memakai atribut yang aman.
- Komponen animasi harus aman saat remount dan tidak bergantung pada referensi context yang salah.
- Bila ada data opsional yang kosong, UI akan menampilkan fallback yang jelas.

## Pengujian

Verifikasi setelah implementasi:

1. `npm run lint` pada `landing`
2. `npm run build` pada `landing`
3. `npm run lint` pada `dashboard`
4. `npm run build` pada `dashboard`
5. Pemeriksaan cepat untuk memastikan form/CTA dan navigasi tidak rusak

## Batasan

- Tidak membuat backend baru.
- Tidak mengaktifkan integrasi Supabase nyata.
- Tidak melakukan redesign branding besar-besaran.
- Tidak menambah fitur di luar kebutuhan audit kecuali dibutuhkan untuk menutup bug atau membuat perilaku UI lebih jujur.

## Kriteria selesai

Pekerjaan dianggap selesai bila:

- `landing` dan `dashboard` sama-sama lolos `build`
- `landing` dan `dashboard` sama-sama lolos `lint`
- bug konteks `SmoothScroll` di `landing` sudah diperbaiki
- cleanup GSAP/Lenis tidak menyisakan callback yang salah
- form/CTA dummy tidak lagi menyesatkan
- `dashboard` tidak lagi berupa template Vite
- dependensi yang jelas-jelas tidak terpakai sudah dirapikan

## Catatan

Folder ini belum merupakan repository git, sehingga dokumen ini belum dapat di-commit. Jika nanti proyek diinisialisasi sebagai git repository, dokumen ini bisa ikut dimasukkan ke histori perubahan.
