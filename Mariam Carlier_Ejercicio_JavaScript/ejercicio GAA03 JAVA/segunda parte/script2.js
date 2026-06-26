//SEGUNDA PARTE
// ejercicio 13 
// (Este código va en app.js, el HTML debe tener estos elementos)
// HTML necesario en index.html:
// <button id="btn-load">Cargar Datos</button>
// <button id="btn-filter-active">Ver Solo Activos</button>
// <input id="search-input" placeholder="Buscar...">
// <main id="app-grid" class="grid"></main>
// <span id="total-activos">0</span>
// 1. Selección por ID (el más específico y rápido)
const btnCargar       = document.getElementById('btn-load');
const inputBuscar     = document.getElementById('search-input');
const grilla          = document.getElementById('app-grid');

// 2. Selección por clase
const botonFiltro      = document.querySelector('·btn-filter-active');
const header           = document.querySelector('header');     
const TodosLosBotones     = document.querySelector('button');
// Verificar selección en consola
console.log(' Ejercicio 13 – Elementos seleccionados:');
console.log(btnCargar);
console.log(inputBuscar·placeholder);
 
// Recorrer todos los botones con for...of
const todosLosBotones = document.querySelectorAll('button');
console.log('--- Botones en el HTML ---');
for (const boton of todosLosBotones) {
  console.log('Botón encontrado:', boton.textContent);
}
// ejercicio 14
function crearTarjetaHTML(aprendiz) {
  const clase = aprendiz.activo ? 'card' : 'card inactive';
  return `
    <div class="${clase}">
      <h3>${aprendiz.nombre}</h3>
      <p>${aprendiz.activo ? '✅ Activo' : '❌ Inactivo'}</p>
      <span class="tag">${aprendiz.tecnologia}</span>
    </div>
  `;
}
// 1. Actualizar el contador con textContent
const totalActivos = aprendices.filter(a => a.activo).length;
spanActivos.textContent = totalActivos; // Cambia solo el texto
// 2. Generar tarjetas HTML con innerHTML
let htmlTarjetas = '';
for (const a of aprendices) {
  const clase = a.activo ? 'card' : 'card inactive';
  htmlTarjetas += `
    <div class="${clase}">
      <h3>${a.nombre}</h3>
      <p>${a.activo ? '✅ Activo' : '❌ Inactivo'}</p>
      <span class="tag">${a.tecnologia}</span>
    </div>
  `;
}
grilla.innerHTML = htmlTarjetas; // Reemplaza todo el contenido
// 3. Cambiar estilos del botón (MEJOR con classList)
btnCargar.classList.add('btn-disabled');
btnCargar.style.backgroundColor = 'gray'; // Forma directa
btnCargar.style.cursor = 'not-allowed';
// 4. toggle: alterna una clase (la pone si no está, la quita si está)
btnCargar.classList.toggle('activo');

// finaaal  ejercicio 15

