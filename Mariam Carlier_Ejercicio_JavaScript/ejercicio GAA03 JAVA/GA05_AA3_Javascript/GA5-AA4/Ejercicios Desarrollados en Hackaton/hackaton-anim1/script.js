const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / total) * 100;
  progressBar.style.width = pct + '%';
});
 
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const isScrolled = window.scrollY > 60;
  nav.classList.toggle('scrolled', isScrolled);
});

const scrollPct = document.getElementById('scroll-pct');

window.addEventListener('scroll', () => {
  const pct = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  scrollPct.textContent = pct + '%';
  scrollPct.classList.toggle('visible', window.scrollY > 10);
});