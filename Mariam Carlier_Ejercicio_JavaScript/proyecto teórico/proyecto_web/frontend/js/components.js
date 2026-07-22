function loadingHTML() {
  return `<div class="loading">Cargando datos</div>`;
}

function emptyHTML(msg = 'Sin resultados') {
  return `<div class="empty">${msg}</div>`;
}

function panelHTML(title, subtitle, body, headerExtra = '') {
  return `<div class="panel">
    <div class="panel-header">
      <div>
        <div class="panel-title">${title}</div>
        ${subtitle ? `<div class="panel-subtitle">${subtitle}</div>` : ''}
      </div>
      ${headerExtra}
    </div>
    <div class="panel-body">${body}</div>
  </div>`;
}

function sqlPanel(title, sql) {
  return panelHTML(
    title,
    'Consulta SQL ejecutada (simulada)',
    `<div class="sql-block">${sqlHighlight(sql)}</div>`
  );
}

function statCard(label, value, sub, variant = '') {
  return `<div class="stat-card ${variant}">
    <div class="label">${label}</div>
    <div class="value">${value}</div>
    ${sub ? `<div class="sub">${sub}</div>` : ''}
  </div>`;
}
