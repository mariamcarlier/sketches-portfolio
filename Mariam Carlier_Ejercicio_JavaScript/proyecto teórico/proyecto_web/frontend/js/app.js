const PAGES = {
  dashboard: renderDashboard,
  proyectos: renderProyectos,
  tareas:    renderTareas,
  bugs:      renderBugs,
  window:    renderWindow,
  pivot:     renderPivot,
  sprints:   renderSprints,
  usuarios:  renderUsuarios,
  auditoria: renderAuditoria,
  acciones:  renderAcciones,
};

let currentPage = 'dashboard';

function navigate(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const page = el.dataset.page;
  currentPage = page;
  const app = document.getElementById('app');
  app.innerHTML = `<div class="loading">Cargando</div>`;
  if (PAGES[page]) {
    PAGES[page](app).catch(err => {
      app.innerHTML = `<div class="panel"><div class="panel-body">
        <p style="color:var(--danger);font-weight:600">⚠ Error al cargar la página.</p>
        <p style="color:var(--text2);margin-top:8px">Asegúrate de que el backend Flask está corriendo:<br>
        <code style="background:var(--surface2);padding:4px 8px;border-radius:4px">python app.py</code></p>
      </div></div>`;
    });
  }
}

// Inicializar con dashboard
window.addEventListener('DOMContentLoaded', () => {
  const firstNav = document.querySelector('.nav-item[data-page="dashboard"]');
  if (firstNav) navigate(firstNav);
});
