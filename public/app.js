const sidebar = document.querySelector('.sidebar');
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

const sections = { dashboard: [...document.querySelectorAll('.stats, #accounts, .payout-panel, .summary-panel, .expenses-panel')], accounts: [document.querySelector('#accounts')], payouts: [document.querySelector('.payout-panel')], expenses: [document.querySelector('.expenses-panel')] };
document.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); const view = event.currentTarget.dataset.view; Object.values(sections).flat().forEach(section => section && section.classList.add('hidden')); sections[view].forEach(section => section && section.classList.remove('hidden')); document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === event.currentTarget)); document.querySelector('h1').textContent = event.currentTarget.textContent; sidebar.classList.remove('open'); }));

const table = document.querySelector('#account-table tbody');
const filter = document.querySelector('#status-filter');
const search = document.querySelector('#search');
const firms = JSON.parse(localStorage.getItem('jurnal-trade-firms') || '[]');
const today = new Date().toISOString().slice(0, 10);

function input(type, value = '', list = '') { return `<input type="${type}" value="${value}"${list ? ` list="${list}"` : ''}>`; }
function firmField(value = '') { return input('text', value, 'prop-firms'); }
function actionCell() { return '<button class="save-row" type="button">Simpan</button><button class="delete" type="button" aria-label="Hapus">×</button>'; }
function rowMarkup() {
  const headers = [...document.querySelectorAll('#account-table thead th')].map(cell => cell.textContent.trim().toLowerCase());
  if (headers.includes('broker')) return `<td></td><td>${firmField()}</td><td>${input('date', today)}</td><td>${input('date', today)}</td><td>${input('number', '0')}</td><td>${input('number', '0')}</td><td>${input('number', '1')}</td><td><select><option>SUBMITTED</option><option>PROCESSING</option><option>PAID</option><option>REJECTED</option></select></td><td>${actionCell()}</td>`;
  if (headers.includes('balance')) return `<td></td><td>${firmField()}</td><td>${input('text', 'ID-000')}</td><td><select><option>25,000</option><option>50,000</option></select></td><td>${input('date', today)}</td><td>${input('number', '0')}</td><td><select><option>ACTIVE</option><option>EVAL</option><option>FUNDED</option><option>FAILED</option><option>BLOWN</option></select></td><td>${actionCell()}</td>`;
  return `<td></td><td>${firmField()}</td><td>${input('text', '25,000')}</td><td>${input('date', today)}</td><td>${input('number', '0')}</td><td><select><option>FAILED</option><option>EVAL</option></select></td><td>${actionCell()}</td>`;
}
function refresh() { if (!table) return; [...table.rows].forEach((row, i) => { row.cells[0].textContent = i + 1; const text = row.textContent.toLowerCase(); const statusSelect = [...row.querySelectorAll('select')].find(select => [...select.options].some(option => ['ACTIVE', 'EVAL', 'FUNDED', 'FAILED', 'BLOWN'].includes(option.value))); const status = statusSelect?.value || ''; row.hidden = Boolean((filter?.value && status !== filter.value) || (search?.value && !text.includes(search.value.toLowerCase()))); }); }
function rememberFirm(row) { const field = row.querySelector('input[list="prop-firms"]'); if (!field?.value.trim()) return; const name = field.value.trim().toUpperCase(); if (!firms.includes(name)) { firms.push(name); localStorage.setItem('jurnal-trade-firms', JSON.stringify(firms)); } field.value = name; }
function setupDatalist() { if (document.querySelector('#prop-firms')) return; const list = document.createElement('datalist'); list.id = 'prop-firms'; list.innerHTML = firms.map(firm => `<option value="${firm}">`).join(''); document.body.appendChild(list); }
setupDatalist();
if (filter) filter.addEventListener('change', refresh); if (search) search.addEventListener('input', refresh); if (table) table.addEventListener('change', refresh);
document.querySelectorAll('.edit-row').forEach(form => form.addEventListener('submit', event => { const row = form.closest('tr'); row.querySelectorAll('input[name], select[name]').forEach(field => { const hidden = document.createElement('input'); hidden.type = 'hidden'; hidden.name = field.name; hidden.value = field.value; form.appendChild(hidden); }); }));
if (table) table.addEventListener('click', event => { const row = event.target.closest('tr'); if (event.target.classList.contains('delete')) { row.remove(); refresh(); } if (event.target.classList.contains('save-row')) { rememberFirm(row); event.target.textContent = 'Tersimpan'; event.target.disabled = true; } });
const addRow = document.querySelector('#add-row');
if (addRow && table) addRow.addEventListener('click', () => { const row = document.createElement('tr'); row.innerHTML = rowMarkup(); table.appendChild(row); refresh(); row.querySelector('input')?.focus(); });
refresh();
