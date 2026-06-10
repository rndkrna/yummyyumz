# Desain landing dan admin basic

Tanggal: 2026-06-11

## Tujuan

Melakukan pengembangan bertahap pada proyek `landing` dan `dashboard` tanpa mengubah konsep visual utamanya.

Fokus pekerjaan ini adalah:

- memisahkan halaman `About` dan `Contact` menjadi dua halaman berbeda di navbar
- menambahkan halaman `FAQ`
- mengganti section `Packaging & Delivery` di `Home` menjadi section `Moment`
- membuat area visual section `Moment` menjadi slider foto yang lebih hidup dan interaktif
- menyiapkan admin basic di `dashboard` untuk mengelola data `menu` dan `moment`
- merapikan struktur data agar mudah disambungkan ke backend di tahap berikutnya

## Ruang lingkup

### `landing`

- Memperbarui navigasi utama menjadi `Home`, `Catalog`, `About`, `Contact`, dan `FAQ`.
- Memecah halaman gabungan `AboutContact` menjadi dua halaman terpisah.
- Menambahkan halaman `FAQ` dengan interaksi accordion.
- Mengganti komponen `DeliveryBox` menjadi section `Moment` dengan layout dua kolom yang tetap menjaga komposisi utama saat ini.
- Menambahkan slider foto pada area visual section `Moment`.
- Memindahkan data produk, FAQ, dan moment ke struktur data lokal yang lebih jelas.
- Memperhalus visual dan interaksi agar terasa lebih premium, lebih interaktif, dan tetap konsisten dengan identitas sekarang.

### `dashboard`

- Mengembangkan dashboard statis menjadi admin basic dengan area pengelolaan data.
- Menambahkan panel atau tab untuk `Kelola Menu` dan `Kelola Moment`.
- Menyediakan alur tambah, edit, dan hapus item secara lokal terlebih dahulu.
- Menyusun bentuk data admin agar sejalan dengan data yang dibaca oleh `landing`.

## Pendekatan

### Opsi yang dipilih

Pendekatan yang dipakai adalah model hybrid bertahap.

Artinya, perubahan visual dan struktur halaman pada `landing` dikerjakan sekarang, sambil menyiapkan admin basic yang memakai data lokal dengan bentuk yang siap dipindahkan ke sumber data nyata nanti.

### Alasan memilih pendekatan ini

- Perubahan terasa nyata untuk pengguna akhir karena `landing` langsung membaik.
- Dashboard admin mulai berguna tanpa harus menunggu backend.
- Struktur data dibangun dengan bentuk yang konsisten sehingga perpindahan ke API atau backend di tahap berikutnya tidak memaksa refactor besar.
- Risiko proyek melebar tetap terkendali.

## Desain halaman

### Navbar

Navbar `landing` akan diubah menjadi:

- `Home`
- `Catalog`
- `About`
- `Contact`
- `FAQ`

Perubahan ini menegaskan pemisahan fungsi tiap halaman dan membuat alur navigasi lebih mudah dipahami.

### `Home`

Urutan halaman utama tetap menjaga ritme dan konsep yang sudah ada:

1. `Hero`
2. `About teaser`
3. `Marquee separator`
4. `Catalog teaser`
5. `Moment`
6. `Footer`

Dengan urutan ini, identitas visual utama tidak berubah, namun penutup halaman menjadi lebih emosional dan lebih kuat secara storytelling.

### `Moment`

Section `Packaging & Delivery` akan diganti menjadi `Moment`, tetapi komposisi visual dasarnya tetap dipertahankan:

- kolom kiri berisi label section, judul besar, deskripsi, dan highlight singkat
- kolom kanan tetap berupa frame visual besar dengan rounded corner, shadow tebal, dan badge dekoratif

Perubahan isi:

- label section berubah dari tema logistik ke tema emosional
- headline dan copy berfokus pada momen penggunaan kue, bukan kemasan
- dua highlight kecil di bawah judul berganti menjadi poin seperti personalisasi, kehangatan, atau fleksibilitas custom
- badge bulat tetap ada, tetapi teksnya disesuaikan dengan tema `moment`

### Slider `Moment`

Frame visual pada sisi kanan akan menjadi slider foto.

Perilaku yang direncanakan:

- otomatis berganti slide dalam interval yang halus
- tersedia kontrol manual `prev` dan `next`
- tersedia indikator slide aktif
- transisi antar slide memakai animasi lembut
- gambar dapat diberi sedikit efek zoom saat aktif atau saat hover
- struktur cukup ringan agar tetap nyaman di perangkat mobile

Setiap item moment akan memiliki minimal:

- `id`
- `title`
- `caption`
- `image`
- `tag` opsional

### `About`

Halaman `About` akan difokuskan menjadi halaman cerita brand.

Isinya menonjolkan:

- asal mula YummyYumz
- visi dan rasa yang ingin dibawa
- pendekatan bahan dan proses
- karakter brand yang membedakan dari toko kue biasa

Visualnya tetap ekspresif dengan tipografi besar, blok gambar, serta nuansa editorial yang masih sejalan dengan gaya sekarang.

### `Contact`

Halaman `Contact` akan menjadi halaman khusus kontak dan pemesanan.

Struktur utamanya:

- intro singkat
- form kontak yang tetap mengarah ke WhatsApp
- info jam buka
- alamat
- CTA cepat ke WhatsApp dan Instagram

Pemisahan ini membuat pengguna yang ingin mengenal brand tidak bercampur dengan pengguna yang ingin langsung memesan.

### `FAQ`

Halaman `FAQ` akan menggunakan pola accordion yang mudah dipindai.

Isi awal FAQ mencakup:

- cara order
- minimal waktu pemesanan
- custom desain atau tulisan
- pilihan rasa
- area pengiriman
- sistem pembayaran
- perubahan dan pembatalan pesanan

## Desain data

### Sumber data bersama

Data lokal akan dipisahkan dari komponen UI dan disusun dalam bentuk yang lebih terstruktur.

Ruang data yang disiapkan:

- informasi bisnis
- produk unggulan
- katalog penuh
- slides `moment`
- daftar `faq`

Komponen di `landing` hanya membaca data dari modul data bersama. Tujuannya agar perubahan isi konten tidak mengharuskan edit langsung ke file UI.

### Kesiapan sinkronisasi

Pada tahap ini, sinkronisasi penuh `dashboard` ke `landing` belum dipaksakan ke backend. Namun bentuk data akan dibuat seragam agar mudah disambungkan nanti.

Prinsipnya:

- `dashboard` mengelola data dengan struktur yang sama seperti yang dibaca `landing`
- lapisan data dibuat cukup terpisah dari tampilan
- ketika backend tersedia, sumber data bisa diganti tanpa membongkar komponen visual

## Desain admin basic

### Tujuan admin

Admin basic di `dashboard` berfungsi sebagai fondasi pengelolaan konten, bukan sebagai sistem final.

Fokus tahap ini:

- admin bisa melihat daftar item
- admin bisa menambah item baru
- admin bisa mengubah item yang ada
- admin bisa menghapus item

### Area admin

Dashboard akan memiliki minimal dua area:

- `Kelola Menu`
- `Kelola Moment`

`Kelola Menu` dipakai untuk produk atau item katalog yang ingin ditampilkan.

`Kelola Moment` dipakai untuk slide foto moment yang tampil di halaman utama.

### Bentuk UI admin

Desain admin tetap sederhana tetapi lebih hidup dibanding tampilan statis saat ini.

Komponen utamanya:

- header dan ringkasan singkat
- tab, panel, atau switcher section
- daftar item dalam kartu atau tabel ringan
- form editor untuk tambah dan edit
- tombol aksi yang jelas

UI admin tidak harus penuh fitur enterprise. Prioritasnya adalah mudah dipakai, rapi, dan menjadi fondasi yang benar.

## Error handling

- Form `Contact` tetap memvalidasi input minimum sebelum membuka WhatsApp.
- Slider `Moment` harus aman jika data slide kosong, misalnya dengan fallback visual yang jelas.
- Halaman `FAQ` tetap bisa dirender aman walau jumlah item berubah.
- Editor admin harus menangani kondisi data kosong tanpa membuat tampilan rusak.
- Operasi tambah, edit, dan hapus lokal harus memperbarui state dengan aman dan konsisten.

## Pengujian

Verifikasi setelah implementasi:

1. `landing`: cek routing halaman baru dan navbar
2. `landing`: cek slider `Moment` di desktop dan mobile
3. `landing`: cek halaman `About`, `Contact`, dan `FAQ`
4. `dashboard`: cek alur tambah, edit, dan hapus untuk `menu`
5. `dashboard`: cek alur tambah, edit, dan hapus untuk `moment`
6. `landing`: `npm run lint`
7. `landing`: `npm run build`
8. `dashboard`: `npm run lint`
9. `dashboard`: `npm run build`

## Batasan

- Tidak mengubah identitas visual utama secara total.
- Tidak membuat backend baru pada tahap ini.
- Tidak memaksa sinkronisasi real-time antara `dashboard` dan `landing`.
- Tidak menambah fitur admin di luar kebutuhan dasar pengelolaan `menu` dan `moment`.

## Kriteria selesai

Pekerjaan dianggap selesai bila:

- navbar `landing` sudah memuat `Home`, `Catalog`, `About`, `Contact`, dan `FAQ`
- `About` dan `Contact` sudah menjadi halaman terpisah
- halaman `FAQ` sudah tersedia dan berfungsi
- section `Moment` sudah menggantikan `Packaging & Delivery`
- frame visual pada section `Moment` sudah menjadi slider foto yang berfungsi
- struktur data konten sudah lebih rapi dan mudah disambungkan ke tahap berikutnya
- `dashboard` sudah memiliki admin basic untuk `menu` dan `moment`
- `landing` dan `dashboard` lolos verifikasi build dan lint

## Catatan

Folder kerja ini belum merupakan repository git, jadi dokumen desain belum bisa di-commit saat ini. Jika nanti proyek diinisialisasi sebagai repository git, dokumen ini dapat ikut dimasukkan ke histori perubahan.
