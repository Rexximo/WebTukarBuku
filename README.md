# FestivalTukarBuku — Fullstack (Next.js + Express + MongoDB)

Platform komunitas untuk menukar buku fisik melalui admin. Frontend Next.js (App Router, TypeScript) dan backend REST API Express + MongoDB sesuai PRD.

## Struktur

- `src/` — frontend Next.js. Semua halaman memanggil API lewat proxy `/api` (lihat `next.config.ts`).
- `backend/` — REST API Express 5 + Mongoose 9 (JWT httpOnly cookie, bcrypt, Zod, Multer, expiry job).
- `legacy/` — HTML/CSS desain awal (referensi visual).
- `PRD.md` — spesifikasi produk.
- Halaman komunitas satu halaman: `/tentang` dengan bagian Tentang, Visi & Misi, Kegiatan, dan Galeri.
- Halaman pendaftaran anggota: `/keanggotaan`; formulir menyiapkan pesan WhatsApp dan tidak menyimpan data pendaftar di situs.
- Admin dapat menambahkan dokumentasi foto melalui menu **Kelola Galeri**; file disimpan di folder upload backend dan keterangannya di MongoDB.

## Menjalankan

Terminal 1 — backend (port 4000):

```bash
cd backend
npm install
npm run dev
```

Secara default backend memakai database in-memory dan otomatis mengisi data contoh
(`USE_MEMORY_DB=true`, `SEED_ON_START=true` di `backend/.env`).

Terminal 2 — frontend (port 3000):

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Akun demo (hasil seed)

| Peran | Nama pengguna | Kata sandi |
|---|---|---|
| Admin | `admin` | `admin12345` |
| Anggota | `amelia.putri` | `sementara123` |
| Anggota | `rizky.pratama` | `sementara123` |

## Menggunakan MongoDB Atlas

1. Isi `MONGODB_URI` di `backend/.env` dengan connection string Atlas.
2. Ubah `USE_MEMORY_DB=false` (biarkan `SEED_ON_START=false` setelah seed pertama).
3. Jalankan `npm run seed` sekali untuk mengisi data contoh.

Pastikan `JWT_SECRET` di `backend/.env` dan `.env.local` frontend sama.

## Perintah berguna

```bash
# frontend
npm run dev          # jalankan Next.js
npm run build        # build produksi
npm run typecheck    # cek TypeScript
npm run lint         # ESLint

# backend
cd backend
npm run dev          # jalankan API dengan watch
npm run seed         # isi ulang data contoh
npm run smoke        # uji end-to-end alur bisnis (in-memory DB)
npm run typecheck
```

## Endpoint API utama

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/change-password`
- `GET /api/books`, `GET /api/books/genres`, `GET /api/books/:id`, `POST/PATCH/DELETE /api/books/:id` (admin)
- `GET/POST/PATCH /api/users`, `POST /api/users/:id/reset-password` (admin)
- `POST /api/swap-requests`, `GET /api/swap-requests/mine`, `POST /api/swap-requests/:id/cancel` (anggota)
- `GET /api/swap-requests`, `POST /api/swap-requests/:id/approve|reject` (admin)
- `GET /api/admin/stats` (admin)
- `GET /api/gallery` (publik), `POST /api/gallery`, `DELETE /api/gallery/:id` (admin)
- `/uploads/*` — file sampul hasil unggahan
