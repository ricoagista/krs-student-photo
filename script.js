const tahunInput = document.getElementById('tahun');
const nimInput = document.getElementById('nim');
const imgElement = document.getElementById('foto-mahasiswa');
const placeholder = document.getElementById('placeholder-text');
const statusMsg = document.getElementById('status-message');
const container = document.getElementById('container');
const loadingLayer = document.getElementById('loading-layer');
const downloadBtn = document.getElementById('download-btn');
const namaWrapper = document.getElementById('nama-wrapper');
const namaText = document.getElementById('nama-text');
const namaStatus = document.getElementById('nama-status');
let currentRequest = '';
let namaRequestId = 0;

function muatFoto() {
    const tahun = tahunInput.value.trim();
    const nim = nimInput.value.trim();

    if (!tahun || !nim) {
        tampilkanPesan('Harap isi Tahun dan NIM terlebih dahulu.', 'bg-amber-100/10 text-amber-200 border border-amber-500/30');
        return;
    }

    setLoading(true);
    imgElement.style.display = 'none';
    placeholder.innerText = 'Sedang memuat...';
    placeholder.style.display = 'block';
    container.style.borderStyle = 'dashed';
    resetDownload();
    setNamaLoading();
    namaRequestId += 1;
    fetchNama(nim, namaRequestId);

    const url = `https://krs.umm.ac.id/Poto/${tahun}/${nim}.JPG`;
    currentRequest = url;

    imgElement.onload = function() {
        if (imgElement.src !== currentRequest) return; // ignore stale loads
        placeholder.style.display = 'none';
        imgElement.style.display = 'block';
        container.style.borderStyle = 'solid';
        setLoading(false);
        enableDownload(url, `${nim}.jpg`);
        tampilkanPesan('Foto berhasil ditemukan.', 'bg-emerald-100/10 text-emerald-200 border border-emerald-500/30');
    };

    imgElement.onerror = function() {
        if (imgElement.src !== currentRequest) return; // ignore stale errors
        handleError();
    };

    imgElement.src = url;
}

function handleError() {
    imgElement.style.display = 'none';
    placeholder.innerText = 'Foto tidak ditemukan atau URL salah.';
    placeholder.style.display = 'block';
    container.style.borderStyle = 'dashed';
    setLoading(false);
    resetDownload();
    tampilkanPesan('Gagal memuat foto. Pastikan Tahun dan NIM benar.', 'bg-rose-100/10 text-rose-200 border border-rose-500/30');
}

function tampilkanPesan(text, classes) {
    statusMsg.innerText = text;
    statusMsg.className = `text-sm rounded-xl px-4 py-3 ${classes}`;
    statusMsg.classList.remove('hidden');
}

function setLoading(state) {
    loadingLayer.classList.toggle('hidden', !state);
}

function resetDownload() {
    downloadBtn.removeAttribute('href');
    downloadBtn.removeAttribute('download');
    downloadBtn.classList.add('cursor-not-allowed', 'opacity-50');
    downloadBtn.setAttribute('aria-disabled', 'true');
}

function enableDownload(url, filename) {
    downloadBtn.href = url;
    downloadBtn.download = filename;
    downloadBtn.classList.remove('cursor-not-allowed', 'opacity-50');
    downloadBtn.classList.add('hover:border-[var(--accent)]', 'hover:text-white');
    downloadBtn.setAttribute('aria-disabled', 'false');
}

function setNamaLoading() {
    namaWrapper.classList.remove('hidden');
    namaText.textContent = '';
    namaStatus.textContent = 'Memuat nama...';
    namaStatus.className = 'text-sm text-slate-300 mt-1';
}

function tampilkanNama(nama) {
    namaWrapper.classList.remove('hidden');
    namaText.textContent = nama;
    namaStatus.textContent = '';
    namaStatus.className = 'text-sm text-slate-300 mt-1';
}

function tampilkanNamaError(text) {
    namaWrapper.classList.remove('hidden');
    namaText.textContent = '';
    namaStatus.textContent = text;
    namaStatus.className = 'text-sm text-rose-200 mt-1';
}

// Ganti dengan URL Cloudflare Pages/Workers Anda yang baru
const PRIVATE_API_URL = 'https://api-mahasiswa-2024.ricoagista.workers.dev/api/cari';

async function fetchNama(nim, requestId) {
    setNamaLoading();
    
    try {
        let found = false;

        try {
            // 1. Coba ambil data dari API Private (Cloudflare)
            const response = await fetch(`${PRIVATE_API_URL}?nim=${encodeURIComponent(nim)}`);
            if (response.ok) {
                const result = await response.json();

                // Cek jika ada request baru yang masuk saat fetch sedang berjalan
                if (requestId !== namaRequestId) return;

                if (result.status === 'success') {
                    // Jika ketemu di data CSV (mahasiswa.json)
                    tampilkanNama(result.data.nama);
                    // Menampilkan jurusan di bawah nama
                    namaStatus.textContent = result.data.jurusan;
                    namaStatus.className = 'text-sm text-slate-300 mt-1';
                    found = true;
                }
            }
        } catch (apiErr) {
            console.warn('API Utama gagal, mencoba fallback:', apiErr);
        }

        if (!found) {
            // 2. Jika tidak ada di CSV atau API gagal, Fallback ke API mkwk.org
            const resFallback = await fetch(`https://mkwk.org/rekapan/zoom-gmeet/cek.php?nim=${encodeURIComponent(nim)}`, { cache: 'no-store' });
            const dataFallback = await resFallback.json();
            
            if (requestId !== namaRequestId) return;

            if (dataFallback?.status === 'ok' && dataFallback?.data?.nama) {
                tampilkanNama(dataFallback.data.nama.trim());
            } else {
                throw new Error('Data tidak ditemukan di semua sumber');
            }
        }
    } catch (err) {
        if (requestId !== namaRequestId) return;
        tampilkanNamaError('Nama tidak ditemukan.');
    }
}

[tahunInput, nimInput].forEach(el => {
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            muatFoto();
        }
    });
});

document.getElementById('tampil-btn').addEventListener('click', muatFoto);
