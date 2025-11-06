// tugas-uts-web1/js/script.js

// ==========================================================
// FUNGSI HELPER GLOBAL (Di luar document.addEventListener)
// ==========================================================

// Fungsi Helper untuk mengambil data pengguna aktif dari LocalStorage
const getActiveUser = () => {
    const userJSON = localStorage.getItem('activeUser');
    // Mengembalikan objek user jika ada, atau null jika tidak ada (belum login)
    return userJSON ? JSON.parse(userJSON) : null;
};

// Fungsi Helper untuk membuat nomor faktur baru yang unik
const generateNewInvoiceNumber = (historyData) => {
    // Cari nomor faktur terbesar saat ini (hanya angka terakhir)
    const maxNumber = historyData.reduce((max, item) => {
        // Ambil bagian angka dari nomor faktur (e.g., dari INV/2025/09/004, ambil 4)
        const parts = item.nomorFaktur.split('/');
        const currentNumber = parseInt(parts[parts.length - 1]);
        return currentNumber > max ? currentNumber : max;
    }, 0);
    
    const newNumber = maxNumber + 1;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
    const paddedNumber = String(newNumber).padStart(3, '0'); // Contoh: 1 menjadi 001
    
    return `INV/${year}/${month}/${paddedNumber}`;
};

// Fungsi Helper untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
};


document.addEventListener('DOMContentLoaded', () => {
    // Pastikan data.js sudah dimuat
    if (typeof dataPengguna === 'undefined' || typeof dataKatalogBuku === 'undefined' || typeof dataTracking === 'undefined' || typeof dataHistoryTransaksi === 'undefined') {
        console.error("Error: Data dummy (data.js) tidak ditemukan.");
        return;
    }

    // ==========================================================
    // LOGIC GLOBAL: MODAL BOX INTERACTION & LOGOUT
    // ==========================================================
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const registerBtn = document.getElementById('registerBtn');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const registerModal = document.getElementById('registerModal');
    const logoutLinks = document.querySelectorAll('a[href="index.html"]'); 

    const openModal = (modalElement) => {
        if (modalElement) modalElement.classList.add('active');
    };
    const closeModal = (modalElement) => {
        if (modalElement) modalElement.classList.remove('active');
    };

    if (forgotPasswordBtn) forgotPasswordBtn.addEventListener('click', () => openModal(forgotPasswordModal));
    if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));

    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // LOGIC LOGOUT: Hapus sesi dari localStorage saat klik Logout
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.textContent.trim().toLowerCase() === 'logout') {
                localStorage.removeItem('activeUser');
            }
        });
    });

    // ==========================================================
    // 1. LOGIC: Halaman Login (index.html) - Sesi Otomatis
    // ==========================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Jika sudah login, paksa ke dashboard
        if (getActiveUser()) {
             window.location.href = 'dashboard.html';
             return;
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email').value;
            const passwordInput = document.getElementById('password').value;

            const user = dataPengguna.find(
                u => u.email === emailInput && u.password === passwordInput
            );

            if (user) {
                alert(`Login berhasil! Selamat datang, ${user.nama}. Anda masuk sebagai ${user.role}.`);
                
                // Simpan data user ke localStorage (Simulasi Sesi)
                localStorage.setItem('activeUser', JSON.stringify({
                    nama: user.nama,
                    role: user.role
                }));
                
                window.location.href = 'dashboard.html';
            } else {
                alert("Login Gagal! email/password yang anda masukkan salah");
            }
        });
    }

    // ==========================================================
    // 2. LOGIC: Dashboard (dashboard.html) - Dynamic Greeting
    // ==========================================================
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const activeUser = getActiveUser();

        // Cek jika tidak ada sesi, paksa ke halaman login
        if (!activeUser) {
            alert("Sesi berakhir atau Anda belum login.");
            window.location.href = 'index.html';
            return;
        }

        const date = new Date();
        const hour = date.getHours();
        let greeting;

        if (hour >= 4 && hour < 10) {
            greeting = "Selamat Pagi";
        } else if (hour >= 10 && hour < 15) {
            greeting = "Selamat Siang";
        } else if (hour >= 15 && hour < 18) {
            greeting = "Selamat Sore";
        } else {
            greeting = "Selamat Malam";
        }

        const userName = activeUser.nama; 
        greetingElement.textContent = `${greeting}, ${userName}! (Role: ${activeUser.role})`;
    }

    // ==========================================================
    // 3. LOGIC: Informasi Stok/Katalog (stok.html)
    // ==========================================================
    const catalogGrid = document.getElementById('catalogGrid');
    const formTambahStok = document.getElementById('formTambahStok');

    const renderKatalog = () => {
        if (catalogGrid) {
            catalogGrid.innerHTML = ''; 
            dataKatalogBuku.forEach(buku => {
                const figure = document.createElement('figure');
                figure.classList.add('book-card');
                figure.setAttribute('id', `buku-${buku.kodeBarang}`);

                figure.innerHTML = `
                    <img src="${buku.cover}" alt="Cover Buku ${buku.namaBarang}">
                    <div class="book-details">
                        <figcaption>${buku.namaBarang}</figcaption>
                        <p>Kode: ${buku.kodeBarang} | Edisi: ${buku.edisi}</p>
                        <p>Jenis: ${buku.jenisBarang}</p>
                        <p class="stock-info">Stok: ${buku.stok} | Harga: ${buku.harga}</p>
                    </div>
                `;
                catalogGrid.appendChild(figure);
            });
        }
    };

    if (formTambahStok) {
        renderKatalog(); 
        formTambahStok.addEventListener('submit', (e) => {
            e.preventDefault();

            const kode = document.getElementById('newKode').value;
            const nama = document.getElementById('newNama').value;
            const stok = parseInt(document.getElementById('newStok').value);
            const harga = document.getElementById('newHarga').value;
            
            if (!kode || !nama || isNaN(stok) || !harga) {
                alert("Semua field harus diisi!");
                return;
            }

            const newBuku = {
                kodeBarang: kode,
                namaBarang: nama,
                jenisBarang: "Buku Ajar (Baru)",
                edisi: "-",
                stok: stok,
                // Format Harga ke Rupiah
                harga: `Rp ${harga.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, 
                cover: "img/default.jpg" 
            };

            dataKatalogBuku.push(newBuku);
            renderKatalog(); 
            
            alert(`Stok buku ${nama} (${kode}) berhasil ditambahkan!`);
            formTambahStok.reset();
        });
    }


    // ==========================================================
    // 4. LOGIC: Informasi Pengiriman (tracking.html)
    // ==========================================================
    const trackingForm = document.getElementById('trackingForm');
    const trackingResult = document.getElementById('trackingResult');

    const urlParams = new URLSearchParams(window.location.search);
    const initialDo = urlParams.get('do');
    
    if (trackingForm) {
        const inputDO = document.getElementById('nomorDO');
        
        // Memuat otomatis jika ada parameter 'do' dari history.html
        if (initialDo) {
            inputDO.value = initialDo;
            setTimeout(() => trackingForm.dispatchEvent(new Event('submit')), 100);
        }

        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomorDO = inputDO.value;
            const data = dataTracking[nomorDO];
            
            trackingResult.innerHTML = '';
            
            if (!data) {
                trackingResult.innerHTML = `<p class="error-message">Nomor Delivery Order **${nomorDO}** tidak ditemukan.</p>`;
                return;
            }

            let progressWidth = 0;
            let statusClass = '';
            if (data.status === 'Dikirim') {
                progressWidth = 100;
                statusClass = 'status-dikirim';
            } else if (data.status === 'Dalam Perjalanan') {
                progressWidth = 60;
                statusClass = 'status-dalam-perjalanan';
            } else {
                progressWidth = 20; 
                statusClass = 'status-dalam-perjalanan';
            }

            let historyHTML = data.perjalanan.map(item => `
                <li><strong>${item.waktu}</strong>: ${item.keterangan}</li>
            `).join('');

            trackingResult.innerHTML = `
                <section class="tracking-status-card">
                    <h3 class="status-label">Status: ${data.status}</h3>
                    
                    <div class="progress-bar">
                        <div class="progress-indicator ${statusClass}" style="width: ${progressWidth}%;">
                            ${data.status} (${progressWidth}%)
                        </div>
                    </div>

                    <table class="detail-table">
                        <tr><th>Nama Pemesan</th><td>${data.nama}</td></tr>
                        <tr><th>Nomor DO</th><td>${data.nomorDO}</td></tr>
                        <tr><th>Ekspedisi</th><td>${data.ekspedisi}</td></tr>
                        <tr><th>Tanggal Kirim</th><td>${data.tanggalKirim}</td></tr>
                        <tr><th>Jenis Paket</th><td>${data.paket}</td></tr>
                        <tr><th>Total Pembayaran</th><td>${data.total}</td></tr>
                    </table>

                    <h4 style="margin-top: 20px;">Riwayat Perjalanan:</h4>
                    <div class="tracking-history">
                        <ul>${historyHTML}</ul>
                    </div>
                </section>
            `;
        });
    }

    // ==========================================================
    // 5. LOGIC: History Transaksi (history.html) - Filter Role
    // ==========================================================
    const historyTableBody = document.getElementById('historyTableBody');
    const emptyHistoryMessage = document.getElementById('emptyHistoryMessage');

    const renderHistory = () => {
        if (historyTableBody && typeof dataHistoryTransaksi !== 'undefined') {
            
            const activeUser = getActiveUser();
            
            // Cek jika tidak ada sesi
            if (!activeUser) {
                alert("Sesi berakhir atau Anda belum login.");
                window.location.href = 'index.html';
                return;
            }

            const userRole = activeUser.role;
            const userName = activeUser.nama;
            let filteredHistory = [];

            // LOGIKA FILTER
            if (userRole === 'Admin') {
                filteredHistory = dataHistoryTransaksi; // Tampilkan semua
            } else if (userRole === 'User') {
                // Tampilkan hanya milik pengguna yang login
                filteredHistory = dataHistoryTransaksi.filter(
                    transaksi => transaksi.namaPelanggan === userName
                );
            }

            historyTableBody.innerHTML = ''; 

            if (filteredHistory.length === 0) {
                emptyHistoryMessage.textContent = userRole === 'User' 
                    ? `Anda belum memiliki riwayat transaksi, ${userName}.` 
                    : `Belum ada riwayat transaksi yang tercatat.`;
                emptyHistoryMessage.style.display = 'block';
                return;
            }

            emptyHistoryMessage.style.display = 'none';

            filteredHistory.forEach(transaksi => {
                const tr = document.createElement('tr');
                let statusClass = transaksi.status.toLowerCase().replace(' ', '');
                
                let actionButton = '';
                if (transaksi.nomorDO && transaksi.nomorDO !== '-') {
                    // Tombol Lacak akan mengarahkan ke tracking.html dengan parameter DO
                    actionButton = `<span class="status-badge track" 
                                    onclick="window.location.href='tracking.html?do=${transaksi.nomorDO}'">
                                        Lacak
                                    </span>`;
                } else if (transaksi.status === 'Menunggu Pembayaran') {
                    actionButton = `<button class="btn primary-btn" style="padding: 5px 10px; font-size: 0.8rem;">Bayar</button>`;
                } else {
                     actionButton = `-`;
                }

                tr.innerHTML = `
                    <td>${transaksi.nomorFaktur}</td>
                    <td>${transaksi.tanggal}</td>
                    <td>${transaksi.namaPelanggan}</td>
                    <td>${transaksi.totalPembayaran}</td>
                    <td><span class="status-badge ${statusClass}">${transaksi.status}</span></td>
                    <td>${actionButton}</td>
                `;
                historyTableBody.appendChild(tr);
            });
        }
    };

    if (historyTableBody) {
        renderHistory();
    }
    
    // ==========================================================
    // 6. LOGIC: Checkout (checkout.html) - Pembuatan Pesanan dan Tampilan Invoice
    // ==========================================================
    const checkoutFormSection = document.getElementById('checkoutFormSection'); 
    const invoiceDisplay = document.getElementById('invoiceDisplay'); 
    const checkoutForm = document.getElementById('checkoutForm');

    if (checkoutForm) {
        const activeUser = getActiveUser();
        if (!activeUser) {
            alert("Sesi berakhir, silakan login kembali.");
            window.location.href = 'index.html';
            return;
        }

        const pemesanInput = document.getElementById('pemesan');
        const bukuPesanSelect = document.getElementById('bukuPesan');
        const jumlahInput = document.getElementById('jumlah');
        const totalBayarInput = document.getElementById('totalBayar');
        const stokInfo = document.getElementById('stokInfo');

        // A. Inisialisasi Data Form
        document.getElementById('orderGreeting').textContent = `Halo, ${activeUser.nama}! Role: ${activeUser.role}`;
        pemesanInput.value = activeUser.nama;

        // B. Isi Opsi Select dari dataKatalogBuku
        dataKatalogBuku.forEach(buku => {
            const option = document.createElement('option');
            option.value = buku.kodeBarang;
            option.textContent = `${buku.namaBarang} (${buku.harga})`;
            // Simpan harga bersih (numeric) dan stok di dataset
            option.dataset.harga = buku.harga.replace('Rp', '').replace(/\./g, '').trim(); 
            option.dataset.stok = buku.stok;
            bukuPesanSelect.appendChild(option);
        });

        let currentHargaPerUnit = 0;
        let maxStok = 0;

        // C. Fungsi Update Total Harga & Stok
        const updatePriceAndStock = () => {
            const selectedOption = bukuPesanSelect.options[bukuPesanSelect.selectedIndex];
            
            if (selectedOption && selectedOption.value) {
                currentHargaPerUnit = parseInt(selectedOption.dataset.harga) || 0;
                maxStok = parseInt(selectedOption.dataset.stok) || 0;
            } else {
                currentHargaPerUnit = 0;
                maxStok = 0;
            }

            // Validasi Jumlah Pesanan
            let jumlah = parseInt(jumlahInput.value) || 0;
            if (jumlah > maxStok && maxStok > 0) {
                alert(`Pesanan melebihi stok yang tersedia (${maxStok}). Jumlah disesuaikan.`);
                jumlah = maxStok;
                jumlahInput.value = maxStok;
            } else if (jumlah <= 0) {
                 // Tidak perlu reset to 1 jika user memasukkan 0, biarkan user mengoreksi
            }
            
            // Tampilkan Stok Info
            stokInfo.textContent = `Stok tersedia: ${maxStok}`;

            // Hitung Total
            const total = jumlah * currentHargaPerUnit;
            // Format Rupiah
            const formattedTotal = total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
            totalBayarInput.value = formattedTotal;
        };
        
        // D. Listener untuk Perubahan (Buku atau Jumlah)
        bukuPesanSelect.addEventListener('change', updatePriceAndStock);
        jumlahInput.addEventListener('input', updatePriceAndStock);
        
        // Panggil pertama kali untuk inisialisasi
        updatePriceAndStock();


        // E. Logic Submit Pemesanan
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectedBookCode = bukuPesanSelect.value;
            const jumlahPesan = parseInt(jumlahInput.value);
            const totalBayarDisplay = totalBayarInput.value;
            const selectedBook = dataKatalogBuku.find(b => b.kodeBarang === selectedBookCode);
            
            // Validasi Akhir
            if (!selectedBookCode || jumlahPesan <= 0 || !selectedBook) {
                alert("Mohon lengkapi detail pesanan.");
                return;
            }
            if (jumlahPesan > selectedBook.stok) {
                 alert(`Pemesanan Gagal: Jumlah melebihi stok yang tersedia (${selectedBook.stok}).`);
                 return;
            }

            // 1. Buat Objek Transaksi Baru
            const newTransaction = {
                nomorFaktur: generateNewInvoiceNumber(dataHistoryTransaksi), 
                tanggal: getTodayDate(),
                namaPelanggan: activeUser.nama,
                totalPembayaran: totalBayarDisplay, 
                status: "Menunggu Pembayaran",
                nomorDO: "-"
            };
            
            // 2. Tambahkan ke dataHistoryTransaksi (data.js)
            dataHistoryTransaksi.push(newTransaction);
            
            // 3. Kurangi Stok Buku (Simulasi)
            selectedBook.stok -= jumlahPesan;
            
            // 4. Update Tampilan Invoice di Halaman Checkout (Mengisi elemen di #invoiceDisplay)
            document.getElementById('invNumber').textContent = newTransaction.nomorFaktur;
            document.getElementById('invDate').textContent = newTransaction.tanggal;
            document.getElementById('invCustomer').textContent = activeUser.nama;
            document.getElementById('invItem').textContent = selectedBook.namaBarang;
            document.getElementById('invQuantity').textContent = `${jumlahPesan} Unit (Stok tersisa: ${selectedBook.stok})`;
            document.getElementById('invStatus').textContent = newTransaction.status;
            document.getElementById('invTotal').textContent = newTransaction.totalPembayaran;
            document.getElementById('invTotalP').textContent = newTransaction.totalPembayaran;

            // 5. Ubah Tampilan: Sembunyikan Form dan Tampilkan Invoice
            checkoutFormSection.style.display = 'none';
            invoiceDisplay.style.display = 'block'; 
            
            alert(`Pesanan ${newTransaction.nomorFaktur} berhasil dibuat!`);
        });
    }

}); // Tutup document.addEventListener