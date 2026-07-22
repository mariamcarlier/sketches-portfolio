// 1. Seleccionamos los elementos
const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menuCompañeros");
const mensaje = document.getElementById("mensaje");
const btnCambiarTexto = document.getElementById ("btnCambiarTexto");
const btnAlerta = document.getElementById ("btnAlerta");

// menu desplegable
btnMenu.addEventListener("click", function() {

   menu.classList.toggle ("oculto")

    // 4. Cambiamos el texto del botón
   if (menu.classList.contains("oculto")){
    btnMenu. textContent = "Cerrar Menu"
   }
});
 

// boton de alerta
btnAlerta.addEventListener("click" , function()
{
    alert ("¡hola, porfin funciona!");
});

//cambio de texto
btnCambiarTexto.addEventListener ("click", function()
{
  mensaje.textContent = "¡El mensaje ha sido cambiado con javascript!";
  btnCambiarTexto.textContent = "Texto Cambiado"
});

// cerrar o abrir el menu desplegable
window.addEventListener ("click" , function(event)
{ if (event.target !== btnMenu && !
    menu.contains(event.target)) {
        menu.classList.add ("oculto")
        btnMenu.textContent = "Abrir Menu";
    }
});

