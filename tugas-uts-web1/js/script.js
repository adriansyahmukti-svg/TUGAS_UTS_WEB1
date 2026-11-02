// Dynamic Greeting for Dashboard
function setGreeting() {
    const greetingEl = document.getElementById('greetingText');
    if (!greetingEl) return;
    
    const hour = new Date().getHours();
    let greeting = 'Selamat Pagi';
    if (hour >= 11 && hour < 15) {
        greeting = 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
        greeting = 'Selamat Sore';
    } else if (hour >= 18 || hour < 4) {
        greeting = 'Selamat Malam';
    }
    
    const user = JSON.parse(sessionStorage.getItem('currentUser')) || { nama: 'Pengunjung' };
    greetingEl.innerText = `${greeting}, ${user.nama}! Selamat datang di Toko Buku UT.`;
}

// Modal Toggle Helpers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    setGreeting();

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            const foundUser = dataPengguna.find(u => u.email === email && u.password === password);
            if (foundUser) {
                sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
                alert('Login Berhasil! Selamat datang ' + foundUser.nama);
                window.location.href = 'dashboard.html';
            } else {
                alert('Email/password yang anda masukkan salah');
            }
        });
    }

    // Katalog Stok Render & Add
    const catalogTableBody = document.getElementById('catalogTableBody');
    if (catalogTableBody && typeof dataKatalogBuku !== 'undefined') {
        function renderCatalog() {
            catalogTableBody.innerHTML = '';
            dataKatalogBuku.forEach((buku, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${buku.kodeBarang}</td>
                    <td><img src="${buku.cover}" class="book-cover" alt="${buku.namaBarang}" onerror="this.src='https://via.placeholder.com/50x70?text=Buku'"></td>
                    <td><strong>${buku.namaBarang}</strong></td>
                    <td>${buku.jenisBarang}</td>
                    <td>${buku.edisi}</td>
                    <td>${buku.stok}</td>
                    <td>${buku.harga}</td>
                `;
                catalogTableBody.appendChild(tr);
            });
        }
        renderCatalog();

        const addStokForm = document.getElementById('addStokForm');
        if (addStokForm) {
            addStokForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newBook = {
                    kodeBarang: document.getElementById('kodeBarang').value.trim(),
                    namaBarang: document.getElementById('namaBarang').value.trim(),
                    jenisBarang: document.getElementById('jenisBarang').value.trim(),
                    edisi: document.getElementById('edisi').value.trim(),
                    stok: parseInt(document.getElementById('stok').value),
                    harga: 'Rp ' + parseInt(document.getElementById('harga').value).toLocaleString('id-ID'),
                    cover: 'img/pengantar_komunikasi.jpg'
                };
                dataKatalogBuku.push(newBook);
                renderCatalog();
                addStokForm.reset();
                closeModal('addModal');
                alert('Stok buku berhasil ditambahkan!');
            });
        }
    }

    // Tracking Handler
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm && typeof dataTracking !== 'undefined') {
        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const doNum = document.getElementById('nomorDO').value.trim();
            const resultDiv = document.getElementById('trackingResult');
            const data = dataTracking[doNum];

            if (data) {
                let progressWidth = '50%';
                let badgeClass = 'badge-info';
                if (data.status === 'Selesai') {
                    progressWidth = '100%';
                    badgeClass = 'badge-success';
                } else if (data.status === 'Dalam Perjalanan') {
                    progressWidth = '65%';
                    badgeClass = 'badge-warning';
                }

                let historyHtml = '<ul style="list-style: none; padding-left: 0;">';
                data.perjalanan.forEach(p => {
                    historyHtml += `<li style="margin-bottom: 10px; border-left: 2px solid #2a5298; padding-left: 10px;">
                        <small style="color:#666;">${p.waktu}</small><br>
                        ${p.keterangan}
                    </li>`;
                });
                historyHtml += '</ul>';

                resultDiv.innerHTML = `
                    <div class="card" style="margin-top: 20px;">
                        <h3>Hasil Pelacakan DO: ${data.nomorDO}</h3>
                        <p><strong>Nama Pemesan:</strong> ${data.nama}</p>
                        <p><strong>Status:</strong> <span class="badge ${badgeClass}">${data.status}</span></p>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${progressWidth}">${progressWidth}</div>
                        </div>
                        <hr style="margin: 15px 0;">
                        <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
                        <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
                        <p><strong>Jenis Paket:</strong> ${data.paket}</p>
                        <p><strong>Total Pembayaran:</strong> ${data.total}</p>
                        <h4 style="margin-top: 20px; margin-bottom: 10px;">Riwayat Perjalanan</h4>
                        ${historyHtml}
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<div class="card" style="margin-top: 20px; color: red;">Data DO tidak ditemukan. Coba gunakan: 20230012 atau 20230013</div>`;
            }
        });
    }

    // Checkout Form & Table Handler
    const checkoutTableBody = document.getElementById('checkoutTableBody');
    if (checkoutTableBody && typeof dataKatalogBuku !== 'undefined') {
        let orderItems = [
            { kode: dataKatalogBuku[0].kodeBarang, nama: dataKatalogBuku[0].namaBarang, harga: 180000, qty: 1 },
            { kode: dataKatalogBuku[1].kodeBarang, nama: dataKatalogBuku[1].namaBarang, harga: 220000, qty: 2 }
        ];

        function renderCheckout() {
            checkoutTableBody.innerHTML = '';
            let totalSemua = 0;
            orderItems.forEach((item, index) => {
                const subtotal = item.harga * item.qty;
                totalSemua += subtotal;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.nama}</td>
                    <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                    <td>
                        <input type="number" min="1" value="${item.qty}" onchange="updateQty(${index}, this.value)" style="width: 60px; padding: 5px;">
                    </td>
                    <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
                    <td>
                        <button onclick="removeItem(${index})" class="btn btn-danger" style="padding: 4px 8px; font-size: 0.8rem;">Hapus</button>
                    </td>
                `;
                checkoutTableBody.appendChild(tr);
            });
            document.getElementById('totalBelanja').innerText = 'Rp ' + totalSemua.toLocaleString('id-ID');
        }

        window.updateQty = function(index, value) {
            orderItems[index].qty = parseInt(value) || 1;
            renderCheckout();
        };

        window.removeItem = function(index) {
            orderItems.splice(index, 1);
            renderCheckout();
        };

        renderCheckout();

        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (orderItems.length === 0) {
                    alert('Keranjang pesanan masih kosong!');
                    return;
                }
                alert('Pesanan berhasil dibuat! Nomor Tracking DO anda: 20230014');
                window.location.href = 'tracking.html';
            });
        }
    }
});
