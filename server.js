const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const tablePages = {
  accounts: { title: 'Akun', heading: 'Akun prop firm', description: 'Kelola akun dan status trading kamu.', button: '+ Tambah akun', editable: true, columns: ['No.', 'Prop firm', 'Account ID', 'Balance', 'Tanggal', 'Harga', 'Status'], rows: [['1', 'TOPSTEP', 'TS-001', '$50,000', '09/09/2026', '$59.50', 'ACTIVE'], ['2', 'FUNDED FUTURES FAMILY', 'FFF-001', '$25,000', '16/09/2026', '$58.05', 'FUNDED']] },
  payouts: { title: 'Payout', heading: 'Riwayat payout', description: 'Catat pengajuan dan payout yang diterima.', button: '+ Tambah payout', editable: false, columns: ['No.', 'Broker', 'Submission Date', 'Confirmation Date', 'Payout Total', 'Net Payout', 'Cycle'], rows: [['1', 'TOPSTEP', '20/08/2026', '20/08/2026', '$0.00', '$0.00', '0'], ['2', 'TOPSTEP', '19/09/2026', '24/08/2026', '$719.82', '$719.82', '1']] },
  expenses: { title: 'Pengeluaran', heading: 'Expense history', description: 'Biaya akun funded dan challenge.', button: '+ Tambah expense', editable: false, columns: ['No.', 'Prop Firm', 'Balance', 'Tanggal', 'Harga', 'Status'], rows: [['1', 'FUNDEDNEXT', '$50,000', '15/09/2026', '$69.99', 'FAILED'], ['2', 'TOPSTEP', '$50,000', '15/09/2026', '$59.50', 'EVAL']] }
};
app.get('/', (req, res) => res.render('dashboard'));
for (const menu of Object.keys(tablePages)) app.get(`/${menu}`, (req, res) => res.render('table-page', { ...tablePages[menu], active: menu }));
app.listen(port, () => console.log(`Jurnal Trade running on http://localhost:${port}`));
