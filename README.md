# Pemograman_web1_UTS
Nama: Den Fahmi Satria
Nim: 312410523
Kelas: TI.24.A5

# 📚 Aplikasi Web Pemesanan Buku Sederhana (Front-End Simulation)

Aplikasi web sederhana ini dibuat untuk memenuhi Ujian Tengah Semester (UTS) mata kuliah Pemrograman Web 1. Fokus utama proyek ini adalah demonstrasi penguasaan fundamental **HTML Semantik**, **CSS Styling**, dan **JavaScript DOM Manipulation** untuk menciptakan alur kerja aplikasi dinamis.

Proyek ini mensimulasikan proses pemesanan buku, mulai dari login hingga pencatatan riwayat transaksi. Seluruh data (pengguna, katalog, riwayat) dikelola di sisi klien menggunakan variabel Array JSON (`data.js`) tanpa menggunakan *backend* atau *database* server.

## 🚀 Fitur Utama

Aplikasi ini mencakup lima halaman utama dengan fungsionalitas dinamis:

### 1. Halaman Login (`index.html`)
* **Simulasi Sesi:** Menggunakan `localStorage` untuk menyimpan data pengguna aktif (`activeUser`) setelah berhasil *login*.
* **Validasi:** Menerapkan validasi kredensial (Email & Password) terhadap data di `data.js`.
* **Interaksi UI:** Menampilkan **Modal Box/Pop-up** untuk simulasi fitur Lupa Password dan Daftar.

### 2. Dashboard (`dashboard.html`)
* **Greeting Dinamis (JavaScript DOM Manipulation):** Menampilkan sapaan yang disesuaikan berdasarkan waktu lokal (*Pagi/Siang/Sore/Malam*) dan menyertakan nama serta *role* pengguna aktif.

### 3. Pemesanan / Checkout (`checkout.html`)
* **Real-time Calculation:** Perhitungan total pembayaran yang otomatis diperbarui berdasarkan kuantitas pesanan.
* **Dynamic Data Management:** Logika pemesanan secara langsung:
    * Membuat Nomor Faktur unik baru.
    * **Mengurangi stok** buku dari `dataKatalogBuku`.
    * Menambahkan item baru ke `dataHistoryTransaksi`.
* **Tampilan Invoice:** Setelah konfirmasi, *form* pemesanan disembunyikan dan digantikan oleh tampilan **Invoice** transaksi yang baru dibuat di halaman yang sama.

### 4. History Transaksi (`history.html`)
* **Filter Berdasarkan Role (Kriteria Penting UTS):**
    * **User:** Hanya dapat melihat transaksi yang dilakukan oleh dirinya sendiri.
    * **Admin:** Dapat melihat seluruh riwayat transaksi yang tercatat.
* **Tautan Lacak:** Kolom aksi menyediakan tombol untuk melacak pengiriman jika pesanan sudah memiliki Nomor Delivery Order (`nomorDO`).

### 5. Tracking Pengiriman (`tracking.html`)
* Menerima input Nomor Delivery Order (DO) dan menampilkan status pengiriman, detail ekspedisi, dan riwayat perjalanan (simulasi *timeline*).

## ⚙️ Struktur Proyek (Modularitas)

Struktur file dan modularitas mengikuti panduan soal UTS:
