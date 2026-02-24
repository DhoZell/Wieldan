const products = {
    pulsa: {
        operators: ['Telkomsel', 'Indosat', 'XL', 'Tri', 'Axis', 'Smartfren'],
        nominals: [
            { value: 5000, label: 'Rp 5.000', desc: 'Pulsa reguler', price: 6000 },
            { value: 10000, label: 'Rp 10.000', desc: 'Pulsa reguler', price: 11000 },
            { value: 20000, label: 'Rp 20.000', desc: 'Pulsa reguler', price: 21000 },
            { value: 25000, label: 'Rp 25.000', desc: 'Pulsa reguler', price: 26000 },
            { value: 50000, label: 'Rp 50.000', desc: 'Pulsa reguler', price: 51000 },
            { value: 100000, label: 'Rp 100.000', desc: 'Pulsa reguler', price: 101000 }
        ]
    },
    data: {
        operators: ['Telkomsel', 'Indosat', 'XL', 'Tri', 'Axis'],
        nominals: [
            { value: '1GB', label: 'Rp 15.000', desc: '1GB / 7 Hari', price: 15000 },
            { value: '2GB', label: 'Rp 25.000', desc: '2GB / 14 Hari', price: 25000 },
            { value: '3GB', label: 'Rp 35.000', desc: '3GB / 30 Hari', price: 35000 },
            { value: '5GB', label: 'Rp 50.000', desc: '5GB / 30 Hari', price: 50000 },
            { value: '10GB', label: 'Rp 85.000', desc: '10GB / 30 Hari', price: 85000 },
            { value: '20GB', label: 'Rp 150.000', desc: '20GB / 30 Hari', price: 150000 }
        ]
    },
    pln: {
        operators: ['PLN Prabayar'],
        nominals: [
            { value: 20000, label: 'Rp 20.000', desc: 'Token PLN', price: 20500 },
            { value: 50000, label: 'Rp 50.000', desc: 'Token PLN', price: 50500 },
            { value: 100000, label: 'Rp 100.000', desc: 'Token PLN', price: 100500 },
            { value: 200000, label: 'Rp 200.000', desc: 'Token PLN', price: 200500 },
            { value: 500000, label: 'Rp 500.000', desc: 'Token PLN', price: 500500 },
            { value: 1000000, label: 'Rp 1.000.000', desc: 'Token PLN', price: 1000500 }
        ]
    },
    ewallet: {
        operators: ['DANA', 'OVO', 'GoPay', 'LinkAja', 'ShopeePay'],
        nominals: [
            { value: 10000, label: 'Rp 10.000', desc: 'Saldo e-wallet', price: 10500 },
            { value: 20000, label: 'Rp 20.000', desc: 'Saldo e-wallet', price: 20500 },
            { value: 50000, label: 'Rp 50.000', desc: 'Saldo e-wallet', price: 50500 },
            { value: 100000, label: 'Rp 100.000', desc: 'Saldo e-wallet', price: 100500 },
            { value: 200000, label: 'Rp 200.000', desc: 'Saldo e-wallet', price: 200500 },
            { value: 500000, label: 'Rp 500.000', desc: 'Saldo e-wallet', price: 500500 }
        ]
    },
    game: {
        operators: ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact', 'Valorant'],
        nominals: [
            { value: '86', label: 'Rp 20.000', desc: '86 Diamond', price: 20000 },
            { value: '172', label: 'Rp 40.000', desc: '172 Diamond', price: 40000 },
            { value: '257', label: 'Rp 60.000', desc: '257 Diamond', price: 60000 },
            { value: '344', label: 'Rp 80.000', desc: '344 Diamond', price: 80000 },
            { value: '429', label: 'Rp 100.000', desc: '429 Diamond', price: 100000 },
            { value: '1050', label: 'Rp 250.000', desc: '1050 Diamond', price: 250000 }
        ]
    },
    streaming: {
        operators: ['Netflix', 'Spotify', 'Disney+', 'YouTube Premium', 'Vidio'],
        nominals: [
            { value: '1', label: 'Rp 54.000', desc: '1 Bulan', price: 54000 },
            { value: '3', label: 'Rp 150.000', desc: '3 Bulan', price: 150000 },
            { value: '6', label: 'Rp 280.000', desc: '6 Bulan', price: 280000 },
            { value: '12', label: 'Rp 500.000', desc: '12 Bulan', price: 500000 }
        ]
    }
};

let currentService = 'pulsa';
let selectedNominal = null;
let selectedOperator = '';

document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        const category = item.dataset.category;
        if (category && products[category]) {
            window.location.href = 'order.html?service=' + category;
        }
    });
});

document.querySelectorAll('.btn-buy, .btn-promo').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'order.html';
    });
});

const tabs = document.querySelectorAll('.tab');
const operatorSelect = document.getElementById('operatorSelect');
const phoneNumber = document.getElementById('phoneNumber');
const nominalOptions = document.getElementById('nominalOptions');
const bottomBar = document.getElementById('bottomBar');
const bottomPrice = document.getElementById('bottomPrice');
const btnCheckout = document.getElementById('btnCheckout');
const modal = document.getElementById('paymentModal');
const btnClose = document.querySelector('.btn-close');
const modalOverlay = document.querySelector('.modal-overlay');

if (tabs.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    if (serviceParam && products[serviceParam]) {
        currentService = serviceParam;
        tabs.forEach(t => {
            t.classList.remove('active');
            if (t.dataset.tab === serviceParam) {
                t.classList.add('active');
            }
        });
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            currentService = tab.dataset.tab;
            selectedNominal = null;
            loadService();
        });
    });
    
    loadService();
}

function loadService() {
    const service = products[currentService];
    
    if (operatorSelect) {
        operatorSelect.innerHTML = '<option value="">Pilih provider</option>';
        service.operators.forEach(op => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            operatorSelect.appendChild(option);
        });
    }
    
    if (nominalOptions) {
        renderNominals();
    }
    
    if (bottomBar) {
        bottomBar.style.display = 'none';
    }
}

function renderNominals() {
    const service = products[currentService];
    nominalOptions.innerHTML = '';
    
    service.nominals.forEach(nominal => {
        const btn = document.createElement('div');
        btn.className = 'nominal-btn';
        btn.innerHTML = `
            <span class="price">${nominal.label}</span>
            <span class="desc">${nominal.desc}</span>
        `;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nominal-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedNominal = nominal;
            updateTotal();
        });
        
        nominalOptions.appendChild(btn);
    });
}

function updateTotal() {
    if (selectedNominal && bottomBar && bottomPrice) {
        bottomBar.style.display = 'flex';
        bottomPrice.textContent = formatRupiah(selectedNominal.price);
    }
}

function formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        if (operatorSelect) {
            selectedOperator = operatorSelect.value;
        }
        
        const number = phoneNumber ? phoneNumber.value : '';
        
        if (!selectedOperator) {
            alert('Pilih provider dulu ya');
            return;
        }
        
        if (!number) {
            alert('Isi nomor/ID dulu');
            return;
        }
        
        if (!selectedNominal) {
            alert('Pilih nominal dulu');
            return;
        }
        
        modal.style.display = 'block';
    });
}

if (btnClose) {
    btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

document.querySelectorAll('.payment-item').forEach(item => {
    item.addEventListener('click', () => {
        const method = item.dataset.method;
        processPayment(method);
    });
});

function processPayment(method) {
    modal.style.display = 'none';
    
    const methodNames = {
        'dana': 'DANA',
        'ovo': 'OVO',
        'gopay': 'GoPay',
        'qris': 'QRIS',
        'transfer': 'Transfer Bank',
        'whatsapp': 'WhatsApp'
    };
    
    const orderData = {
        id: generateTrxId(),
        service: currentService,
        product: selectedOperator,
        nominal: selectedNominal.desc,
        number: phoneNumber ? phoneNumber.value : '',
        price: selectedNominal.price,
        method: methodNames[method],
        date: new Date().toISOString(),
        status: 'success'
    };
    
    saveTransaction(orderData);
    
    if (method === 'whatsapp') {
        const message = `Halo, saya mau order:
        
Produk: ${selectedOperator} - ${selectedNominal.desc}
Nomor/ID: ${orderData.number}
Total: ${formatRupiah(orderData.price)}

Terima kasih!`;
        const whatsappUrl = `https://wa.me/+6283837383150?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        setTimeout(() => {
            showSuccess(methodNames[method]);
        }, 500);
        return;
    }
    
    if (method === 'dana') {
        const danaUrl = `https://link.dana.id/qr/merchant?amount=${orderData.price}&merchantId=TOPUP123&orderId=${orderData.id}`;
        window.location.href = danaUrl;
        return;
    }
    
    if (method === 'ovo') {
        const ovoUrl = `ovo://payment?amount=${orderData.price}&merchantId=TOPUP123&orderId=${orderData.id}`;
        window.location.href = ovoUrl;
        
        setTimeout(() => {
            const appNotInstalled = confirm('Aplikasi OVO tidak terdeteksi. Lanjut ke browser?');
            if (appNotInstalled) {
                window.location.href = `https://payment.ovo.id/payment?amount=${orderData.price}`;
            }
        }, 2000);
        return;
    }
    
    if (method === 'gopay') {
        const gopayUrl = `gojek://gopay/merchanttransfer?amount=${orderData.price}&merchantId=TOPUP123&orderId=${orderData.id}`;
        window.location.href = gopayUrl;
        
        setTimeout(() => {
            const appNotInstalled = confirm('Aplikasi Gojek tidak terdeteksi. Lanjut ke browser?');
            if (appNotInstalled) {
                window.location.href = `https://gopay.co.id/payment?amount=${orderData.price}`;
            }
        }, 2000);
        return;
    }
    
    if (method === 'qris') {
        showQRPayment('QRIS', orderData.price, orderData.id);
        return;
    }
    
    if (method === 'transfer') {
        showTransferPayment(orderData.price, orderData.id);
        return;
    }
}

function showQRPayment(method, amount, trxId) {
    const qrModal = document.createElement('div');
    qrModal.className = 'modal';
    qrModal.style.display = 'block';
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TOPUP-${trxId}-${amount}`;
    
    qrModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-bottom">
            <div class="modal-header">
                <h3>Bayar dengan ${method}</h3>
                <button class="btn-close-qr">&times;</button>
            </div>
            <div class="qr-content">
                <div class="qr-amount">
                    <span>Total Pembayaran</span>
                    <strong>${formatRupiah(amount)}</strong>
                </div>
                <div class="qr-code">
                    <img src="${qrUrl}" alt="QR Code">
                </div>
                <div class="qr-instructions">
                    <h4>Cara Bayar:</h4>
                    <p>1. Buka aplikasi mobile banking atau e-wallet</p>
                    <p>2. Pilih menu QRIS / Scan QR</p>
                    <p>3. Scan QR Code di atas</p>
                    <p>4. Konfirmasi pembayaran</p>
                </div>
                <div class="qr-timer">
                    <span>⏱️ Berlaku 15 menit</span>
                </div>
            </div>
            <button class="btn-qr-done">Saya Sudah Bayar</button>
        </div>
    `;
    
    document.body.appendChild(qrModal);
    
    qrModal.querySelector('.btn-close-qr').addEventListener('click', () => {
        qrModal.remove();
    });
    
    qrModal.querySelector('.modal-overlay').addEventListener('click', () => {
        qrModal.remove();
    });
    
    qrModal.querySelector('.btn-qr-done').addEventListener('click', () => {
        qrModal.remove();
        showSuccess(method);
    });
}

function showTransferPayment(amount, trxId) {
    const transferModal = document.createElement('div');
    transferModal.className = 'modal';
    transferModal.style.display = 'block';
    
    const banks = [
        { name: 'BCA', account: '1234567890', holder: 'TopUp Indonesia' },
        { name: 'Mandiri', account: '9876543210', holder: 'TopUp Indonesia' },
        { name: 'BRI', account: '5555666677', holder: 'TopUp Indonesia' }
    ];
    
    const selectedBank = banks[0];
    
    transferModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-bottom">
            <div class="modal-header">
                <h3>Transfer Bank</h3>
                <button class="btn-close-transfer">&times;</button>
            </div>
            <div class="transfer-content">
                <div class="transfer-amount">
                    <span>Total Transfer</span>
                    <strong>${formatRupiah(amount)}</strong>
                </div>
                <div class="transfer-info">
                    <div class="transfer-row">
                        <span>Bank</span>
                        <strong>${selectedBank.name}</strong>
                    </div>
                    <div class="transfer-row">
                        <span>Nomor Rekening</span>
                        <strong>${selectedBank.account}</strong>
                        <button class="btn-copy" onclick="navigator.clipboard.writeText('${selectedBank.account}'); alert('Nomor rekening disalin!')">📋</button>
                    </div>
                    <div class="transfer-row">
                        <span>Atas Nama</span>
                        <strong>${selectedBank.holder}</strong>
                    </div>
                    <div class="transfer-row">
                        <span>Kode Unik</span>
                        <strong>${trxId.slice(-4)}</strong>
                    </div>
                </div>
                <div class="transfer-note">
                    <p>Transfer tepat hingga 3 digit terakhir untuk verifikasi otomatis</p>
                </div>
            </div>
            <button class="btn-transfer-done">Saya Sudah Transfer</button>
        </div>
    `;
    
    document.body.appendChild(transferModal);
    
    transferModal.querySelector('.btn-close-transfer').addEventListener('click', () => {
        transferModal.remove();
    });
    
    transferModal.querySelector('.modal-overlay').addEventListener('click', () => {
        transferModal.remove();
    });
    
    transferModal.querySelector('.btn-transfer-done').addEventListener('click', () => {
        transferModal.remove();
        showSuccess('Transfer Bank');
    });
}

function generateTrxId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `TRX${year}${month}${day}${random}`;
}

function saveTransaction(data) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(data);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function showSuccess(method) {
    const successModal = document.createElement('div');
    successModal.className = 'modal';
    successModal.style.display = 'block';
    successModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="success-modal">
            <div class="success-icon">✅</div>
            <div class="success-title">Pembayaran Berhasil!</div>
            <div class="success-desc">
                ${selectedNominal.desc}<br>
                ${selectedOperator}<br>
                ${phoneNumber ? phoneNumber.value : ''}<br>
                <strong>${formatRupiah(selectedNominal.price)}</strong><br>
                Metode: ${method}<br><br>
                Produk akan dikirim dalam 1-5 menit
            </div>
            <button class="btn-done">Lihat Riwayat</button>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    successModal.querySelector('.btn-done').addEventListener('click', () => {
        window.location.href = 'history.html';
    });
    
    successModal.querySelector('.modal-overlay').addEventListener('click', () => {
        successModal.remove();
        resetForm();
    });
}

function resetForm() {
    if (phoneNumber) phoneNumber.value = '';
    if (operatorSelect) operatorSelect.value = '';
    selectedNominal = null;
    if (bottomBar) bottomBar.style.display = 'none';
    document.querySelectorAll('.nominal-btn').forEach(b => b.classList.remove('active'));
}

const contactBtn = document.querySelector('.btn-contact');
if (contactBtn) {
    contactBtn.addEventListener('click', () => {
        alert('Fitur kontak coming soon');
    });
}


