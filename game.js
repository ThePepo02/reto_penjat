const CATEGORIAS = [
    {
        nombre: "Animales",
        palabras: ["ELEFANTE", "TIBURON", "RINOCERONTE"]
    },
    {
        nombre: "Naturaleza",
        palabras: ["ECOSISTEMA", "RECICLAJE", "BOSQUE"]
    },
    {
        nombre: "Ciencia",
        palabras: ["ALGORITMO", "VACUNA", "TELESCOPIO"]
    }
];

let estado = {
    nombreJugador: "",
    palabraActual: "",
    categoriaActual: "",
    letrasUsadas: [],
    errores:0
}



const btnJugar = document.getElementById("btn-jugar");
const inputNombre = document.getElementById("input-nombre");
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const displayCategoria = document.getElementById("display-categoria")


function iniciarJuego() {

    const indice = Math.floor(Math.random() * CATEGORIAS.length);
    const categoria = CATEGORIAS[indice];

    const indicePalabra = Math.floor(Math.random() * categoria.palabras.length);
    const palabra = categoria.palabras[indicePalabra];

    estado.palabraActual = palabra;
    estado.categoriaActual = categoria.nombre;

    displayCategoria.textContent = "Categoria: " + estado.categoriaActual;

    console.log("Categoria: " + estado.categoriaActual);
    console.log("Palabra: " + estado.palabraActual);

    dibujarMascara();
}


function dibujarMascara(){

    const contenedor = document.getElementById("mascara-palabra");

    contenedor.innerHTML = "";

    const letras = estado.palabraActual.split("")

    letras.forEach(function(letra){

        const span = document.createElement("span");

        if (estado.letrasUsadas.includes(letra)) {
            span.textContent = letra;
        } else {
            span.textContent = "_";
        }

        contenedor.appendChild(span);

    });

}



// Escuchar los click de los botones
btnJugar.addEventListener("click", function() {
const nombre = inputNombre.value;
console.log("El jugador se llama: " + nombre);
estado.nombreJugador = nombre;

iniciarJuego();

pantallaInicio.classList.remove("activa");
pantallaJuego.classList.add("activa");
})