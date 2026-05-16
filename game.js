const btnJugar = document.getElementById("btn-jugar");
const inputNombre = document.getElementById("input-nombre");
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");

// Escuchar los click de los botones
btnJugar.addEventListener("click", function() {

const nombre = inputNombre.value;
console.log("El jugador se llama: " + nombre);

pantallaInicio.classList.remove("activa");

pantallaJuego.classList.add("activa");



})