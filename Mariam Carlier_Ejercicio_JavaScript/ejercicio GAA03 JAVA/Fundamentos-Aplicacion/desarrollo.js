//EJERCICIO 1 – Declaración de Variables
let nombreAprendiz = 'Mariam Carlier Alvarado';
let fichaNumero = 3321349;
let estadoActivo = true;
const nombreInstructor = 'Yonatan Rodriguez';
let tecnologias = ['JavaScript', 'HTML', 'CSS'];
console.log(nombreAprendiz);
console.log(fichaNumero);
console.log(estadoActivo);
console.log(nombreInstructor);
console.log(tecnologias);
/*🔴 RETO EXTRA: ¿Qué pasa si intentas cambiar la constante?
nombreInstructor = 'PEPITO PEREZ';*/

//Ejercicio 2 - reglas de nomenclatura
// ❌ let 1dato = 'Carlos';        → Empieza con número
let primerDato = 'Carlos';         // ✅ camelCase

// ❌ let nombre aprendiz = 'María'; → Tiene espacio
//let nombreAprendiz = 'María';      // ✅ sin espacios y utiliza tmb camelCase
// ❌ let x = true;                → Poco descriptivo, no es un buen naming 
let estaActivo = true;             // ✅ descriptivo + prefijo 'is/esta' para describir un estado determinado
// ❌ let NOMBRE_DE_LA_VARIABLE = 'hola'; // aqui se usa SNAKE_CASE para una variable pero es preferible usarlo solo en constantes para identificar lo que cambia a lo que no 
let nombreVariable = 'hola';       // ✅ camelCase para variables normales
// ❌ let datos-aprendiz = {};    → Guión medio NO permitido solo guion bajo o directamente aplicar camelCase
let datosAprendiz = {};        

 // RETO EXTRA: 5 nombres para proyecto grupal
let totalAprendicesActivos = 0;
let nombreProyectoFinal = 'Panel ADSO';
let fechaEntregaSustentacion = '2027-06-01';
let isFormularioEnviado = false;
const MAX_INTEGRANTES_GRUPO = 5;
//reto extra: variables del proyecto grupal
let nombrePoducto = "Anillo Mariposa";
let precioProducto = 500000;
let talla = "0.85";
let stockDisponible = 10;
let descripcionProducto = "Anillo de 18k oro con mariposas"; 


// Ejercicio 3 – Ámbito Global
let totalAprendices = 0;  // ← GLOBAL

function cargaAprendices() {
    console.log("total antes de cargar", totalAprendices);
    totalAprendices = totalAprendices + 1;  // modifica la global
}

function mostrarAprendices() {
    console.log("aprendices después de cargar", totalAprendices);
}

cargaAprendices();  // llama 1ra vez
cargaAprendices();  // llama 2da vez
cargaAprendices();  // llama 3ra vez
mostrarAprendices();
// Si solo la usa una función → decláralas dentro.

// Ejercicio 4 – Ámbito de Función
function generarTarjetaAprendiz(nombre, tecnologia) {
  // Variable LOCAL → solo existe dentro de esta función
  let etiqueta = nombre + ' - ' + tecnologia;
  console.log('Tarjeta generada:', etiqueta);
  return etiqueta;
}
generarTarjetaAprendiz('Carlos', 'JavaScript');
generarTarjetaAprendiz('Alejandra', 'Python');
generarTarjetaAprendiz('Valeria', 'React');

/* 🔴 ¿Qué pasa si accedemos a 'etiqueta' fuera?
console.log('Etiqueta fuera de la función:', etiqueta); = ❌ ERROR: ReferenceError: etiqueta is not defined
EXPLICACIÓN:
 'etiqueta' vive DENTRO de generarTarjetaAprendiz. Cuando la función termina, la variable se destruye.
Es como una oficina privada: lo que hay adentro no puede verse desde el pasillo (ámbito global).*/

// Ejercicio 5 – Block Scope
var estado = 'inactivo';
// Con LET → respeta el bloque
if (true) {
  let mensajeLet = 'Aprendiz activo'; // Solo existe aquí
  console.log('Dentro del if:', mensajeLet); // ✅ funciona
}

// punto 4 Con VAR → se escapa del bloque (¡problema!)
if (true) {
  var mensajeVar = 'Aprendiz con var';
}
console.log('Fuera del if (var):', mensajeVar); // ✅ se escapó!

/* RETO EXTRA: for con variable local
const aprendices = ['Ana', 'Pedro', 'Luisa', 'Juan', 'Sara'];
for (let i = 0; i < aprendices.length; i++) {
  const aprendizActual = aprendices[i]; // local al bloque for
  const estaActivo = i % 2 === 0;      // pares = activos
  if (estaActivo) {
    console.log('✅ Activo:', aprendizActual);
  }
} */

/* ----1. Evaluación de Evidencias------
Crea una función llamada evaluarEvidencia(nota). La función debe recibir un
número del 0 al 100. Si la nota es mayor o igual a 70, debe imprimir un
mensaje de éxito; si es menor, un mensaje para iniciar plan de mejoramiento.
Resultado esperado en consola: "Juicio evaluativo: Aprobado. El aprendiz
alcanzó el RAP." o "Juicio evaluativo: Deficiente. Se requiere plan de mejoramiento." */
function evaluarEvidencia(nota) {
  if (nota >= 70) {
    console.log("Juicio evaluativo: Aprobado. El aprendiz alcanzó el RAP.");
  } else {
    console.log("Juicio evaluativo: Deficiente. Se requiere plan de mejoramiento.");
  }
}

// Pruebas
evaluarEvidencia(85);  // Aprobado
evaluarEvidencia(70);  // Aprobado (límite exacto)
evaluarEvidencia(60);  // Deficiente
evaluarEvidencia(45);  // Deficiente

// Ejercicio 6 – let, const y var en el Panel ADSO
// CONST → valores que NUNCA cambian
const NOMBRE_PROGRAMA = 'Análisis y Desarrollo de Software';
const VERSION_PANEL = '1.0.0';
const MAX_APRENDICES_FICHA = 30;
// LET → valores que sí cambian
let contadorAprendices = 0;
let estadoPanel = 'cargando';
console.log('Programa:', NOMBRE_PROGRAMA);
console.log('Versión:', VERSION_PANEL);
 //Con LET en bucle → bloque respetado
for (let i = 1; i <= 3; i++) {
  contadorAprendices++;
 console.log('Iteración', i, '| Contador:', contadorAprendices);
}
 
// Ejercicio 7 – Bucle for con Panel de Aprendices
 const aprendices = [
  { nombre: 'Ana Gómez',    tecnologia: 'JavaScript', activo: true  },
  { nombre: 'Pedro Ramos',  tecnologia: 'Python',     activo: false },
  { nombre: 'Luisa Torres', tecnologia: 'React',      activo: true  },
  { nombre: 'Juan Díaz',    tecnologia: 'Node.js',    activo: false },
  { nombre: 'Sara López',   tecnologia: 'Vue',        activo: true  },
];
let contadorActivos = 0;
for (let i = 0; i < aprendices.length; i++) {
  const a = aprendices[i];
  if (a.activo) {
    console.log('✅', a.nombre, '–', a.tecnologia);
    contadorActivos++;
  } else {
    console.log('❌', a.nombre, '– Inactivo');
  }
}
console.log('Total activos:', contadorActivos);
// RETO EXTRA: Números del 1 al 10 con par/impar
console.log('--- Pares e Impares ---');
for (let n = 1; n <= 10; n++) {
  const tipo = n % 2 === 0 ? 'par' : 'impar';
  console.log(n, '→', tipo);
}

// Ejercicio 8 – Bucle while
// Parte A: Carga progresiva del Panel
let pagina = 1;
const MAX_PAGINAS = 4;
// MIENTRAS pagina sea <= MAX_PAGINAS, sigue cargando
while (pagina <= MAX_PAGINAS) {
  console.log(`Cargando página ${pagina} de ${MAX_PAGINAS}...`);
  pagina++; // ← MUY IMPORTANTE: sin esto, bucle infinito
}
console.log('✅ Todas las páginas cargadas');
// Otro ejemplo: contar aprendices activos
let aprendicesCargados = 0;
const MAX_APRENDICES = 5;
while (aprendicesCargados < MAX_APRENDICES) {
  aprendicesCargados++;
  console.log(`Cargando aprendiz #${aprendicesCargados}...`);
}
console.log('Total cargados:', aprendicesCargados);

// Ejercicio 9 
// Parte B: Simular ingreso de número de ficha
let fichaIngresada = 0;
let intentos = 0;
// La ficha debe ser mayor a 1000000
do {
  intentos++;
  fichaIngresada += 100000; // Simulamos que el usuario ingresa un número
  console.log(`Intento #${intentos}: ficha ingresada = ${fichaIngresada}`);
} while (fichaIngresada <= 1000000);
console.log('✅ Ficha válida encontrada en intento #' + intentos);
console.log('Ficha:', fichaIngresada);
// Otro ejemplo: intentar conexión al servidor
let conectado = false;
let conexiones = 0;
do {
  conexiones++;
  console.log(`Intento de conexión #${conexiones}`);
  if (conexiones === 3) conectado = true; // Conecta al 3er intento
} while (!conectado && conexiones < 5);
console.log(conectado ? ' Conectado exitosamente' : ' Falló la conexión');

// ejercicios 10 y 11
// PARTE A – for...of con tecnologías
tecnologias = ['HTML', 'CSS', 'JavaScript', 'React'];
let contador = 0;
for (const tech of tecnologias) {
  contador++;
  console.log( `${contador}. ${tech}`);
}
// PARTE B – for...in con objeto aprendiz
const aprendiz = {
  nombre: 'Mariam Carlier Alvarado',
  ficha: '3321349',
  tecnologia: 'JavaScript',
  activo: true,
  nota: 4.8
};
console.log('--- Datos del aprendiz ---');
for (const propiedad in aprendiz) {
  console.log( `La propiedad [${propiedad}] tiene el valor: ${aprendiz[propiedad]}`);
}
// reto extra

console.log('--- Todos los aprendices ---');
for (const a of aprendices) {
  for (const clave in a) {
    console.log(`  ${clave}: ${a[clave]}`);
  }
  console.log('---'); 
} 

/*ejercicio 12
// CONTINUE: Imprimir SOLO los activos
console.log('--- Aprendices activos ---');
for (const a of aprendices) {
  if (!a.activo) continue; // salta los inactivos
  console.log(` ${a.nombre} – Nota: ${a.nota}`);
}
// BREAK: Detectar el primero en riesgo académico (nota < 3.0)
console.log('--- Buscar riesgo académico ---');
let encontrado = false;
for (const a of aprendices) {
  if (a.nota < 3.0) {
    console.log( ` Riesgo: ${a.nombre} – Nota: ${a.nota}`);
    encontrado = true;
    break; // ya encontramos el primero, paramos
  }
}
if (!encontrado) console.log('Ningún aprendiz en riesgo');
// 🎯 RETO: Combinar ambos — saltar inactivos, parar en nota perfecta
console.log('--- Buscar nota perfecta entre activos ---');
for (const a of aprendices) {
  if (!a.activo) continue;      // salta inactivos
  if (a.nota >= 5.0) {
    console.log(` ¡Nota perfecta! ${a.nombre}: ${a.nota}`);
    break;
  }
}*/
