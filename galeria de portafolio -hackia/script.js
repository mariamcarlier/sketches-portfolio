/**
 * PORTFOLIO GALLERY — script.js
 * Funcionalidades:
 *  - Render dinámico de cards desde un array de datos
 *  - Filtrado por categoría con animación
 *  - Me Gusta por card (toggle) persistido en localStorage
 *  - Filtro "Solo Favoritos"
 *  - Modal de detalle con cierre por Esc / click fuera
 *  - Stagger animation al montar cards
 */

'use strict';

/* ═══════════════════════════════════════════
    1. DATOS DE PROYECTOS
   ═══════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 1,
    category:  'ecommerce',
    title:     'Boutique Élite',
    tag:       'E-Commerce',
    tagColor:  '#c26b6b',
    desc:      'Tienda online de moda de lujo con carrito dinámico, filtros por categoría y pasarela de pago integrada.',
    longDesc:  'Desarrollo completo de e-commerce para marca de moda premium. Incluye sistema de inventario en tiempo real, carrito persistente con localStorage, galería de productos con zoom y variantes de color/talla.',
    tech:      ['HTML5', 'CSS3', 'JavaScript'],
    emoji:     '🛍️',
    bg:        'linear-gradient(135deg,#1a0a0a,#2d1515)',
    year:      '2024',
    client:    'Boutique Luna',
    height:    '220px',
  },
  {
    id: 2,
    category:  'dashboard',
    title:     'Analytics Pro',
    tag:       'Dashboard',
    tagColor:  '#6bb5c2',
    desc:      'Panel de control con visualización de métricas clave, gráficos en tiempo real y exportación de reportes.',
    longDesc:  'Dashboard empresarial con más de 15 widgets configurables. Incluye gráficas dinámicas con Canvas API, tablas ordenables y sistema de alertas personalizadas.',
    tech:      ['Canvas API', 'JS ES6+', 'CSS Grid'],
    emoji:     '📊',
    bg:        'linear-gradient(135deg,#051a1a,#0a2d2d)',
    year:      '2024',
    client:    'DataCorp S.A.',
    height:    '280px',
  },
  {
    id: 3,
    category:  'landing',
    title:     'Studio Creativo',
    tag:       'Landing',
    tagColor:  '#9b7ec8',
    desc:      'Landing page con animaciones scroll-triggered, formulario de contacto validado y diseño editorial único.',
    longDesc:  'Sitio one-page para estudio de diseño gráfico. Animaciones CSS/JS activadas por scroll, portfolio masonry, formulario con validación en tiempo real y mapa interactivo.',
    tech:      ['HTML5', 'CSS Animations', 'Vanilla JS'],
    emoji:     '✦',
    bg:        'linear-gradient(135deg,#0f0a1a,#1a0f2d)',
    year:      '2023',
    client:    'Studio Forma',
    height:    '200px',
  },
  {
    id: 4,
    category:  'web',
    title:     'Sistema de Reservas',
    tag:       'Web App',
    tagColor:  '#7ec28a',
    desc:      'App de reservas hoteleras con calendario interactivo, disponibilidad en tiempo real y confirmaciones automáticas.',
    longDesc:  'Aplicación SPA construida con JavaScript puro. Calendario personalizado, gestión de habitaciones, notificaciones por email simuladas y panel de administración completo.',
    tech:      ['SPA Pattern', 'LocalStorage', 'Fetch API'],
    emoji:     '🏨',
    bg:        'linear-gradient(135deg,#0a1205,#15201a)',
    year:      '2024',
    client:    'Hotel Dorado',
    height:    '250px',
  },
  {
    id: 5,
    category:  'mobile',
    title:     'FitTrack UI',
    tag:       'Mobile UI',
    tagColor:  '#e8a87c',
    desc:      'Interfaz móvil para app de fitness con rutinas animadas, tracking de progreso y gamificación.',
    longDesc:  'Diseño UI responsive pensado mobile-first para aplicación de entrenamiento. Progress rings animados con SVG, soporte para gestos swipe y toggle dark/light mode.',
    tech:      ['CSS Variables', 'Touch Events', 'SVG'],
    emoji:     '💪',
    bg:        'linear-gradient(135deg,#1a0f05,#2d1a0a)',
    year:      '2024',
    client:    'FitLife App',
    height:    '300px',
  },
  {
    id: 6,
    category:  'ecommerce',
    title:     'Gourmet Market',
    tag:       'E-Commerce',
    tagColor:  '#c2a56b',
    desc:      'Marketplace de productos artesanales con búsqueda avanzada, carrito multi-vendedor y sistema de reseñas.',
    longDesc:  'Plataforma de marketplace para productores locales. Sistema de búsqueda con filtros múltiples, reseñas con estrellas, comparador de productos y lista de deseos.',
    tech:      ['HTML5', 'ES6+', 'CSS Custom Props'],
    emoji:     '🫙',
    bg:        'linear-gradient(135deg,#1a1205,#2d200a)',
    year:      '2023',
    client:    'Mercado Origen',
    height:    '230px',
  },
  {
    id: 7,
    category:  'landing',
    title:     'Agencia Digital',
    tag:       'Landing',
    tagColor:  '#7c8ec2',
    desc:      'Sitio corporativo con hero animado, contador de estadísticas, casos de éxito y CTA optimizado.',
    longDesc:  'Web corporativa para agencia de marketing digital. Hero con texto animado letra a letra, contadores con Intersection Observer, slider de testimonios con CSS puro.',
    tech:      ['Intersection Observer', 'CSS', 'JS'],
    emoji:     '🚀',
    bg:        'linear-gradient(135deg,#05050a,#0a0a1a)',
    year:      '2024',
    client:    'PixelAgency',
    height:    '210px',
  },
  {
    id: 8,
    category:  'dashboard',
    title:     'Inventario Smart',
    tag:       'Dashboard',
    tagColor:  '#7ec28a',
    desc:      'Sistema CRUD de inventario con búsqueda en tiempo real, alertas de stock bajo y exportación a CSV.',
    longDesc:  'Gestor de inventario para PYME. CRUD completo en memoria, búsqueda instantánea, filtros por categoría, alertas visuales y exportación de datos en formato CSV.',
    tech:      ['DOM Manipulation', 'Array Methods', 'Events'],
    emoji:     '📦',
    bg:        'linear-gradient(135deg,#0a1205,#0f1a08)',
    year:      '2023',
    client:    'Distribuidora Sol',
    height:    '260px',
  },
  {
    id: 9,
    category:  'web',
    title:     'Red Social Micro',
    tag:       'Web App',
    tagColor:  '#b07ec2',
    desc:      'Mini red social con feed dinámico, likes, comentarios, perfil de usuario y almacenamiento local.',
    longDesc:  'Prototipo de red social construido 100% con JavaScript vanilla. Feed dinámico, sistema de likes con animación, comentarios anidados y perfiles con avatar personalizable.',
    tech:      ['LocalStorage', 'Template Literals', 'Events'],
    emoji:     '💬',
    bg:        'linear-gradient(135deg,#0f0a1a,#140f22)',
    year:      '2024',
    client:    'Proyecto Final',
    height:    '240px',
  },
  {
    id: 10,
    category:  'mobile',
    title:     'Recipe Finder',
    tag:       'Mobile UI',
    tagColor:  '#c27c7c',
    desc:      'App de recetas con búsqueda por ingredientes, favoritos, modo oscuro y vista de pasos animados.',
    longDesc:  'Aplicación de recetas mobile-first. Búsqueda por ingredientes disponibles, favoritos persistentes, toggle dark/light, y modo de cocina paso a paso con timers.',
    tech:      ['Fetch API', 'CSS Variables', 'PWA Ready'],
    emoji:     '🍜',
    bg:        'linear-gradient(135deg,#1a0505,#1a0a0a)',
    year:      '2023',
    client:    'Startup Gastro',
    height:    '290px',
  },
  {
    id: 11,
    category:  'landing',
    title:     'Portfolio Arquitecto',
    tag:       'Landing',
    tagColor:  '#c2bf6b',
    desc:      'Galería inmersiva con proyectos arquitectónicos, scroll horizontal y lightbox personalizado.',
    longDesc:  'Portfolio para estudio de arquitectura. Scroll horizontal suave entre proyectos, lightbox personalizado para imágenes, transiciones de página y cursor personalizado.',
    tech:      ['Scroll API', 'Custom Cursor', 'CSS Clip-path'],
    emoji:     '🏛️',
    bg:        'linear-gradient(135deg,#0a0a05,#1a1a0a)',
    year:      '2024',
    client:    'Arq. Studio MV',
    height:    '270px',
  },
  {
    id: 12,
    category:  'web',
    title:     'Task Manager',
    tag:       'Web App',
    tagColor:  '#6bc2b5',
    desc:      'Gestor de tareas con drag & drop, etiquetas, prioridades, vistas Kanban y lista con sincronización local.',
    longDesc:  'Aplicación de productividad completa. Tablero Kanban con drag & drop nativo, etiquetas de colores, prioridades, fechas límite y estadísticas de productividad personal.',
    tech:      ['Drag & Drop API', 'IndexedDB', 'Web Workers'],
    emoji:     '✅',
    bg:        'linear-gradient(135deg,#030a0a,#082020)',
    year:      '2024',
    client:    'ProductivApp',
    height:    '250px',
  },
];

/* ═══════════════════════════════════════════
      2. CONSTANTES DE STORAGE
   ═══════════════════════════════════════════ */
const STORAGE_LIKES  = 'portfolio_likes';   // Set de IDs likeados
const STORAGE_COUNTS = 'portfolio_counts';  // Mapa id → cantidad de likes

/* ═══════════════════════════════════════════
      3. ESTADO DE LA APP ciclo de vida de los datos
   ═══════════════════════════════════════════ */
const state = {
  activeFilter:  'all',
  showOnlyLiked: false,
  likes:         loadLikes(),     // Set<number> --carga inicial
  counts:        loadCounts(),    // Map<number, number>
  activeModal:   null,
};

/* ═══════════════════════════════════════════
      4. HELPERS DE PERSISTENCIA
   ═══════════════════════════════════════════ */
function loadLikes() {
  try {
    const raw = localStorage.getItem(STORAGE_LIKES);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLikes() {
  try {
    localStorage.setItem(STORAGE_LIKES, JSON.stringify([...state.likes]));
  } catch { /* cuota excedida u otro error */ }
}

function loadCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_COUNTS);
    return raw ? new Map(JSON.parse(raw)) : new Map();
  } catch {
    return new Map();
  }
}

function saveCounts() {
  try {
    localStorage.setItem(STORAGE_COUNTS, JSON.stringify([...state.counts]));
  } catch { /* cuota excedida u otro error */ }
}

function getCount(id) {
  return state.counts.get(id) ?? 0;
}

/* ═══════════════════════════════════════════
      5. PLANTILLAS HTML
   ═══════════════════════════════════════════ */
function createCardHTML(project) {
  const liked   = state.likes.has(project.id);
  const count   = getCount(project.id);
  const likeClass = liked ? 'btn-like is-liked' : 'btn-like';

  return `
    <article
      class="card"
      data-id="${project.id}"
      data-category="${project.category}"
      aria-label="Proyecto: ${project.title}"
    >
      <div class="card__img-wrap">
        <div
          class="card__placeholder"
          style="height:${project.height}; background:${project.bg};"
          aria-hidden="true"
        >${project.emoji}</div>
      </div>

      <div class="card__body">
        <span
          class="card__tag"
          style="background:${project.tagColor}22; color:${project.tagColor}; border:1px solid ${project.tagColor}44;"
        >${project.tag}</span>
        <h2 class="card__title">${project.title}</h2>
        <p  class="card__desc">${project.desc}</p>
      </div>

      <div class="card__footer">
        <div class="card__tech">
          ${project.tech.slice(0, 2).map(t => `<span class="tech-pill">${t}</span>`).join('')}
        </div>

        <div class="card__actions">
          <button
            class="${likeClass}"
            data-like-id="${project.id}"
            aria-label="${liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
            aria-pressed="${liked}"
          >
            <svg class="like-icon" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="like-count">${count > 0 ? count : ''}</span>
          </button>

          <button class="card__link" data-open-id="${project.id}" aria-label="Ver detalles de ${project.title}">
            Ver más
          </button>
        </div>
      </div>
    </article>`;
}

/* ═══════════════════════════════════════════
      6. RENDER DE GALERÍA
   ═══════════════════════════════════════════ */
function getFilteredProjects() {
  return PROJECTS.filter(p => {
    const matchCat   = state.activeFilter === 'all' || p.category === state.activeFilter;
    const matchLiked = !state.showOnlyLiked || state.likes.has(p.id);
    return matchCat && matchLiked;
  });
}

function renderGallery() {
  const gallery    = document.getElementById('gallery');
  const emptyState = document.getElementById('emptyState');
  const countBadge = document.getElementById('countBadge');

  const filtered = getFilteredProjects();

  // Actualizar badge
  countBadge.textContent = String(filtered.length).padStart(2, '0');

  // Limpiar galería
  gallery.innerHTML = '';
  emptyState.hidden = true;

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }

  // Insertar cards con stagger
  filtered.forEach((project, index) => {
    gallery.insertAdjacentHTML('beforeend', createCardHTML(project));
    const card = gallery.lastElementChild;

    // Stagger: cada card aparece 60ms después de la anterior
    setTimeout(() => card.classList.add('is-visible'), index * 60 + 80);
  });

  // Delegar eventos de la galería
  attachCardEvents(gallery);
}

/* ═══════════════════════════════════════════
      7. DELEGACIÓN DE EVENTOS EN CARDS
   ═══════════════════════════════════════════ */
function attachCardEvents(gallery) {
  gallery.addEventListener('click', handleGalleryClick);
}

function handleGalleryClick(event) {
  // ── Botón Me Gusta ──
  const likeBtn = event.target.closest('[data-like-id]');
  if (likeBtn) {
    event.stopPropagation();
    toggleLike(parseInt(likeBtn.dataset.likeId, 10), likeBtn);
    return;
  }

  // ── Botón Ver más ──
  const openBtn = event.target.closest('[data-open-id]');
  if (openBtn) {
    event.stopPropagation();
    const project = PROJECTS.find(p => p.id === parseInt(openBtn.dataset.openId, 10));
    if (project) openModal(project);
    return;
  }

  // ── Click en card (abre modal) ──
  const card = event.target.closest('.card');
  if (card) {
    const project = PROJECTS.find(p => p.id === parseInt(card.dataset.id, 10));
    if (project) openModal(project);
  }
}

/* ═══════════════════════════════════════════
      8. LÓGICA DE ME GUSTA
   ═══════════════════════════════════════════ */
function toggleLike(id, btnEl) {
  const wasLiked = state.likes.has(id);

  if (wasLiked) {
    state.likes.delete(id);
    state.counts.set(id, Math.max(0, getCount(id) - 1));
  } else {
    state.likes.add(id);
    state.counts.set(id, getCount(id) + 1);
  }

  saveLikes();
  saveCounts();

  // Actualizar UI del botón
  updateLikeButton(id, btnEl);

  // Actualizar badge de total de likes en el toolbar
  updateLikedCount();

  // Si estamos en modo "solo favoritos" y se deslikeó → rerenderizar
  if (state.showOnlyLiked && wasLiked) {
    renderGallery();
  }
}

function updateLikeButton(id, btnEl) {
  if (!btnEl) return;

  const liked = state.likes.has(id);
  const count = getCount(id);

  btnEl.classList.toggle('is-liked', liked);
  btnEl.setAttribute('aria-pressed', String(liked));
  btnEl.setAttribute('aria-label', liked ? 'Quitar de favoritos' : 'Agregar a favoritos');

  const icon  = btnEl.querySelector('.like-icon');
  const span  = btnEl.querySelector('.like-count');

  if (icon) icon.setAttribute('fill', liked ? 'currentColor' : 'none');
  if (span) span.textContent = count > 0 ? count : '';
}

function updateLikedCount() {
  const el = document.getElementById('likedCount');
  if (el) el.textContent = state.likes.size;
}

/* ═══════════════════════════════════════════
      9. MODAL DE DETALLE
   ═══════════════════════════════════════════ */
function openModal(project) {
  const overlay  = document.getElementById('modalOverlay');
  const preview  = document.getElementById('modalPreview');
  const title    = document.getElementById('modalTitle');
  const desc     = document.getElementById('modalDesc');
  const meta     = document.getElementById('modalMeta');

  title.textContent        = project.title;
  desc.textContent         = project.longDesc;
  preview.style.background = project.bg;
  preview.textContent      = project.emoji;

  meta.innerHTML = `
    <div>
      <dt>Categoría</dt>
      <dd style="color:${project.tagColor}">${project.tag}</dd>
    </div>
    <div>
      <dt>Cliente</dt>
      <dd>${project.client}</dd>
    </div>
    <div>
      <dt>Año</dt>
      <dd>${project.year}</dd>
    </div>
    <div>
      <dt>Tecnologías</dt>
      <dd>${project.tech.join(' · ')}</dd>
    </div>`;

  overlay.hidden = false;
  // rAF para activar transición CSS
  requestAnimationFrame(() => overlay.classList.add('is-open'));

  document.body.style.overflow = 'hidden';
  state.activeModal = project;

  // Foco en botón de cierre (accesibilidad)
  document.getElementById('modalClose').focus();
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('is-open');

  // Esperar la transición antes de ocultar
  overlay.addEventListener('transitionend', () => {
    overlay.hidden = true;
  }, { once: true });

  document.body.style.overflow = '';
  state.activeModal = null;
}

/* ═══════════════════════════════════════════
      10. FILTROS
   ═══════════════════════════════════════════ */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Actualizar estado activo
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      state.activeFilter = this.dataset.filter;
      renderGallery();
    });
  });
}

/* ═══════════════════════════════════════════
      11. TOGGLE FAVORITOS
   ═══════════════════════════════════════════ */
function initLikedToggle() {
  const btn = document.getElementById('likedToggle');
  if (!btn) return; // Seguridad: si el botón no existe, no hagas nada.

  btn.addEventListener('click', function () {
    state.showOnlyLiked = !state.showOnlyLiked;
    this.setAttribute('aria-pressed', String(state.showOnlyLiked));
    renderGallery();
  });
}

/* ═══════════════════════════════════════════
      12. EVENTOS GLOBALES (Modal)
   ═══════════════════════════════════════════ */
function initModalEvents() {
  // Botón cerrar
  document.getElementById('modalClose').addEventListener('click', closeModal);

  // Click en el overlay (fuera del modal)
  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.activeModal) closeModal();
  });
}

/* ═══════════════════════════════════════════
      13. INICIALIZACIÓN
   ═══════════════════════════════════════════ */
function init() {
  initFilters();
  initLikedToggle();
  initModalEvents();
  updateLikedCount();
  renderGallery();
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

