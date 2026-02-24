const filterTabs = document.querySelectorAll('.filter-tab');
const transactionList = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');
const detailModal = document.getElementById('detailModal');
const btnClose = document.querySelector('.btn-close');
const modalOverlay = document.querySelector('.modal-overlay');

let currentFilter = 'all';
let transactions = [];

const serviceIcons = {
    'pulsa': '📱',
    'data': '📶',
    'pln': '⚡',
    'ewallet': '💳',
    'game': '🎮',
    'streaming': '🎬'
};

function loadTransactions() {
    transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    renderTransactions();
}

function renderTransactions() {
    transactionList.innerHTML = '';
    
    let visibleCount = 0;
    
    transactions.forEach((trx, index) => {
        if (currentFilter !== 'all' && trx.status !== currentFilter) {
            return;
        }
        
        visibleCount++;
        
        const icon = serviceIcons[trx.service] || '📦';
        const date = new Date(trx.date);
        const formattedDate = formatDate(date);
        
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.dataset.status = trx.status;
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="transaction-icon ${trx.status}">${icon}</div>
            <div class="transaction-info">
                <h4>${trx.product} - ${capitalizeService(trx.service)}</h4>
                <p class="transaction-detail">${trx.nominal} • ${trx.number}</p>
                <p class="transaction-date">${formattedDate}</p>
            </div>
            <div class="transaction-right">
                <p class="transaction-amount">${formatRupiah(trx.price)}</p>
                <span class="status-badge ${trx.status}">${getStatusText(trx.status)}</span>
            </div>
        `;
        
        item.addEventListener('click', () => showDetail(trx));
        transactionList.appendChild(item);
    });
    
    if (visibleCount === 0) {
        emptyState.style.display = 'flex';
        transactionList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        transactionList.style.display = 'flex';
    }
}

function capitalizeService(service) {
    const names = {
        'pulsa': 'Pulsa',
        'data': 'Paket Data',
        'pln': 'Token PLN',
        'ewallet': 'E-Wallet',
        'game': 'Voucher Game',
        'streaming': 'Streaming'
    };
    return names[service] || service;
}

function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        currentFilter = tab.dataset.filter;
        renderTransactions();
    });
});

function showDetail(trx) {
    document.getElementById('detailId').textContent = trx.id;
    document.getElementById('detailProduct').textContent = `${trx.product} - ${capitalizeService(trx.service)}`;
    document.getElementById('detailNominal').textContent = trx.nominal;
    document.getElementById('detailNumber').textContent = trx.number;
    document.getElementById('detailTime').textContent = formatDate(new Date(trx.date));
    document.getElementById('detailMethod').textContent = trx.method;
    document.getElementById('detailTotal').textContent = formatRupiah(trx.price);
    
    const statusBadge = document.querySelector('#detailStatus .status-badge');
    statusBadge.className = 'status-badge ' + trx.status;
    statusBadge.textContent = getStatusText(trx.status);
    
    detailModal.style.display = 'block';
}

function getStatusText(status) {
    const statusMap = {
        'success': 'Berhasil',
        'pending': 'Pending',
        'failed': 'Gagal'
    };
    return statusMap[status] || 'Unknown';
}

btnClose.addEventListener('click', () => {
    detailModal.style.display = 'none';
});

modalOverlay.addEventListener('click', () => {
    detailModal.style.display = 'none';
});

document.querySelectorAll('.btn-action').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.textContent === 'Download Invoice') {
            alert('Invoice akan didownload');
        } else if (btn.textContent === 'Beli Lagi') {
            window.location.href = 'order.html';
        }
    });
});

const filterBtn = document.getElementById('filterBtn');
if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        const confirm = window.confirm('Hapus semua riwayat transaksi?');
        if (confirm) {
            localStorage.removeItem('transactions');
            transactions = [];
            renderTransactions();
        }
    });
}

loadTransactions();
