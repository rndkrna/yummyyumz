# Desain upgrade opening Home

Tanggal: 2026-06-11

## Tujuan

Meningkatkan tampilan awal halaman `Home` pada `landing` agar terasa lebih wow, lebih interaktif, dan lebih hidup tanpa mengubah konsep utama situs.

Perubahan difokuskan pada hero section paling atas, khususnya kesan awal saat halaman pertama kali dibuka dan pengalaman scroll awal sesudahnya.

## Ruang lingkup

- Memperbarui pengalaman visual pada opening `Home`
- Menjaga identitas dasar hero yang sekarang: tipografi besar, image-led, editorial, playful-premium
- Menambahkan mini sequence 2 tahap saat scroll awal
- Membuat background, headline, dan elemen pendukung terasa lebih hidup
- Menjaga CTA tetap jelas dan tidak tenggelam oleh animasi

Perubahan ini tidak mencakup redesign total halaman `Home`, pergantian identitas brand, atau perubahan struktur section setelah hero.

## Pendekatan

### Opsi yang dipilih

Pendekatan yang dipakai adalah `hybrid terarah`.

Artinya, struktur utama hero tetap dikenali sebagai hero YummyYumz yang sekarang, tetapi pengalaman visual awal dan transisi scroll pertamanya dibangun ulang secara selektif agar terasa seperti mini sequence.

### Alasan memilih pendekatan ini

- Efek wow meningkat tanpa membuat konsep dasar terasa berubah total
- Hero tetap punya anchor visual yang kuat dan familiar
- Risiko desain menjadi terlalu ramai lebih rendah dibanding membangun ulang hero secara total
- Lebih aman untuk diimplementasikan di basis kode yang sudah ada

## Desain pengalaman

### Tahap 1: impact scene

Scene pertama adalah kesan awal saat halaman dibuka.

Fokusnya:

- headline utama langsung terasa dominan
- background image terasa lebih hidup dan lebih sinematik
- elemen pendukung seperti label, CTA, dan aksen visual tidak lagi terasa pasif
- keseluruhan hero terasa penuh energi sejak detik pertama

Elemen yang dipertahankan:

- tipografi besar sebagai pusat perhatian
- background visual besar
- nuansa bold, editorial, dan playful

Elemen yang dipoles:

- layering lebih kaya
- depth visual lebih terasa
- entrance animation lebih rapi dan terarah

### Tahap 2: reveal scene

Saat pengguna mulai scroll, hero tidak langsung sekadar mengecil lalu menghilang.

Yang terjadi:

- headline bergeser, terpotong ritmenya, atau berubah komposisi secara terkontrol
- background image membuka ruang visual baru
- layer kedua muncul sebagai reveal editorial
- CTA dan aksen kecil ikut bergerak dengan timing yang berbeda

Tujuannya agar scroll awal terasa seperti transformasi adegan, bukan sekadar perpindahan dari satu section ke section berikutnya.

## Elemen gerak

### Background

Background image akan diberi rasa depth yang lebih kuat.

Pilihan gerak yang diprioritaskan:

- parallax halus
- scaling yang lebih sinematik
- perpindahan posisi yang mendukung reveal tahap kedua

Geraknya harus tetap lembut agar tidak terlihat seperti efek demo yang berlebihan.

### Headline

Headline tetap menjadi anchor visual utama.

Perubahan yang direncanakan:

- entrance lebih tegas
- perpindahan posisi atau scale saat scroll awal
- layering dengan background atau typography lain agar terasa lebih dimensional

Headline tidak boleh kehilangan keterbacaan hanya demi efek.

### CTA dan elemen kecil

CTA, label, dan elemen kecil akan ikut diberi motion.

Tujuannya:

- memberi rasa hidup pada scene pertama
- menjaga perhatian pengguna tidak hanya tertahan pada satu objek
- membuat hero terasa lebih lengkap

Namun geraknya harus tetap sekunder dibanding headline dan background.

### Background typography

Marquee atau background typography tetap bisa dipakai, tetapi ritmenya akan diperhalus.

Fungsinya adalah mendukung mood dan memberi tekstur visual, bukan bersaing dengan headline utama.

## Batas desain

Supaya hasilnya tetap elegan:

- jumlah layer aktif dibatasi
- tidak semua elemen bergerak besar pada waktu yang sama
- warna tambahan tidak diperbanyak secara liar
- durasi motion dibuat smooth dan premium
- CTA tetap mudah ditemukan

Prinsip utamanya adalah interaktif dan wow, tetapi tetap terasa mahal dan terkontrol.

## Dampak teknis

Perubahan paling besar kemungkinan terjadi di:

- `landing/src/components/sections/Hero.jsx`

Kemungkinan kecil ada penyesuaian tambahan di:

- `landing/src/pages/Home.jsx`
- stylesheet yang memengaruhi hero bila diperlukan

Implementasi sebaiknya tetap memanfaatkan GSAP dan pola scroll animation yang sudah dipakai agar konsisten dengan proyek sekarang.

## Error handling dan kualitas

- Hero harus tetap aman dirender bila animasi belum berjalan
- Layout harus tetap terbaca di mobile
- Motion tidak boleh menyebabkan CTA hilang atau tertutup
- Transisi harus tetap halus walau performa perangkat tidak maksimal
- Cleanup animasi harus tetap aman saat unmount

## Pengujian

Verifikasi setelah implementasi:

1. cek kesan awal hero saat halaman pertama dibuka
2. cek transisi tahap 1 ke tahap 2 saat scroll awal
3. cek keterbacaan headline
4. cek visibilitas CTA
5. cek tampilan di desktop dan mobile
6. jalankan `npm run test`
7. jalankan `npm run lint`
8. jalankan `npm run build`

## Kriteria selesai

Pekerjaan dianggap selesai bila:

- opening `Home` terasa lebih wow dan lebih interaktif
- hero tetap konsisten dengan konsep utama YummyYumz
- ada mini sequence 2 tahap saat scroll awal
- headline, background, dan elemen kecil terasa lebih hidup
- CTA tetap jelas
- test, lint, dan build tetap lolos

## Catatan

Folder kerja ini belum merupakan repository git, sehingga dokumen ini belum bisa di-commit saat ini. Jika nanti proyek diinisialisasi sebagai repository git, dokumen ini dapat ikut dimasukkan ke histori perubahan.
