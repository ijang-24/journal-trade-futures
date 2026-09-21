# PRD — Jurnal Trading Prop Firm Futures

## 1. Ringkasan

Aplikasi web pribadi untuk mencatat akun prop firm, biaya, payout, dan performa finansial trading futures. Tampilan utama berupa tabel editable seperti spreadsheet agar input data cepat dan familiar.

## 2. Tujuan

- Menggantikan jurnal Google Sheets dengan aplikasi mandiri.
- Menyimpan seluruh data secara terstruktur di Supabase.
- Menampilkan total payout, pengeluaran, net profit, dan ROI otomatis.
- Menyediakan pengalaman input seperti Excel tanpa fitur spreadsheet yang berlebihan.
- Bisa dijalankan pada VM/LXC di Proxmox.

## 3. Pengguna

Satu pengguna: pemilik aplikasi.

Akses dilindungi login email dan password. Registrasi publik tidak tersedia.

## 4. Ruang Lingkup MVP

### 4.1 Dashboard

Menampilkan kartu ringkasan:

- Total akun
- Akun aktif
- Total payout
- Total pengeluaran
- Net profit
- ROI

Rumus:

- `Net Profit = Total Payout - Total Pengeluaran`
- `ROI = (Net Profit / Total Pengeluaran) × 100%`

Dashboard juga menampilkan tabel ringkasan per prop firm:

| Prop Firm | Jumlah Payout | Total Payout | Total Pengeluaran | Net Profit |
|---|---:|---:|---:|---:|

### 4.2 Akun Prop Firm

Tabel akun dengan kolom:

| Kolom | Tipe |
|---|---|
| Prop Firm | Teks |
| Account ID | Teks |
| Balance | Mata uang |
| Tanggal Pembelian | Tanggal |
| Harga | Mata uang |
| Status | Pilihan |
| Catatan | Teks |

Pilihan status:

- `EVAL`
- `FUNDED`
- `ACTIVE`
- `FAILED`
- `BLOWN`
- `PASSED`

Fitur:

- Tambah baris
- Edit langsung di sel
- Hapus baris dengan konfirmasi
- Urutkan berdasarkan kolom
- Filter prop firm dan status
- Pencarian

### 4.3 Payout

Tabel payout dengan kolom:

| Kolom | Tipe |
|---|---|
| Prop Firm | Pilihan dari data akun |
| Account ID | Pilihan dari data akun |
| Jumlah Kotor | Mata uang |
| Biaya | Mata uang |
| Jumlah Bersih | Terhitung otomatis |
| Tanggal Pengajuan | Tanggal |
| Tanggal Konfirmasi | Tanggal, opsional |
| Siklus Payout | Angka |
| Status | Pilihan |
| Sertifikat | URL, opsional |
| Catatan | Teks |

Pilihan status:

- `SUBMITTED`
- `PROCESSING`
- `PAID`
- `REJECTED`

Rumus:

- `Jumlah Bersih = Jumlah Kotor - Biaya`

### 4.4 Pengeluaran

Tabel pengeluaran dengan kolom:

| Kolom | Tipe |
|---|---|
| Prop Firm | Pilihan |
| Account ID | Opsional |
| Tanggal | Tanggal |
| Jumlah | Mata uang |
| Jenis Transaksi | Pilihan |
| Catatan | Teks |

Pilihan jenis transaksi:

- `CHALLENGE`
- `ACTIVATION`
- `RESET`
- `DATA_FEE`
- `OTHER`

### 4.5 Pengaturan

- Mata uang utama, default `USD`
- Zona waktu, default `Asia/Jakarta`
- Ganti password
- Logout

## 5. Navigasi

Sidebar sederhana:

1. Dashboard
2. Akun
3. Payout
4. Pengeluaran
5. Pengaturan
6. Logout

Pada layar kecil, sidebar menjadi menu yang dapat dibuka dan ditutup.

## 6. Tampilan dan Interaksi

- Gaya visual bersih, padat, dan fokus pada data.
- Tabel menyerupai Excel: header tetap, garis grid, nomor baris, dan sel aktif.
- Klik dua kali atau tekan `Enter` untuk mengedit sel.
- `Tab` berpindah ke sel berikutnya.
- `Escape` membatalkan perubahan.
- Tombol `Tambah Baris` tersedia di atas tabel.
- Perubahan disimpan setelah nilai valid dan fokus meninggalkan sel.
- Status ditampilkan sebagai badge berwarna.
- Nilai positif hijau, negatif merah.
- Header tabel tetap terlihat saat halaman digulir.
- Tabel dapat digulir horizontal pada layar kecil.
- Tidak mendukung formula bebas, drag-fill, multi-sheet, atau kolaborasi realtime pada MVP.

## 7. Validasi

- Nilai uang tidak boleh negatif kecuali nilai hasil perhitungan.
- Tanggal konfirmasi tidak boleh sebelum tanggal pengajuan.
- Prop firm wajib diisi.
- Payout dan pengeluaran harus terkait dengan prop firm yang valid.
- URL sertifikat harus memakai `http` atau `https`.
- Semua data hanya dapat diakses pengguna yang login.

## 8. Struktur Data Supabase

### `profiles`

- `id` UUID, primary key, terhubung ke `auth.users`
- `currency` text, default `USD`
- `timezone` text, default `Asia/Jakarta`
- `created_at` timestamptz

### `accounts`

- `id` UUID, primary key
- `user_id` UUID, foreign key
- `prop_firm` text
- `account_code` text
- `balance` numeric
- `purchase_date` date
- `price` numeric
- `status` text
- `notes` text, nullable
- `created_at` timestamptz
- `updated_at` timestamptz

### `payouts`

- `id` UUID, primary key
- `user_id` UUID, foreign key
- `account_id` UUID, nullable foreign key
- `prop_firm` text
- `gross_amount` numeric
- `fee_amount` numeric, default `0`
- `submission_date` date
- `confirmation_date` date, nullable
- `payout_cycle` integer, nullable
- `status` text
- `certificate_url` text, nullable
- `notes` text, nullable
- `created_at` timestamptz
- `updated_at` timestamptz

### `expenses`

- `id` UUID, primary key
- `user_id` UUID, foreign key
- `account_id` UUID, nullable foreign key
- `prop_firm` text
- `transaction_date` date
- `amount` numeric
- `transaction_type` text
- `notes` text, nullable
- `created_at` timestamptz
- `updated_at` timestamptz

Semua tabel memakai Row Level Security berdasarkan `auth.uid() = user_id`.

## 9. Teknologi

- Node.js
- Express
- EJS
- Supabase PostgreSQL dan Auth
- CSS dan JavaScript native untuk tabel editable
- Nginx sebagai reverse proxy
- systemd atau PM2 sebagai process manager
- VM/LXC Debian atau Ubuntu di Proxmox

## 10. Keamanan

- Login wajib untuk seluruh halaman aplikasi.
- Supabase service role key hanya disimpan di server melalui environment variable.
- Cookie sesi memakai `HttpOnly`, `Secure`, dan `SameSite=Lax` pada production.
- Row Level Security aktif pada seluruh tabel pengguna.
- Validasi dilakukan di server walaupun form sudah divalidasi di browser.
- Rate limit diterapkan pada endpoint login.
- Registrasi publik dinonaktifkan.

## 11. Kriteria Penerimaan MVP

- Pengguna dapat login dan logout.
- Pengguna dapat menambah, melihat, mengubah, dan menghapus akun, payout, serta pengeluaran.
- Edit data dapat dilakukan langsung dari tabel.
- Dashboard menghitung total dan ROI dari data tersimpan.
- Filter, pencarian, dan pengurutan tabel berjalan.
- Data pengguna lain tidak dapat dibaca atau diubah.
- Tampilan dapat digunakan pada desktop dan ponsel.
- Aplikasi dapat dijalankan di Proxmox melalui Nginx dan HTTPS.

## 12. Di Luar MVP

- Integrasi broker otomatis
- Impor dan ekspor Excel/CSV
- Lampiran gambar selain URL sertifikat
- Grafik performa lanjutan
- Banyak pengguna dan pembagian peran
- Notifikasi payout
- Mode offline
