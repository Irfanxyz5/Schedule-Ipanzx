# 📚 StudyTrack — Pencatatan PR & Jadwal Belajar

Website pencatatan PR dan jadwal belajar yang elegan untuk siswa SMA.

## ✨ Fitur

- **🏠 Beranda** — Dashboard overview dengan statistik dan quick access
- **📚 Pencatatan PR** — CRUD lengkap dengan foto lightbox, deadline tracker, dan auto-pencapaian
- **📅 Jadwal Belajar** — View mingguan & harian, CRUD per hari, progress tracker
- **🏆 Pencapaian** — Sistem level & poin, auto-generate dari PR/Jadwal, timeline bulanan

## 🛠 Tech Stack

- **Next.js 14** — React framework
- **Tailwind CSS 3** — Utility-first CSS
- **Google Fonts** — Cormorant Garamond + Outfit
- **localStorage** — Penyimpanan data lokal (tanpa backend)

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Jalankan development server

```bash
npm run dev
```

### 3. Buka di browser

```
http://localhost:3000
```

### 4. Build untuk production

```bash
npm run build
npm start
```

## 📁 Struktur Folder

```
studytrack/
├── components/
│   └── Layout.js          # Navbar + Layout wrapper
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js           # Halaman Beranda
│   ├── pencatatan.js      # Pencatatan PR
│   ├── jadwal.js          # Jadwal Belajar
│   └── pencapaian.js      # Pencapaian
├── styles/
│   └── globals.css        # Global styles + animations
├── tailwind.config.js
├── next.config.js
└── package.json
```

## 🎨 Desain

- **Tema**: Academic Noir (dark elegant)
- **Font**: Cormorant Garamond (display) + Outfit (body)
- **Warna**: Deep navy (#06091A) + Gold accent (#E8B86D)
- **Animasi**: CSS keyframe animations + Tailwind transitions

## 📱 Responsive

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

---

*Dibuat dengan ❤️ untuk Siswa SMA Indonesia*
