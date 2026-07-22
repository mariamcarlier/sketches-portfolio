/* ══════════════════════════════════════════════════════════
   PAGES — cada función renderiza una vista completa
══════════════════════════════════════════════════════════ */

// ── DASHBOARD ──────────────────────────────────────────────
async function renderDashboard(el) {
  el.innerHTML = `<div class="page-header"><div class="page-title">Dashboard</div><div class="page-subtitle">Resumen ejecutivo del sistema de gestión</div></div>${loadingHTML()}`;
  const d = await apiFetch('/dashboard');
  const proyectos = await apiFetch('/proyectos');

  el.innerHTML = `
  <div class="page-header">
    <div class="page-title">Dashboard</div>
    <div class="page-subtitle">Resumen ejecutivo — Sistema de Gestión de Proyectos</div>
  </div>
  <div class="cards-grid">
    ${statCard('Proyectos activos', d.proyectos_activos + '/' + d.total_proyectos, 'Total proyectos', 'accent')}
    ${statCard('Tareas completadas', d.tareas_completadas, `${d.pct_avance}% del total`, 'green')}
    ${statCard('Bugs abiertos', d.bugs_abiertos, `${d.bugs_criticos} críticos`, d.bugs_criticos > 0 ? 'danger' : 'warn')}
    ${statCard('Eficiencia sprints', d.eficiencia_promedio + '%', 'Promedio real/estimado', d.eficiencia_promedio >= 90 ? 'green' : 'warn')}
    ${statCard('Usuarios activos', d.total_usuarios, 'Desarrolladores', 'info')}
  </div>

  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">Estado de Proyectos</div>
      <div class="panel-subtitle">Avance y bugs por proyecto</div>
    </div>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Proyecto</th><th>Estado</th><th>Avance</th><th>Tareas</th><th>Bugs abiertos</th><th>Sprints</th></tr></thead>
        <tbody>
          ${proyectos.map(p => `<tr>
            <td><strong>${p.nombre}</strong></td>
            <td>${statusBadge(p.estado)}</td>
            <td style="min-width:160px">${progressBar(p.pct_avance, p.pct_avance >= 80 ? '#4ade80' : p.pct_avance >= 50 ? '#f59e0b' : '#ef4444')}</td>
            <td>${p.tareas_completadas}/${p.total_tareas}</td>
            <td>${p.bugs_abiertos > 0 ? `<span style="color:var(--danger);font-weight:600">${p.bugs_abiertos}</span>` : `<span style="color:var(--accent2)">0</span>`}
                ${p.bugs_criticos > 0 ? `<span class="badge badge-red" style="margin-left:6px">⚡${p.bugs_criticos} críticos</span>` : ''}</td>
            <td>${p.total_sprints}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  ${sqlPanel('SQL ejecutado (Dashboard)',
    `-- Consulta del resumen ejecutivo\nSELECT p.nombre, p.estado,\n       COUNT(t.id_tarea) AS total_tareas,\n       SUM(CASE WHEN t.estado='completada' THEN 1 ELSE 0 END) AS completadas,\n       ROUND(SUM(CASE WHEN t.estado='completada' THEN 1 ELSE 0 END)\n             / NULLIF(COUNT(t.id_tarea),0)*100,1) AS pct_avance\nFROM proyectos p\nLEFT JOIN tareas t ON p.id_proyecto = t.id_proyecto\nGROUP BY p.id_proyecto, p.nombre, p.estado\nORDER BY p.id_proyecto;`
  )}
  `;
}

// ── PROYECTOS ─────────────────────────────────────────────
async function renderProyectos(el) {
  el.innerHTML = loadingHTML();
  const data = await apiFetch('/proyectos');
  el.innerHTML = `
  <div class="page-header"><div class="page-title">Proyectos</div><div class="page-subtitle">Gestión de proyectos activos</div></div>
  <div class="panel">
    <div class="panel-header"><div class="panel-title">Todos los proyectos</div></div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>#</th><th>Nombre</th><th>Estado</th><th>Inicio</th><th>Avance</th><th>Tareas</th><th>Bugs abiertos</th><th>Bugs críticos</th></tr></thead>
      <tbody>
        ${data.map(p => `<tr>
          <td>${p.id_proyecto}</td>
          <td><strong>${p.nombre}</strong></td>
          <td>${statusBadge(p.estado)}</td>
          <td>${p.fecha_inicio}</td>
          <td style="min-width:150px">${progressBar(p.pct_avance)}</td>
          <td>${p.tareas_completadas}/${p.total_tareas}</td>
          <td>${severityBadge(p.bugs_abiertos > 0 ? 'alta' : 'baja').replace(/alta|baja/g, p.bugs_abiertos)}</td>
          <td>${p.bugs_criticos > 0 ? severityBadge('critica').replace('critica', p.bugs_criticos + ' críticos') : '<span class="badge badge-green">0</span>'}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

// ── TAREAS ────────────────────────────────────────────────
async function renderTareas(el) {
  el.innerHTML = loadingHTML();
  const proyectos = await apiFetch('/proyectos');
  const data = await apiFetch('/tareas');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Tareas</div><div class="page-subtitle">Gestión de tareas del equipo</div></div>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">Listado de Tareas</div>
      <div class="filters">
        <select id="f-proy"><option value="">Todos los proyectos</option>
          ${proyectos.map(p => `<option value="${p.id_proyecto}">${p.nombre}</option>`).join('')}
        </select>
        <select id="f-estado"><option value="">Todos los estados</option>
          ${['completada','en_progreso','backlog','bloqueada'].map(e => `<option value="${e}">${e.replace('_',' ')}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="tareas-table" class="tbl-wrap"></div>
  </div>`;

  function renderTable(rows) {
    const tbody = rows.length ? rows.map(t => `<tr>
      <td>${t.id_tarea}</td>
      <td><strong>${t.titulo}</strong></td>
      <td>${t.proyecto}</td>
      <td>${statusBadge(t.estado)}</td>
      <td>${prioridadBadge(t.prioridad)}</td>
      <td>${t.story_points} SP</td>
      <td>${t.asignado_a}</td>
      <td>${t.fecha_creacion}</td>
      <td>${t.fecha_completada || '—'}</td>
    </tr>`).join('') : `<tr><td colspan="9">${emptyHTML()}</td></tr>`;

    document.getElementById('tareas-table').innerHTML = `<table>
      <thead><tr><th>#</th><th>Título</th><th>Proyecto</th><th>Estado</th><th>Prioridad</th><th>SP</th><th>Asignado a</th><th>Creada</th><th>Completada</th></tr></thead>
      <tbody>${tbody}</tbody></table>`;
  }

  renderTable(data);

  ['f-proy','f-estado'].forEach(id => {
    document.getElementById(id).addEventListener('change', async () => {
      const p = document.getElementById('f-proy').value;
      const e = document.getElementById('f-estado').value;
      const q = (p ? `?id_proyecto=${p}` : '') + (e ? (p ? '&' : '?') + `estado=${e}` : '');
      const fresh = await apiFetch('/tareas' + q);
      renderTable(fresh);
    });
  });
}

// ── BUGS ──────────────────────────────────────────────────
async function renderBugs(el) {
  el.innerHTML = loadingHTML();
  const proyectos = await apiFetch('/proyectos');
  const data = await apiFetch('/bugs');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Bugs</div><div class="page-subtitle">sp_buscar_bugs — filtros opcionales con Dynamic SQL</div></div>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">Buscador de Bugs</div>
      <div class="filters">
        <select id="f-sev"><option value="">Severidad</option>${['critica','alta','media','baja'].map(s=>`<option value="${s}">${s}</option>`).join('')}</select>
        <select id="f-est"><option value="">Estado</option>${['abierto','en_revision','resuelto','cerrado'].map(s=>`<option value="${s}">${s.replace('_',' ')}</option>`).join('')}</select>
        <select id="f-pro"><option value="">Proyecto</option>${proyectos.map(p=>`<option value="${p.id_proyecto}">${p.nombre}</option>`).join('')}</select>
        <button class="btn btn-primary btn-sm" onclick="filtrarBugs()">🔍 Buscar</button>
      </div>
    </div>
    <div id="bugs-table" class="tbl-wrap"></div>
  </div>
  ${sqlPanel('Dynamic SQL — sp_buscar_bugs',
    `CREATE PROCEDURE sp_buscar_bugs(\n    IN p_severidad   VARCHAR(20),\n    IN p_estado      VARCHAR(20),\n    IN p_id_proyecto INT\n)\nBEGIN\n    SET @sql = 'SELECT b.id_bug, b.titulo, b.severidad, b.estado,\n                p.nombre AS proyecto, u.nombre AS asignado_a\n                FROM bugs b\n                LEFT JOIN proyectos p ON b.id_proyecto = p.id_proyecto\n                LEFT JOIN usuarios  u ON b.id_asignado  = u.id_usuario\n                WHERE 1=1';\n\n    IF p_severidad IS NOT NULL THEN\n        SET @sql = CONCAT(@sql, ' AND b.severidad = ''', p_severidad, '''');\n    END IF;\n    -- ... más filtros opcionales ...\n\n    PREPARE stmt FROM @sql;\n    EXECUTE stmt;\n    DEALLOCATE PREPARE stmt;\nEND$$`
  )}`;

  window.filtrarBugs = async function() {
    const sev = document.getElementById('f-sev').value;
    const est = document.getElementById('f-est').value;
    const pro = document.getElementById('f-pro').value;
    let q = '?x=1';
    if (sev) q += `&severidad=${sev}`;
    if (est) q += `&estado=${est}`;
    if (pro) q += `&id_proyecto=${pro}`;
    const bugs = await apiFetch('/bugs' + q);
    renderBugsTable(bugs);
  };

  function renderBugsTable(rows) {
    const tbody = rows.length ? rows.map(b => `<tr>
      <td>${b.id_bug}</td>
      <td><strong>${b.titulo}</strong></td>
      <td>${severityBadge(b.severidad)}</td>
      <td>${statusBadge(b.estado)}</td>
      <td>${b.proyecto}</td>
      <td>${b.asignado_a}</td>
      <td>${b.reportado_por}</td>
      <td>${b.fecha_reporte}</td>
      <td>${b.fecha_resolucion || '—'}</td>
    </tr>`).join('') : `<tr><td colspan="9">${emptyHTML()}</td></tr>`;
    document.getElementById('bugs-table').innerHTML = `<table>
      <thead><tr><th>#</th><th>Título</th><th>Severidad</th><th>Estado</th><th>Proyecto</th><th>Asignado</th><th>Reportado por</th><th>Fecha</th><th>Resuelto</th></tr></thead>
      <tbody>${tbody}</tbody></table>`;
  }
  renderBugsTable(data);
}

// ── WINDOW FUNCTIONS ──────────────────────────────────────
async function renderWindow(el) {
  el.innerHTML = loadingHTML();
  const ranking = await apiFetch('/ranking/bugs');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Window Functions</div><div class="page-subtitle">DENSE_RANK · LEAD · ROW_NUMBER sobre la base de datos</div></div>

  <div class="panel">
    <div class="panel-header">
      <div><div class="panel-title">DENSE_RANK — Ranking de proyectos por bugs resueltos</div>
      <div class="panel-subtitle">Ejercicio 5.1 — proyectos con 0 bugs resueltos aparecen al final</div></div>
    </div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Ranking</th><th>Proyecto</th><th>Bugs resueltos</th><th>Barra</th></tr></thead>
      <tbody>
        ${ranking.map(r => {
          const rankClass = r.ranking === 1 ? 'rank-1' : r.ranking === 2 ? 'rank-2' : r.ranking === 3 ? 'rank-3' : '';
          const maxVal = Math.max(...ranking.map(x => x.bugs_resueltos), 1);
          return `<tr>
            <td><span class="${rankClass}">${r.ranking === 1 ? '🥇' : r.ranking === 2 ? '🥈' : r.ranking === 3 ? '🥉' : '#' + r.ranking}</span></td>
            <td><strong>${r.proyecto}</strong></td>
            <td>${r.bugs_resueltos}</td>
            <td style="min-width:150px">${progressBar(Math.round(r.bugs_resueltos / maxVal * 100), r.bugs_resueltos > 0 ? '#4ade80' : '#ef4444')}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  </div>

  ${sqlPanel('DENSE_RANK — SQL',
    `SELECT  p.nombre AS proyecto,\n        COUNT(b.id_bug) AS bugs_resueltos,\n        DENSE_RANK() OVER (\n            ORDER BY COUNT(b.id_bug) DESC\n        ) AS ranking\nFROM    proyectos p\nLEFT JOIN bugs b\n       ON p.id_proyecto = b.id_proyecto\n      AND b.estado IN ('resuelto', 'cerrado')\nGROUP BY p.id_proyecto, p.nombre\nORDER BY bugs_resueltos DESC;`
  )}

  <div style="margin-top:20px">
  ${sqlPanel('ROW_NUMBER — 2 bugs más recientes por proyecto (Ejercicio 5.3)',
    `SELECT *\nFROM (\n    SELECT  p.nombre AS proyecto,\n            b.titulo, b.severidad, b.fecha_reporte,\n            ROW_NUMBER() OVER (\n                PARTITION BY b.id_proyecto\n                ORDER BY     b.fecha_reporte DESC\n            ) AS rn\n    FROM    bugs b\n    JOIN    proyectos p ON b.id_proyecto = p.id_proyecto\n) ranked\nWHERE rn <= 2\nORDER BY proyecto, rn;`
  )}
  </div>

  <div style="margin-top:20px">
  ${sqlPanel('LEAD — Fechas de inicio de sprints consecutivos (Ejercicio 5.2)',
    `SELECT  p.nombre AS proyecto,\n        s.numero_sprint,\n        s.fecha_inicio,\n        LEAD(s.fecha_inicio) OVER (\n            PARTITION BY s.id_proyecto\n            ORDER BY     s.numero_sprint\n        ) AS fecha_inicio_siguiente,\n        DATEDIFF(\n            LEAD(s.fecha_inicio) OVER (\n                PARTITION BY s.id_proyecto\n                ORDER BY     s.numero_sprint\n            ), s.fecha_inicio\n        ) AS dias_entre_sprints\nFROM    sprints s\nJOIN    proyectos p ON s.id_proyecto = p.id_proyecto\nORDER BY p.nombre, s.numero_sprint;`
  )}
  </div>`;
}

// ── PIVOT / CTE ───────────────────────────────────────────
async function renderPivot(el) {
  el.innerHTML = loadingHTML();
  const pivot = await apiFetch('/pivot/tareas');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Pivot / CTE</div><div class="page-subtitle">Transformación de filas en columnas y expresiones de tabla comunes</div></div>

  <div class="panel">
    <div class="panel-header">
      <div><div class="panel-title">PIVOT — Tareas pendientes por desarrollador y prioridad</div>
      <div class="panel-subtitle">Ejercicio 7.1 — SUM(CASE WHEN prioridad = X THEN 1 ELSE 0 END)</div></div>
    </div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Desarrollador</th><th>Rol</th><th style="color:#38bdf8">Baja</th><th style="color:#f59e0b">Media</th><th style="color:#fb923c">Alta</th><th style="color:#ef4444">Crítica</th><th>Total</th></tr></thead>
      <tbody>
        ${pivot.map(r => `<tr>
          <td><strong>${r.desarrollador}</strong></td>
          <td><span class="badge badge-purple">${r.rol}</span></td>
          <td>${r.baja}</td>
          <td>${r.media}</td>
          <td>${r.alta}</td>
          <td>${r.critica > 0 ? `<strong style="color:var(--danger)">${r.critica}</strong>` : '0'}</td>
          <td><strong>${r.total}</strong></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>

  ${sqlPanel('PIVOT SQL — SUM(CASE WHEN ...)',
    `SELECT  u.nombre AS desarrollador,\n        SUM(CASE WHEN t.prioridad = 'baja'    THEN 1 ELSE 0 END) AS baja,\n        SUM(CASE WHEN t.prioridad = 'media'   THEN 1 ELSE 0 END) AS media,\n        SUM(CASE WHEN t.prioridad = 'alta'    THEN 1 ELSE 0 END) AS alta,\n        SUM(CASE WHEN t.prioridad = 'critica' THEN 1 ELSE 0 END) AS critica,\n        COUNT(t.id_tarea)                                         AS total_pendientes\nFROM    usuarios u\nLEFT JOIN tareas t\n       ON u.id_usuario = t.id_asignado\n      AND t.estado <> 'completada'\nWHERE   u.activo = TRUE\nGROUP BY u.id_usuario, u.nombre\nORDER BY critica DESC;`
  )}

  <div style="margin-top:20px">
  ${sqlPanel('CTE Múltiples — Reporte Tech Lead (Ejercicio 8.2)',
    `WITH\ntop_developers AS (\n    SELECT  id_asignado,\n            SUM(story_points) AS puntos_entregados,\n            COUNT(id_tarea)   AS tareas_completadas\n    FROM    tareas WHERE estado = 'completada'\n    GROUP BY id_asignado\n),\nbugs_pendientes AS (\n    SELECT  id_asignado, COUNT(id_bug) AS bugs_pendientes\n    FROM    bugs WHERE estado IN ('abierto', 'en_revision')\n    GROUP BY id_asignado\n)\nSELECT  u.nombre, r.nombre_rol AS rol,\n        COALESCE(td.puntos_entregados, 0) AS puntos,\n        COALESCE(bp.bugs_pendientes, 0)   AS bugs,\n        CASE\n            WHEN COALESCE(bp.bugs_pendientes,0) > 2  THEN 'Sobrecargado'\n            WHEN COALESCE(bp.bugs_pendientes,0) >= 1 THEN 'Normal'\n            ELSE 'Disponible'\n        END AS estado_carga\nFROM    usuarios u\nJOIN    roles r ON u.id_rol = r.id_rol\nLEFT JOIN top_developers td ON u.id_usuario = td.id_asignado\nLEFT JOIN bugs_pendientes bp ON u.id_usuario = bp.id_asignado\nORDER BY puntos DESC;`
  )}
  </div>

  <div style="margin-top:20px">
  ${sqlPanel('CTE Recursiva — Fibonacci y calendario sprints (Ejercicio 6.1)',
    `-- Serie Fibonacci:\nWITH RECURSIVE fibonacci AS (\n    SELECT 1 AS posicion, 0 AS actual, 1 AS siguiente\n    UNION ALL\n    SELECT posicion+1, siguiente, actual+siguiente\n    FROM fibonacci WHERE posicion < 8\n)\nSELECT posicion, actual AS valor FROM fibonacci;\n-- Resultado: 0,1,1,2,3,5,8,13\n\n-- Calendario de 4 sprints desde 2024-10-01:\nWITH RECURSIVE sprints_cal AS (\n    SELECT 1 AS num, DATE('2024-10-01') AS inicio\n    UNION ALL\n    SELECT num+1, DATE_ADD(inicio, INTERVAL 14 DAY)\n    FROM sprints_cal WHERE num < 4\n)\nSELECT num, inicio, DATE_ADD(inicio, INTERVAL 13 DAY) AS fin FROM sprints_cal;`
  )}
  </div>`;
}

// ── SPRINTS ───────────────────────────────────────────────
async function renderSprints(el) {
  el.innerHTML = loadingHTML();
  const data = await apiFetch('/sprints');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Sprints</div><div class="page-subtitle">Eficiencia por sprint — CTE resumen_sprints + LAG</div></div>
  <div class="panel">
    <div class="panel-header"><div class="panel-title">Todos los sprints con eficiencia</div><div class="panel-subtitle">Alerta roja = eficiencia &lt; 85% (Ejercicio 8.1)</div></div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Sprint</th><th>Proyecto</th><th>#</th><th>Estimado</th><th>Real</th><th>Eficiencia</th><th>Inicio</th><th>Fin</th></tr></thead>
      <tbody>
        ${data.map(s => `<tr>
          <td>${s.id_sprint}</td>
          <td>${s.proyecto}</td>
          <td>Sprint ${s.numero_sprint}</td>
          <td>${s.velocidad_estimada} pts</td>
          <td>${s.velocidad_real} pts</td>
          <td><span class="${effClass(s.eficiencia)}" style="font-weight:700">${s.eficiencia}%</span>
              ${s.alerta ? ' <span class="badge badge-red">⚠ bajo 85%</span>' : ''}</td>
          <td>${s.fecha_inicio}</td>
          <td>${s.fecha_fin}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>

  ${sqlPanel('CTE resumen_sprints — Ejercicio 8.1',
    `WITH resumen_sprints AS (\n    SELECT  id_sprint, id_proyecto, numero_sprint,\n            velocidad_estimada, velocidad_real,\n            ROUND((velocidad_real / NULLIF(velocidad_estimada,0))*100, 2) AS eficiencia\n    FROM    sprints\n)\nSELECT  p.nombre AS proyecto,\n        rs.numero_sprint, rs.velocidad_estimada,\n        rs.velocidad_real, rs.eficiencia\nFROM    resumen_sprints rs\nJOIN    proyectos p ON rs.id_proyecto = p.id_proyecto\nWHERE   rs.eficiencia < 85\nORDER BY rs.eficiencia ASC;`
  )}`;
}

// ── USUARIOS ──────────────────────────────────────────────
async function renderUsuarios(el) {
  el.innerHTML = loadingHTML();
  const data = await apiFetch('/usuarios');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Usuarios & Roles</div><div class="page-subtitle">Reporte Tech Lead — CTEs múltiples + estado de carga</div></div>
  <div class="panel">
    <div class="panel-header"><div class="panel-title">Desarrolladores activos</div></div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Nombre</th><th>Rol</th><th>Puntos</th><th>Tareas ✓</th><th>Pendientes</th><th>Bugs pendientes</th><th>Estado carga</th></tr></thead>
      <tbody>
        ${data.map(u => {
          const loadClass = u.estado_carga === 'Sobrecargado' ? 'load-sobrecargado' : u.estado_carga === 'Normal' ? 'load-normal' : 'load-disponible';
          return `<tr>
            <td><strong>${u.nombre}</strong><br><small style="color:var(--text3)">${u.email}</small></td>
            <td><span class="badge badge-purple">${u.rol}</span></td>
            <td><strong>${u.puntos_entregados}</strong> SP</td>
            <td>${u.tareas_completadas}</td>
            <td>${u.tareas_pendientes}</td>
            <td>${u.bugs_pendientes > 0 ? `<span style="color:var(--danger);font-weight:600">${u.bugs_pendientes}</span>` : '<span style="color:var(--accent2)">0</span>'}</td>
            <td><span class="${loadClass}">${u.estado_carga}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  </div>

  <div class="panel" style="margin-top:20px">
    <div class="panel-header"><div class="panel-title">Gestión de permisos — GRANT / REVOKE</div><div class="panel-subtitle">Ejercicios 2.1, 2.2, 2.3</div></div>
    <div class="panel-body">
      <div class="two-col">
        ${sqlPanel('GRANT — Permisos mínimos svc_qa',
          `CREATE USER 'svc_qa'@'localhost'\n    IDENTIFIED BY 'QA2024!Test';\n\n-- Solo lectura en todas las tablas\nGRANT SELECT ON SistemaGestion.* TO 'svc_qa'@'localhost';\n\n-- Insertar y actualizar bugs\nGRANT INSERT, UPDATE ON SistemaGestion.bugs\n    TO 'svc_qa'@'localhost';\n\n-- Solo insertar comentarios\nGRANT INSERT ON SistemaGestion.comentarios\n    TO 'svc_qa'@'localhost';\n\nFLUSH PRIVILEGES;\nSHOW GRANTS FOR 'svc_qa'@'localhost';`
        )}
        ${sqlPanel('REVOKE + Vista de seguridad',
          `-- Revocar permiso erróneo\nREVOKE UPDATE ON SistemaGestion.tareas\n    FROM 'svc_qa'@'localhost';\n\nFLUSH PRIVILEGES;\n\n-- Vista que oculta columnas sensibles\nCREATE OR REPLACE VIEW v_tareas_publico AS\nSELECT id_tarea, titulo, prioridad,\n       estado, story_points, id_proyecto\nFROM   tareas;\n-- Excluidas: descripcion, id_sprint,\n--            id_asignado, fecha_creacion`
        )}
      </div>
    </div>
  </div>`;
}

// ── AUDITORÍA ─────────────────────────────────────────────
async function renderAuditoria(el) {
  el.innerHTML = loadingHTML();
  const data = await apiFetch('/auditorias');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Auditoría</div><div class="page-subtitle">Registro de acciones — Stored Procedures con trazabilidad</div></div>
  <div class="panel">
    <div class="panel-header"><div class="panel-title">Log de auditorías</div></div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>#</th><th>Tabla</th><th>Registro</th><th>Acción</th><th>Usuario</th><th>Detalle</th><th>Fecha</th></tr></thead>
      <tbody>
        ${data.map(a => `<tr>
          <td>${a.id_auditoria}</td>
          <td><span class="badge badge-blue">${a.tabla_afectada}</span></td>
          <td>${a.id_registro}</td>
          <td><span class="badge badge-purple">${a.accion}</span></td>
          <td>${a.usuario}</td>
          <td style="max-width:280px;font-size:12px">${a.detalle}</td>
          <td style="font-size:12px">${a.fecha}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

// ── ACCIONES SP ───────────────────────────────────────────
async function renderAcciones(el) {
  const [bugs, usuarios, proyectos, tareas] = await Promise.all([
    apiFetch('/bugs'), apiFetch('/usuarios'), apiFetch('/proyectos'), apiFetch('/tareas')
  ]);

  const bugAbiertos = bugs.filter(b => b.estado === 'abierto' || b.estado === 'en_revision');
  const tareasNoComp = tareas.filter(t => t.estado !== 'completada');

  el.innerHTML = `
  <div class="page-header"><div class="page-title">Acciones — Stored Procedures</div><div class="page-subtitle">Ejecuta sp_cerrar_bug, sp_asignar_tarea, INSERT bug en transacción</div></div>

  <div class="two-col">
    <!-- sp_cerrar_bug -->
    <div class="panel">
      <div class="panel-header"><div class="panel-title">sp_cerrar_bug</div><div class="panel-subtitle">Cambia estado a resuelto + auditoría</div></div>
      <div class="panel-body">
        <div class="form-group">
          <label>Bug a cerrar</label>
          <select id="sel-bug">
            ${bugAbiertos.map(b => `<option value="${b.id_bug}">[${b.id_bug}] ${b.titulo} (${b.severidad})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Resolutor</label>
          <select id="sel-res">
            ${usuarios.map(u => `<option value="${u.id_usuario}">${u.nombre}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-success" onclick="accionCerrarBug()">✓ Cerrar Bug</button>
      </div>
      ${sqlPanel('sp_cerrar_bug',
        `CALL sp_cerrar_bug(p_id_bug, p_id_resolutor);\n\n-- El SP ejecuta:\n-- UPDATE bugs SET estado='resuelto',\n--    fecha_resolucion=NOW(), id_asignado=p_id_resolutor\n-- WHERE id_bug = p_id_bug;\n-- INSERT INTO auditorias(...) VALUES(...);`
      )}
    </div>

    <!-- sp_asignar_tarea -->
    <div class="panel">
      <div class="panel-header"><div class="panel-title">sp_asignar_tarea</div><div class="panel-subtitle">Asigna tarea + estado en_progreso + auditoría</div></div>
      <div class="panel-body">
        <div class="form-group">
          <label>Tarea a asignar</label>
          <select id="sel-tarea">
            ${tareasNoComp.map(t => `<option value="${t.id_tarea}">[${t.id_tarea}] ${t.titulo}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Asignar a</label>
          <select id="sel-dev">
            ${usuarios.map(u => `<option value="${u.id_usuario}">${u.nombre}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary" onclick="accionAsignarTarea()">→ Asignar Tarea</button>
      </div>
      ${sqlPanel('sp_asignar_tarea',
        `CALL sp_asignar_tarea(p_id_tarea, p_id_usuario, p_auditor);\n\n-- El SP ejecuta:\n-- UPDATE tareas SET id_asignado=p_id_usuario,\n--    estado='en_progreso'\n-- WHERE id_tarea = p_id_tarea;\n-- INSERT INTO auditorias(...) VALUES(...);`
      )}
    </div>
  </div>

  <!-- Crear bug en transacción -->
  <div class="panel" style="margin-top:0">
    <div class="panel-header"><div class="panel-title">Insertar Bug en Transacción</div><div class="panel-subtitle">START TRANSACTION → INSERT bugs + INSERT auditorias → COMMIT</div></div>
    <div class="panel-body">
      <div class="two-col">
        <div>
          <div class="form-group">
            <label>Título del bug</label>
            <input type="text" id="bug-titulo" placeholder="Ej: Error en módulo de pagos" />
          </div>
          <div class="form-group">
            <label>Severidad</label>
            <select id="bug-sev">${['critica','alta','media','baja'].map(s=>`<option value="${s}">${s}</option>`).join('')}</select>
          </div>
          <div class="form-group">
            <label>Proyecto</label>
            <select id="bug-proy">${proyectos.map(p=>`<option value="${p.id_proyecto}">${p.nombre}</option>`).join('')}</select>
          </div>
          <div class="form-group">
            <label>Asignado a</label>
            <select id="bug-asig">${usuarios.map(u=>`<option value="${u.id_usuario}">${u.nombre}</option>`).join('')}</select>
          </div>
          <button class="btn btn-danger" onclick="accionCrearBug()">⚡ Crear Bug (con transacción)</button>
        </div>
        <div>
          ${sqlPanel('Transacción INSERT bug + auditoría',
            `START TRANSACTION;\n\n    INSERT INTO bugs (titulo, severidad, estado,\n                      id_proyecto, id_asignado, fecha_reporte)\n    VALUES ('titulo', 'severidad', 'abierto',\n            id_proyecto, id_asignado, NOW());\n\n    -- LAST_INSERT_ID() captura el ID recién generado\n    INSERT INTO auditorias\n        (tabla_afectada, id_registro, accion, id_usuario, detalle)\n    VALUES ('bugs', LAST_INSERT_ID(), 'INSERTAR',\n            1, 'Bug creado vía transacción');\n\nCOMMIT;`
          )}
        </div>
      </div>
    </div>
  </div>`;

  window.accionCerrarBug = async function() {
    const id_bug       = +document.getElementById('sel-bug').value;
    const id_resolutor = +document.getElementById('sel-res').value;
    try {
      const r = await apiPost('/bugs/cerrar', { id_bug, id_resolutor });
      showToast(`✓ Bug #${id_bug} cerrado. Auditoría registrada.`, 'success');
    } catch(e) { showToast('Error al cerrar el bug', 'error'); }
  };

  window.accionAsignarTarea = async function() {
    const id_tarea   = +document.getElementById('sel-tarea').value;
    const id_usuario = +document.getElementById('sel-dev').value;
    try {
      const r = await apiPost('/tareas/asignar', { id_tarea, id_usuario, id_auditor: 1 });
      showToast(`✓ Tarea #${id_tarea} asignada. Auditoría registrada.`, 'success');
    } catch(e) { showToast('Error al asignar la tarea', 'error'); }
  };

  window.accionCrearBug = async function() {
    const titulo      = document.getElementById('bug-titulo').value.trim() || 'Nuevo bug sin título';
    const severidad   = document.getElementById('bug-sev').value;
    const id_proyecto = +document.getElementById('bug-proy').value;
    const id_asignado = +document.getElementById('bug-asig').value;
    try {
      const r = await apiPost('/bugs/crear', { titulo, severidad, id_proyecto, id_asignado, id_reportado_por: 1 });
      showToast(`✓ Bug #${r.bug.id_bug} creado en transacción. Auditoría registrada.`, 'success');
    } catch(e) { showToast('Error al crear el bug', 'error'); }
  };
}
