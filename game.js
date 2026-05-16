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
    errores: 0
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
    generarTeclado();
}


function dibujarMascara() {

    const contenedor = document.getElementById("mascara-palabra");

    contenedor.innerHTML = "";

    const letras = estado.palabraActual.split("")

    letras.forEach(function (letra) {

        const span = document.createElement("span");

        if (estado.letrasUsadas.includes(letra)) {
            span.textContent = letra;
        } else {
            span.textContent = "_";
        }

        contenedor.appendChild(span);

    });

}

function generarTeclado() {

    const contenedor = document.getElementById("teclado");
    contenedor.innerHTML = "";

    //Le pasamaos el avecedario
    const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

    letras.forEach(function (letra) {

        const boton = document.createElement("button");
        boton.textContent = letra;
        boton.dataset.letra = letra;

        // Cuando se pulse este botón, elecionamos esa letra
        boton.addEventListener("click", function () {
            seleccionarLetra(letra);
        });

        contenedor.appendChild(boton)
    });
}

function seleccionarLetra(letra) {

    if (estado.letrasUsadas.includes(letra)) {
        return;
    }

    // Añadimos la letra a las usadas
    estado.letrasUsadas.push(letra);

    const boton = document.querySelector("[data-letra='" + letra + "']");
    boton.disabled = true;

    if (estado.palabraActual.includes(letra)) {
        console.log("Acierto! La letra " + letra + " está en la palabra");
    } else {
        console.log("Error! La letra " + letra + " no está en la palabra");
        estado.errores++;
    }

    dibujarMascara();
    comprobarFin();
}

function comprobarFin() {

    const todasAdivinadas = estado.palabraActual.split("").every(function (letra) {
        return estado.letrasUsadas.includes(letra);
    });

    if (todasAdivinadas) {
        console.log("!GANASTE¡")
        mostrarFin(true);
        return;
    }

    if (estado.errores >= 6) {
        console.log("¡PERDISTE! La palabra era: " + estado.palabraActual);
        mostrarFin(false);
    }

}

function mostrarFin(ganado) {
    const pantallaFin = document.getElementById("pantalla-fin")
    const finResultado = document.getElementById("fin-resultado");

    if (ganado) {
        finResultado.textContent = "!Ganaste¡"
    } else {
        finResultado.textContent = "!Perdiste¡ Era: " + estado.palabraActual;
    }

    pantallaJuego.classList.remove("activa");
    pantallaFin.classList.add("activa")
}



// Escuchar los click de los botones
btnJugar.addEventListener("click", function () {
    const nombre = inputNombre.value;
    console.log("El jugador se llama: " + nombre);
    estado.nombreJugador = nombre;

    iniciarJuego();

    pantallaInicio.classList.remove("activa");
    pantallaJuego.classList.add("activa");

});

const btnReiniciar = document.getElementById("btn-reiniciar");

btnReiniciar.addEventListener("click", function () {

    //resetear el estado
    estado.letrasUsadas = [];
    estado.errores = 0;
    estado.palabraActual = "";
    estado.categoriaActual = "";


    // Limpiar el teclado y la mascara
    document.getElementById("teclado").innerHTML = "";
    document.getElementById("mascara-palabra").innerHTML = "";

    // Volvemos a la pantalla de inicio
    document.getElementById("pantalla-fin").classList.remove("activa");
    pantallaInicio.classList.add("activa");
})