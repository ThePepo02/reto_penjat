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
    errores: 0,
    tiempoSegundos: 0
}

let intervalo = null; // guardar el temporizador


const btnJugar = document.getElementById("btn-jugar");
const inputNombre = document.getElementById("input-nombre");
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const displayCategoria = document.getElementById("display-categoria")
const displayErrores = document.getElementById("display-errores")
const btnReiniciar = document.getElementById("btn-reiniciar");


function iniciarJuego() {

    const indice = Math.floor(Math.random() * CATEGORIAS.length);
    const categoria = CATEGORIAS[indice];

    const indicePalabra = Math.floor(Math.random() * categoria.palabras.length);
    const palabra = categoria.palabras[indicePalabra];

    estado.palabraActual = palabra;
    estado.categoriaActual = categoria.nombre;

    displayCategoria.textContent = "Categoria: " + estado.categoriaActual;
    displayErrores.textContent = "Errores: 0 / 6";

    console.log("Categoria: " + estado.categoriaActual);
    console.log("Palabra: " + estado.palabraActual);


    dibujarMascara();
    generarTeclado();
    dibujarAhorcado();
    guardarEstado();
    iniciarTimer();
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

function dibujarAhorcado() {

    for (let i = 0; i < 6; i++) {
        const parte = document.getElementById("parte-" + i)
        if (i < estado.errores) {
            parte.style.display = "block";
        } else {
            parte.style.display = "none";
        }
    }
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
        displayErrores.textContent = "Errores: " + estado.errores + " / 6"
    }

    dibujarMascara();
    dibujarAhorcado();
    guardarEstado();
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
    pararTimer();
    const pantallaFin = document.getElementById("pantalla-fin")
    const finResultado = document.getElementById("fin-resultado");

    if (ganado) {
        finResultado.textContent = "!Ganaste¡"
        guardarEnRanking();
    } else {
        finResultado.textContent = "!Perdiste¡ Era: " + estado.palabraActual;
    }

    mostrarRanking();

    pantallaJuego.classList.remove("activa");
    pantallaFin.classList.add("activa")
}



// PARTE: localStorage

function guardarEstado() {
    // convertir el objeto estado a texto
    localStorage.setItem("ahorcado_estado", JSON.stringify(estado));
}

function cargarEstado() {

    //Leemos el texto guardado
    const datos = localStorage.getItem("ahorcado_estado");

    if (datos === null) {
        return null;
    }
    // Convertimos el texto de vuelta a objeto y lo devolvemos
    return JSON.parse(datos);
}

function iniciarTimer() {
    // Nos asegura de que no hay otro timer corriendo
    clearInterval(intervalo);

    // Cada 1000ms (1 segundo) ejecutamos esto:
    intervalo = setInterval(function() {
        estado.tiempoSegundos++;
        document.getElementById("display-tiempo").textContent = "Tiempo: " + estado.tiempoSegundos + "s";
        guardarEstado();
    }, 1000);
}

function pararTimer() {
    clearInterval(intervalo);
    intervalo = null; 
}


function guardarEnRanking() {
    // Solo guardamos quien gano
    const clave = "ranking_" + estado.palabraActual
    const entrada = {
        nombre: estado.nombreJugador,
        tiempo: estado.tiempoSegundos,
        errores: estado.errores
    };

    // Cargamos el ranking actual de esta palabra
    const datos = localStorage.getItem(clave);
    let ranking = datos ? JSON.parse(datos) : [];

    // Añadimos la nueva entrada
    ranking.push(entrada);

    // Ordenamos: menos errores primero, empate menos tiempo
    ranking.sort(function(a, b){
        if (a.errores !== b.errores){
            return a.errores - b.errores;
        }
        return a.tiempo - b.tiempo;
    });

    // Solo guardamos el Top 3
    ranking = ranking.slice(0, 3);

    localStorage.setItem(clave, JSON.stringify(ranking));
}



function mostrarRanking(){
    const clave = "ranking_" + estado.palabraActual;
    const datos = localStorage.getItem(clave);
    const ranking = datos ? JSON.parse(datos) : [];


    const contenedor = document.getElementById("fin-resultado");
    let html = contenedor.innerHTML + "<br><br>🏆 TOP 3 - " + estado.palabraActual + "<br>";

    if (ranking.length === 0){
        html += "Sin registro aun";
    } else {
        const medallas = ["🥇", "🥈", "🥉"];
        ranking.forEach(function(entrada, indice){
            html += medallas[indice] + " " + entrada.nombre +
            " -- " + entrada.errores + " errores, " + entrada.tiempo + "s<br>";
        });
    }

    contenedor.innerHTML = html;
}


// EVENTOS

// Escuchar los click de los botones
btnJugar.addEventListener("click", function () {
    const nombre = inputNombre.value;
    console.log("El jugador se llama: " + nombre);
    estado.nombreJugador = nombre;

    iniciarJuego();

    pantallaInicio.classList.remove("activa");
    pantallaJuego.classList.add("activa");
});


btnReiniciar.addEventListener("click", function () {

    //resetear el estado
    estado.letrasUsadas = [];
    estado.errores = 0;
    estado.palabraActual = "";
    estado.categoriaActual = "";
    estado.tiempoSegundos = 0;


    // Limpiar el teclado y la mascara
    document.getElementById("teclado").innerHTML = "";
    document.getElementById("mascara-palabra").innerHTML = "";

    localStorage.removeItem("ahorcado_estado");

    // Volvemos a la pantalla de inicio
    document.getElementById("pantalla-fin").classList.remove("activa");
    pantallaInicio.classList.add("activa");
});


// Arranque: Comprobar si hay partida guardada
const estadoGuardado = cargarEstado();

if (estadoGuardado !== null) {
    //  Habia una partida guardada - la restauramos
    estado = estadoGuardado;
    estado.tiempoSegundos = Number(estado.tiempoSegundos);

    //Mostramos la pantalla de juego directamente
    pantallaInicio.classList.remove("activa");
    pantallaJuego.classList.add("activa");


    //Redibujamos todo con el estado guardado
    displayCategoria.textContent = "Categoria: " + estado.categoriaActual;
    displayErrores.textContent = "Errores: " + estado.errores + " / 6";
    dibujarMascara();
    generarTeclado();
    dibujarAhorcado();
    iniciarTimer();
}