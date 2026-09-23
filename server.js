const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const pages = {
  accounts: {
    title: 'Akun', heading: 'Akun prop firm', description: 'Kelola akun dan status trading kamu.', button: '+ Tambah akun',
    columns: ['Prop firm', 'Account ID', 'Balance', 'Tanggal', 'Harga', 'Status'],
    query: 'SELECT id, prop_firm, account_id, balance, trade_date, price, status FROM accounts ORDER BY id'
  },
  payouts: {
    title: 'Payout', heading: 'Riwayat payout', description: 'Catat pengajuan dan payout yang diterima.', button: '+ Tambah payout',
    columns: ['Broker', 'Submission Date', 'Confirmation Date', 'Payout Total', 'Net Payout', 'Cycle'],
    query: 'SELECT id, broker, submission_date, confirmation_date, payout_total, net_payout, cycle FROM payouts ORDER BY id'
  },
  expenses: {
    title: 'Pengeluaran', heading: 'Expense history', description: 'Biaya akun funded dan challenge.', button: '+ Tambah expense',
    columns: ['Prop Firm', 'Balance', 'Tanggal', 'Harga', 'Status'],
    query: 'SELECT id, prop_firm, balance, expense_date, price, status FROM expenses ORDER BY id'
  }
};

app.get('/', async (req, res, next) => {
  try {
    const [accounts, payouts, expenses, summary, events] = await Promise.all([
      pool.query('SELECT id, prop_firm, account_id, balance, trade_date, price, status FROM accounts ORDER BY id'),
      pool.query('SELECT id, broker, submission_date, confirmation_date, payout_total, net_payout, cycle FROM payouts ORDER BY id'),
      pool.query('SELECT id, firm AS prop_firm, description, quantity, unit_price AS price, quantity * unit_price AS total, expense_date, category FROM expense_details ORDER BY id'),
      pool.query('SELECT starting_capital, target_capital FROM journal_summary ORDER BY journal_date DESC LIMIT 1'),
      pool.query('SELECT firm, event_type, SUM(quantity)::int AS quantity FROM account_events GROUP BY firm, event_type ORDER BY firm, event_type')
    ]);
    const total = (rows, key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
    const counts = events.rows.reduce((result, row) => { result[row.event_type] = (result[row.event_type] || 0) + row.quantity; return result; }, {});
    res.render('dashboard', {
      accounts: accounts.rows,
      payouts: payouts.rows,
      expenses: expenses.rows,
      summary: summary.rows[0] || { starting_capital: 0, target_capital: 0 },
      events: counts,
      totals: { payout: total(payouts.rows, 'net_payout'), expense: total(expenses.rows, 'total') }
    });
  } catch (error) { next(error); }
});

for (const [menu, page] of Object.entries(pages)) {
  app.get(`/${menu}`, async (req, res, next) => {
    try {
      const { rows } = await pool.query(page.query);
      res.render('table-page', { ...page, active: menu, rows });
    } catch (error) { next(error); }
  });
}

app.post('/accounts', async (req, res, next) => {
  try {
    const { prop_firm, account_id, balance, trade_date, price, status } = req.body;
    await pool.query('INSERT INTO accounts (prop_firm, account_id, balance, trade_date, price, status) VALUES ($1,$2,$3,$4,$5,$6)', [prop_firm, account_id, balance, trade_date, price, status]);
    res.redirect('/accounts');
  } catch (error) { next(error); }
});

app.post('/payouts', async (req, res, next) => {
  try {
    const { broker, submission_date, confirmation_date, payout_total, net_payout, cycle } = req.body;
    await pool.query('INSERT INTO payouts (broker, submission_date, confirmation_date, payout_total, net_payout, cycle) VALUES ($1,$2,$3,$4,$5,$6)', [broker, submission_date, confirmation_date || null, payout_total, net_payout, cycle]);
    res.redirect('/payouts');
  } catch (error) { next(error); }
});

app.post('/expenses', async (req, res, next) => {
  try {
    const { prop_firm, balance, expense_date, price, status } = req.body;
    await pool.query('INSERT INTO expenses (prop_firm, balance, expense_date, price, status) VALUES ($1,$2,$3,$4,$5)', [prop_firm, balance, expense_date, price, status]);
    res.redirect('/expenses');
  } catch (error) { next(error); }
});

const editQueries = {
  accounts: {
    update: 'UPDATE accounts SET prop_firm=$1, account_id=$2, balance=$3, trade_date=$4, price=$5, status=$6 WHERE id=$7',
    remove: 'DELETE FROM accounts WHERE id=$1'
  },
  payouts: {
    update: 'UPDATE payouts SET broker=$1, submission_date=$2, confirmation_date=$3, payout_total=$4, net_payout=$5, cycle=$6 WHERE id=$7',
    remove: 'DELETE FROM payouts WHERE id=$1'
  },
  expenses: {
    update: 'UPDATE expenses SET prop_firm=$1, balance=$2, expense_date=$3, price=$4, status=$5 WHERE id=$6',
    remove: 'DELETE FROM expenses WHERE id=$1'
  }
};

app.post('/:menu/:id/edit', async (req, res, next) => {
  try {
    const query = editQueries[req.params.menu];
    if (!query) return res.sendStatus(404);
    const values = req.params.menu === 'accounts'
      ? [req.body.prop_firm, req.body.account_id, req.body.balance, req.body.trade_date, req.body.price, req.body.status, req.params.id]
      : req.params.menu === 'payouts'
        ? [req.body.broker, req.body.submission_date, req.body.confirmation_date || null, req.body.payout_total, req.body.net_payout, req.body.cycle, req.params.id]
        : [req.body.prop_firm, req.body.balance, req.body.expense_date, req.body.price, req.body.status, req.params.id];
    await pool.query(query.update, values);
    res.redirect(`/${req.params.menu}`);
  } catch (error) { next(error); }
});

app.post('/:menu/:id/delete', async (req, res, next) => {
  try {
    const query = editQueries[req.params.menu];
    if (!query) return res.sendStatus(404);
    await pool.query(query.remove, [req.params.id]);
    res.redirect(`/${req.params.menu}`);
  } catch (error) { next(error); }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Database error');
});

app.listen(port, () => console.log(`Jurnal Trade running on http://localhost:${port}`));
