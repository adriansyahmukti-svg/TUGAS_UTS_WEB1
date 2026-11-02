Toko Buku Online UT (Universitas Terbuka)

Aplikasi web front-end interaktif untuk pengelolaan stok, pemesanan, dan pelacakan pengiriman buku modul pembelajaran Universitas Terbuka. Proyek ini dikembangkan sebagai bagian dari tugas mata kuliah Pemrograman Web 1.

Fitur Utama

Sistem Autentikasi Modern (Login & Registrasi)

Form Login interaktif dengan validasi input.

Modal interaktif untuk Lupa Password dan Pendaftaran Akun Baru.

Dashboard Pengguna

Panel navigasi terpusat dengan tautan cepat ke seluruh fitur utama.

Antarmuka intuitif dan responsif.

Katalog & Manajemen Stok Buku (stok.html)

Menampilkan daftar katalog buku lengkap (Kode, Cover, Judul, Jenis, Edisi, Stok, dan Harga).

Modal Tambah Stok Buku untuk menambahkan inventaris buku baru secara dinamis.

Form Checkout & Pemesanan (checkout.html)

Tabel ringkasan keranjang belanja interaktif.

Penghitungan subtotal dan total harga belanja secara otomatis.

Form data pemesan, alamat pengiriman, pilihan ekspedisi, dan metode pembayaran.

Tracking Pengiriman / Delivery Order (tracking.html)

Fitur pencarian status pengiriman berdasarkan Nomor Delivery Order (DO).

Visualisasi alur/status pengiriman paket (proses, dikirim, terkirim).

 Struktur Berkas

.
├── index.html          # Halaman Login utama
├── login.html          # Halaman Login alternatif / cadangan
├── dashboard.html      # Halaman Utama (Dashboard) setelah login
├── stok.html           # Halaman Katalog & Manajemen Stok Buku
├── checkout.html       # Halaman Checkout / Pemesanan
├── tracking.html       # Halaman Tracking Pengiriman DO
├── css/
│   └── style.css       # File stylesheet utama
└── js/
    ├── data.js         # Dummy data stok dan data tracking DO
    └── script.js       # Logika antarmuka, event handler, dan manipulasi DOM
