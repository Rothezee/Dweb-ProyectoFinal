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
  "entrar": {
    src: "assets/imagenes/Tour/entrada.png",
    alt: "Interior de la cabaña"
  },
  "asador": {
    src: "assets/imagenes/Tour/asador.png",
    alt: "Vista del asador"
  },
  "cocina": {
    src: "assets/imagenes/Tour/cocina.png",
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

// Utilidad para ocultar todos los botones de paso
function ocultarPasos() {
  cocinaBtn.style.display = "none";
  habitacion1Btn.style.display = "none";
  habitacion2Btn.style.display = "none";
  cocinaBtn.classList.add("hide");
  habitacion1Btn.classList.add("hide");
  habitacion2Btn.classList.add("hide");
}

// Función genérica para cambiar de imagen y mostrar los botones indicados
function cambiarImagenYBotones(destino, botonesAMostrar = []) {
  tourImage.classList.remove("tour-zoom-out", "tour-zoom-in");
  ocultarPasos();
  tourBtns.forEach(btn => btn.classList.add("hide"));
  volver.classList.add("hide");
  volver.style.display = "none";

  // Zoom in animado
  void tourImage.offsetWidth;
  tourImage.classList.add("tour-zoom-in");

  setTimeout(() => {
    tourImage.src = destinos[destino].src;
    tourImage.alt = destinos[destino].alt;
    tourImage.classList.remove("tour-zoom-in");

    volver.style.display = "block";
    setTimeout(() => volver.classList.remove("hide"), 20);

    botonesAMostrar.forEach(btn => {
      btn.style.display = "block";
      setTimeout(() => btn.classList.remove("hide"), 20);
    });
  }, 700);
}

// Eventos de los botones de inicio
entrar.addEventListener("click", () => cambiarImagenYBotones("entrar", [cocinaBtn]));
asador.addEventListener("click", () => cambiarImagenYBotones("asador", []));

// Volver al inicio (restaura todo)
volver.addEventListener("click", () => {
  ocultarPasos();
  volver.classList.add("hide");
  tourImage.classList.remove("tour-zoom-in", "tour-zoom-out");
  void tourImage.offsetWidth;
  tourImage.classList.add("tour-zoom-out");

  setTimeout(() => {
    tourImage.src = imagenOriginal.src;
    tourImage.alt = imagenOriginal.alt;
    tourImage.classList.remove("tour-zoom-out");
    tourBtns.forEach(btn => {
      btn.style.display = "block";
      btn.classList.remove("hide");
    });
    volver.style.display = "none";
  }, 700);
});

// Ver cocina
cocinaBtn.addEventListener("click", () => cambiarImagenYBotones("cocina", [habitacion1Btn, habitacion2Btn]));

// Habitaciones
habitacion1Btn.addEventListener("click", () => cambiarImagenYBotones("habitacion1", [habitacion1Btn, habitacion2Btn]));
habitacion2Btn.addEventListener("click", () => cambiarImagenYBotones("habitacion2", [habitacion1Btn, habitacion2Btn]));