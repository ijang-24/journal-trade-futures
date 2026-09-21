const sidebar = document.querySelector('.sidebar');
document.querySelector('.menu-toggle').addEventListener('click', () => sidebar.classList.toggle('open'));
const sections = { dashboard: [...document.querySelectorAll('.stats, #accounts, .payout-panel, .summary-panel, .expenses-panel')], accounts: [document.querySelector('#accounts')], payouts: [document.querySelector('.payout-panel')], expenses: [document.querySelector('.expenses-panel')] };
document.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); const view = event.currentTarget.dataset.view; Object.values(sections).flat().forEach(section => section && section.classList.add('hidden')); sections[view].forEach(section => section && section.classList.remove('hidden')); document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === event.currentTarget)); document.querySelector('h1').textContent = event.currentTarget.textContent; sidebar.classList.remove('open'); }));
const table = document.querySelector('#account-table tbody');
const filter = document.querySelector('#status-filter');
const search = document.querySelector('#search');
if (!table) { refresh = () => {}; }
function refresh() { [...table.rows].forEach((row, i) => { row.cells[0].textContent = i + 1; const text = row.textContent.toLowerCase(); const status = row.querySelector('select').value; row.hidden = Boolean((filter.value && status !== filter.value) || (search.value && !text.includes(search.value.toLowerCase()))); }); }
if (filter) filter.addEventListener('change', refresh); if (search) search.addEventListener('input', refresh);
if (table) table.addEventListener('change', refresh);
if (table) table.addEventListener('click', event => { if (event.target.classList.contains('delete')) { event.target.closest('tr').remove(); refresh(); } });
const addRow = document.querySelector('#add-row');
if (addRow && table) addRow.addEventListener('click', () => { const row = document.createElement('tr'); row.innerHTML = '<td></td><td contenteditable="true">PROP FIRM</td><td contenteditable="true">ID-000</td><td contenteditable="true">$0</td><td contenteditable="true">20/09/2026</td><td contenteditable="true">$0</td><td><select><option>ACTIVE</option><option>EVAL</option><option>FUNDED</option><option>FAILED</option><option>BLOWN</option></select></td><td><button class="delete" aria-label="Hapus">×</button></td>'; table.appendChild(row); refresh(); row.cells[1].focus(); });
