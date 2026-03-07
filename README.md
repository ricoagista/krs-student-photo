# 📸 KRS Student Photo Viewer

Halaman web statis untuk menampilkan foto mahasiswa UMM berdasar tahun angkatan dan NIM, dengan tombol unduh setelah foto berhasil dimuat.

---

## 🎯 Tujuan Repository
- Cek cepat foto KRS mahasiswa berbasis tahun dan NIM
- Mempermudah pengunduhan foto profil mahasiswa

---

## 📁 Struktur Repository

```
.
├── index.html   # Halaman utama
├── style.css    # Styling custom
├── script.js    # Logika fetch & download
└── README.md    # Dokumentasi
```

---

## 🚀 Fitur Utama
- Input angkatan & NIM, fetch langsung ke server KRS UMM
- Status feedback: loading, sukses, gagal
- Tombol unduh aktif otomatis setelah foto dimuat

---

## 🛠️ Cara Menjalankan (Lokal)
1) Clone repo
```bash
git clone https://github.com/ricoagista/krs-student-photo-viewer.git
cd krs-student-photo-viewer
```
2) Buka di browser
	- Klik file `index.html` 

---

## ⚠️ Catatan Penting
- Sumber data: `https://krs.umm.ac.id/Poto/<tahun>/<nim>.JPG`
- Jika foto tidak muncul, cek format tahun/NIM atau koneksi ke domain tersebut
- Murni client-side, tidak ada backend atau penyimpanan data

---

## 📝 Catatan Akhir
- Penggunaan alat ini harus dilakukan dengan bijak. Segala bentuk penyalahgunaan data atau pelanggaran privasi di luar tanggung jawab pengembang.

---

## 👤 Author
Rico Shandika Jovial Agista

- GitHub: https://github.com/ricoagista
- LinkedIn: https://www.linkedin.com/in/ricoshandikajovialagista/
- Email: ricoagista@gmail.com

---
© 2026 Rico Shandika Jovial Agista. All rights reserved.