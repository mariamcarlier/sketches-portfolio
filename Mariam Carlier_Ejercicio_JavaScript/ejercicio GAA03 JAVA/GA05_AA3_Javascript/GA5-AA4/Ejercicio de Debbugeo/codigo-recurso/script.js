// 1. Cursor con Lag (LERP)
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  // SOLUCIÓN BUG 1: Cambiado de 1 a 0.1 para crear el efecto de suavizado (LERP)
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// 2. Barra de Progreso
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop = window.scrollY;
  // SOLUCIÓN BUG 2: Se resta window.innerHeight para que el 100% coincida con el final real
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}

// 3. NAV
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// 4. PARALLAX en tarjetas
const parallaxCards = document.querySelectorAll('[data-parallax]');

function updateParallax() {
  parallaxCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const speed = parseFloat(card.dataset.parallax);
    const center = (rect.top + rect.height / 2) - (window.innerHeight / 2);
    const offset = center * speed;
    card.style.transform = `translateY(${offset}px)`;
  });
}

// 5. Scroll Horizontal
const hSection = document.getElementById('horizontal-section');
const hScroll = document.getElementById('hscroll');

function updateHorizontalScroll() {
  const rect = hSection.getBoundingClientRect();
  // SOLUCIÓN BUG 3: Normalización del progreso usando la posición relativa al viewport
  const totalHeight = hSection.offsetHeight;
  const progress = -rect.top / (totalHeight - window.innerHeight);
  const clamped = Math.max(0, Math.min(1, progress));
  
  const maxShift = hScroll.scrollWidth - window.innerWidth + 120;
  hScroll.style.transform = `translateX(-${clamped * maxShift}px)`;
}

// 6. STICKY SECTION
const stickySection = document.getElementById('sticky-section');
const stickyLines = [
  document.getElementById('sline1'),
  document.getElementById('sline2'),
  document.getElementById('sline3'),
];
const stickyCircle = document.getElementById('sticky-circle');

function updateSticky() {
  const rect = stickySection.getBoundingClientRect();
  const totalScroll = stickySection.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

  stickyLines.forEach((line, i) => {
    if (progress > i * 0.08 + 0.05) {
      line.classList.add('in');
    } else {
      line.classList.remove('in');
    }
  });

  if (progress > 0.02) {
    stickyCircle.classList.add('grow');
  } else {
    stickyCircle.classList.remove('grow');
  }
}

// 7. WORD REVEAL
const revealContainer = document.getElementById('reveal-text');
const words = "JavaScript tiene acceso completo al DOM y puede transformar cualquier scroll en una experiencia visual poderosa sin ninguna librería externa".split(' ');
const highlightWords = ['JavaScript', 'DOM', 'scroll', 'poderosa'];

words.forEach((word, i) => {
  const span = document.createElement('span');
  span.textContent = word + ' ';
  span.className = 'reveal-word' + (highlightWords.includes(word) ? ' highlight-candidate' : '');
  span.dataset.index = i;
  revealContainer.appendChild(span);
});

function updateWordReveal() {
  const spans = revealContainer.querySelectorAll('.reveal-word');
  spans.forEach(span => {
    const rect = span.getBoundingClientRect();
    const threshold = window.innerHeight * 0.65;
    if (rect.top < threshold) {
      span.classList.add('lit');
      if (span.classList.contains('highlight-candidate')) {
        span.classList.add('highlight');
      }
    } else {
      span.classList.remove('lit');
    }
  });
}

// 8. INTERSECTION OBSERVER — Contadores
function animateCounter(el, target, suffix) {
  const start = performance.now();
  const duration = 1800;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutExpo(t) * target);
    el.textContent = value + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// SOLUCIÓN BUG 4: Se aumentó el threshold a 0.2 para asegurar visibilidad antes de animar
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const item = entry.target;
      const target = parseInt(item.dataset.target);
      const suffix = item.dataset.suffix;
      const numEl = item.querySelector('.counter-num');
      item.classList.add('visible');
      animateCounter(numEl, target, suffix);
      counterObserver.unobserve(item);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.counter-item').forEach(item => {
  counterObserver.observe(item);
});

// 9. HERO PARALLAX
const heroTitle = document.querySelector('.hero-title');

function updateHeroParallax() {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    // SOLUCIÓN BUG 5: Ajustado el factor a 0.4 para crear efecto de profundidad real
    heroTitle.style.transform = `translateY(${scrollY * 0.4}px)`;
  }
}

// Función maestra de Scroll
function onScroll() {
  updateProgress();
  updateNav();
  updateParallax();
  updateHorizontalScroll();
  updateSticky();
  updateWordReveal();
  updateHeroParallax();
}

window.addEventListener('scroll', onScroll, { passive: true });

// Ejecución inicial
onScroll();