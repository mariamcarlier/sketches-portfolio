const btnActualizar = document.getElementById("btn-actualizar");


const dolar = document.getElementById("out-dolar");
const euro = document.getElementById("out-euro");
const bitcoin = document.getElementById("out-bitcoin");
const libra = document.getElementById("out-libra");


const alerta = document.getElementById("alerta-actualizacion");


const datos = {
    dolar: "4.120,50",
    euro: "4.380,00",
    bitcoin: "68.900.000",
    libra: "5.220,00"
};


btnActualizar.addEventListener("click", actualizarCotizaciones);


function actualizarCotizaciones() {


    limpiarEstados();


    dolar.textContent = `$${datos.dolar} COP`;
    euro.textContent = `$${datos.euro} COP`;
    bitcoin.textContent = `$${datos.bitcoin} USD`;
    libra.textContent = `£${datos.libra} COP`;


    const hora = new Date().toLocaleTimeString();


    console.log("Dashboard actualizado:", hora);


    alerta.textContent = `Cotizaciones actualizadas a las ${hora}`;
    alerta.classList.remove("oculto");


    setTimeout(() => {
        alerta.classList.add("oculto");
    }, 3000);


    dolar.classList.add("modo-actualizado");
    euro.classList.add("modo-actualizado");
    bitcoin.classList.add("modo-actualizado");
    libra.classList.add("modo-actualizado");
}


function limpiarEstados() {


    dolar.classList.remove("modo-actualizado");
    euro.classList.remove("modo-actualizado");
    bitcoin.classList.remove("modo-actualizado");
    libra.classList.remove("modo-actualizado");


}
