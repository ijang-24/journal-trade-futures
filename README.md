# Jurnal Trade

> Trading journal untuk mencatat akun prop firm futures, payout, dan pengeluaran tanpa drama spreadsheet.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

## Tentang

Jurnal Trade adalah web app ringan untuk memantau aktivitas trading futures:

- Dashboard ringkasan performa
- Daftar akun prop firm
- Riwayat payout
- Riwayat pengeluaran
- Tampilan dark mode yang fokus pada data
- Layout responsif untuk desktop dan layar kecil

Project ini masih berada pada tahap MVP UI. Data contoh saat ini dirender dari server dan belum memakai database atau autentikasi.

## Tech stack

- Node.js
- Express 5
- EJS
- CSS native
- JavaScript native

## Mulai lokal

### Prasyarat

- Node.js 18 atau lebih baru
- npm

### Instalasi

```bash
git clone https://github.com/ijang-24/journal-trade-futures.git
cd journal-trade-futures
npm install
npm start
```

Buka `http://localhost:3000`.

## Development

Mode development memakai Node.js watch mode:

```bash
npm run dev
```

Cek aplikasi:

```bash
npm test
```

## Struktur project

```text
.
├── public/
│   ├── app.js
│   └── styles.css
├── views/
│   ├── dashboard.ejs
│   ├── table-page.ejs
│   └── partials/sidebar.ejs
├── server.js
├── package.json
└── PRD.md
```

## Route

| Route | Fungsi |
|---|---|
| `/` | Dashboard |
| `/accounts` | Daftar akun prop firm |
| `/payouts` | Riwayat payout |
| `/expenses` | Riwayat pengeluaran |

## Roadmap

- [ ] Simpan data dengan Supabase PostgreSQL
- [ ] Login dan session management
- [ ] CRUD akun, payout, dan pengeluaran
- [ ] Filter, search, dan sorting tabel
- [ ] Kalkulasi net profit dan ROI otomatis
- [ ] Deploy ke VM/LXC dengan Nginx

## Kontribusi

1. Fork repository
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan
4. Push branch
5. Buat pull request

## License

ISC
