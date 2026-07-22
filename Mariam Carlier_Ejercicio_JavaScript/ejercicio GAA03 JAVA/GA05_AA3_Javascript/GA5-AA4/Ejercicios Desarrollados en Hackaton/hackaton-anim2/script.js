
// ---------------------------aparecer trajetas-----------------------------------------------------

const observerOptions = {
  threshold: 0.2
};

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const tarjetas = document.querySelectorAll('.tarjeta');

tarjetas.forEach(tarjeta => {
  observer.observe(tarjeta);
});

// -------------------------------------------------------------------------------------------------



// ---------------------------aparecer parrafo------------------------------------------------------

const parrafos = document.querySelectorAll('.parrafo-animado');

parrafos.forEach(parrafo => {
  observer.observe(parrafo);
});

// ------------------------------------------------------------------------------------------------

