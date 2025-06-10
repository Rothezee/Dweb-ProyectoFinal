const entrar = document.getElementById("entrar");
const asador = document.getElementById("asador");
const volver = document.getElementById("volver-btn");
const cocinaBtn = document.getElementById("cocina-btn");
const habitacion1Btn = document.getElementById("habitacion1-btn");
const habitacion2Btn = document.getElementById("habitacion2-btn");
const tourImage = document.getElementById("tour-image");
const tourBtns = [entrar, asador];

const imagenOriginal = {
  src: "assets/imagenes/Tour/frente.png",
  alt: "Frente de la cabaña"
};

const destinos = {
  "inicio": imagenOriginal,
  "entrar": {
    src: "assets/imagenes/Tour/entrada.webp",
    alt: "Interior de la cabaña"
  },
  "asador": {
    src: "assets/imagenes/Tour/asador.png",
    alt: "Vista del asador"
  },
  "cocina": {
    src: "assets/imagenes/Tour/cocina.webp",
    alt: "Cocina de la cabaña"
  },
  "habitacion1": {
    src: "assets/imagenes/Tour/habitacion1.png",
    alt: "Habitación 1"
  },
  "habitacion2": {
    src: "assets/imagenes/Tour/habitacion2.png",
    alt: "Habitación 2"
  }
};

let historyStack = ["inicio"]; // Guarda el historial de navegación

function ocultarTodos() {
  [entrar, asador, cocinaBtn, habitacion1Btn, habitacion2Btn, volver].forEach(btn => {
    btn.style.display = "none";
    btn.classList.add("hide");
  });
}

function mostrarBtns(btns) {
  btns.forEach(btn => {
    btn.style.display = "block";
    setTimeout(() => btn.classList.remove("hide"), 20);
  });
}

function cambiarImagenYBotones(destino, botonesAMostrar = []) {
  // Agrega el destino al historial si es diferente al actual
  if (historyStack[historyStack.length - 1] !== destino) {
    historyStack.push(destino);
  }

  // Animación
  tourImage.classList.remove("tour-zoom-in", "tour-zoom-out");
  void tourImage.offsetWidth;
  tourImage.classList.add("tour-zoom-in");

  ocultarTodos();

  setTimeout(() => {
    tourImage.src = destinos[destino].src;
    tourImage.alt = destinos[destino].alt;
    tourImage.classList.remove("tour-zoom-in");
    mostrarBtns([volver, ...botonesAMostrar]);
  }, 700);
}

// Entrar muestra cocina
entrar.addEventListener("click", () => cambiarImagenYBotones("entrar", [cocinaBtn]));
// Asador solo muestra volver
asador.addEventListener("click", () => cambiarImagenYBotones("asador", []));
// Cocina muestra habitaciones
cocinaBtn.addEventListener("click", () => cambiarImagenYBotones("cocina", [habitacion1Btn, habitacion2Btn]));
// Habitaciones permiten navegar entre sí
habitacion1Btn.addEventListener("click", () => cambiarImagenYBotones("habitacion1", [habitacion1Btn, habitacion2Btn]));
habitacion2Btn.addEventListener("click", () => cambiarImagenYBotones("habitacion2", [habitacion1Btn, habitacion2Btn]));

// Volver vuelve al estado anterior del historial
volver.addEventListener("click", () => {
  if (historyStack.length > 1) {
    // Quitar el actual
    historyStack.pop();
    const anterior = historyStack[historyStack.length - 1];

    tourImage.classList.remove("tour-zoom-in", "tour-zoom-out");
    void tourImage.offsetWidth;
    tourImage.classList.add("tour-zoom-out");
    ocultarTodos();

    setTimeout(() => {
      tourImage.src = destinos[anterior].src;
      tourImage.alt = destinos[anterior].alt;
      tourImage.classList.remove("tour-zoom-out");

      // Mostrar los botones correctos según el destino anterior
      if (anterior === "inicio") {
        mostrarBtns([entrar, asador]);
      } else if (anterior === "entrar") {
        mostrarBtns([volver, cocinaBtn]);
      } else if (anterior === "asador") {
        mostrarBtns([volver]);
      } else if (anterior === "cocina") {
        mostrarBtns([volver, habitacion1Btn, habitacion2Btn]);
      } else if (anterior === "habitacion1" || anterior === "habitacion2") {
        mostrarBtns([volver, habitacion1Btn, habitacion2Btn]);
      }
    }, 700);
  }
});

// Al cargar la página, mostrar solo los botones de inicio y reiniciar historial
window.addEventListener("DOMContentLoaded", () => {
  historyStack = ["inicio"];
  ocultarTodos();
  mostrarBtns([entrar, asador]);
});