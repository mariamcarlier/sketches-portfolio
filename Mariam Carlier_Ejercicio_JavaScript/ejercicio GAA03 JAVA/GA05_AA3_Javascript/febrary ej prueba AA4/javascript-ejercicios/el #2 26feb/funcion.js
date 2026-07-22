const tarjetas = document.querySelectorAll(".tarjeta");
const parrafos = document.querySelectorAll(".parrafo");

function OnScroll(){
    tarjetas.forEach(tarjeta => {
        const rect = tarjeta.getBoundingClientRect();
        if (rect.top <window.innerHeight)
            tarjeta.classList.add ("visible");
    });
    parrafos.forEach(p => {
        const rect = tarjeta.getBoundingClientRect();
        if (rect.top <window.innerHeight)
            p.classList.add ("visible");
    });
}

window.addEventListener("scroll", OnScroll);