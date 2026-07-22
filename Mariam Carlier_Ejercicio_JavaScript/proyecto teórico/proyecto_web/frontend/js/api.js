const API = 'http://127.0.0.1:5000/api';

async function apiFetch(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error('Error ' + r.status);
  return r.json();
}

async function apiPost(path, body) {
  const r = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('Error ' + r.status);
  return r.json();
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  setTimeout(() => { t.className = 'toast hidden'; }, 3500);
}

function severityBadge(s) {
  const map = { critica: 'badge-red', alta: 'badge-orange', media: 'badge-yellow', baja: 'badge-blue' };
  return `<span class="badge ${map[s] || 'badge-gray'}">${s}</span>`;
}

function statusBadge(e) {
  const map = {
    completada:  'badge-green',
    en_progreso: 'badge-blue',
    backlog:     'badge-gray',
    abierto:     'badge-orange',
    resuelto:    'badge-green',
    cerrado:     'badge-purple',
    en_revision: 'badge-yellow',
    activo:      'badge-green',
    pausado:     'badge-yellow',
    finalizado:  'badge-purple',
  };
  return `<span class="badge ${map[e] || 'badge-gray'}">${e.replace('_',' ')}</span>`;
}

function prioridadBadge(p) {
  const map = { critica: 'badge-red', alta: 'badge-orange', media: 'badge-yellow', baja: 'badge-blue' };
  return `<span class="badge ${map[p] || 'badge-gray'}">${p}</span>`;
}

function progressBar(pct, color = '#6c63ff') {
  return `<div class="progress-wrap">
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
    <span class="progress-pct">${pct}%</span>
  </div>`;
}

function effClass(e) {
  return e >= 90 ? 'eff-good' : e >= 75 ? 'eff-warn' : 'eff-danger';
}

function sqlHighlight(sql) {
  const kw = ['SELECT','FROM','WHERE','JOIN','LEFT','INNER','ON','GROUP BY','ORDER BY',
               'PARTITION BY','OVER','WITH','RECURSIVE','UNION ALL','CASE','WHEN','THEN',
               'ELSE','END','AND','OR','NOT','AS','BY','DENSE_RANK','RANK','ROW_NUMBER',
               'LEAD','LAG','DATEDIFF','COUNT','SUM','ROUND','COALESCE','NULLIF','IN',
               'NULL','IS','DESC','ASC','HAVING','LIMIT','COMMIT','ROLLBACK','START',
               'TRANSACTION','SAVEPOINT','CREATE','PROCEDURE','FUNCTION','GRANT','REVOKE'];
  let h = sql;
  kw.forEach(k => {
    h = h.replace(new RegExp('\\b' + k + '\\b', 'gi'),
        m => `<span class="sql-kw">${m}</span>`);
  });
  h = h.replace(/'([^']*)'/g, `<span class="sql-str">'$1'</span>`);
  h = h.replace(/--[^\n]*/g, m => `<span class="sql-cm">${m}</span>`);
  return h;
}
