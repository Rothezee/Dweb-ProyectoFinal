class Tour {
  constructor(options) {
    // Elementos
    this.entrar = document.getElementById(options.entrarId || "entrar");
    this.asador = document.getElementById(options.asadorId || "asador");
    this.volver = document.getElementById(options.volverId || "volver-btn");
    this.cocinaBtn = document.getElementById(options.cocinaId || "cocina-btn");
    this.habitacion1Btn = document.getElementById(options.hab1Id || "habitacion1-btn");
    this.habitacion2Btn = document.getElementById(options.hab2Id || "habitacion2-btn");
    this.tocadorBtn = document.getElementById(options.tocadorId || "tocador-btn");
    this.banoBtn = document.getElementById(options.banoId || "bano-btn");
    this.tourImage = document.getElementById(options.imagenId || "tour-image");

    // Configuración de destinos
    this.destinos = options.destinos;
    this.imagenOriginal = options.destinos.inicio;
    this.historyStack = ["inicio"];

    // Mapeo de botones para ocultar/mostrar fácilmente
    this.todosLosBotones = [
      this.entrar,
      this.asador,
      this.cocinaBtn,
      this.habitacion1Btn,
      this.habitacion2Btn,
      this.tocadorBtn,
      this.banoBtn,
      this.volver
    ];

    // Asignación de eventos
    this._asignarEventos();

    // Inicialización
    window.addEventListener("DOMContentLoaded", () => this.iniciarTour());
  }

  ocultarTodos() {
    this.todosLosBotones.forEach(btn => {
      if (btn) {
        btn.style.display = "none";
        btn.classList.add("hide");
      }
    });
  }

  mostrarBtns(btns) {
    btns.forEach(btn => {
      if (btn) {
        btn.style.display = "block";
        setTimeout(() => btn.classList.remove("hide"), 20);
      }
    });
  }

  cambiarImagenYBotones(destino, botonesAMostrar = []) {
    // Agrega el destino al historial si es diferente al actual
    if (this.historyStack[this.historyStack.length - 1] !== destino) {
      this.historyStack.push(destino);
    }

    // Animación
    this.tourImage.classList.remove("tour-zoom-in", "tour-zoom-out");
    void this.tourImage.offsetWidth;
    this.tourImage.classList.add("tour-zoom-in");

    this.ocultarTodos();

    setTimeout(() => {
      this.tourImage.src = this.destinos[destino].src;
      this.tourImage.alt = this.destinos[destino].alt;
      this.tourImage.classList.remove("tour-zoom-in");
      this.mostrarBtns([this.volver, ...botonesAMostrar]);
    }, 700);
  }

  volverAlAnterior() {
    if (this.historyStack.length > 1) {
      // Quitar el actual
      this.historyStack.pop();
      const anterior = this.historyStack[this.historyStack.length - 1];

      this.tourImage.classList.remove("tour-zoom-in", "tour-zoom-out");
      void this.tourImage.offsetWidth;
      this.tourImage.classList.add("tour-zoom-out");
      this.ocultarTodos();

      setTimeout(() => {
        this.tourImage.src = this.destinos[anterior].src;
        this.tourImage.alt = this.destinos[anterior].alt;
        this.tourImage.classList.remove("tour-zoom-out");

        // Mostrar los botones correctos según el destino anterior
        if (anterior === "inicio") {
          this.mostrarBtns([this.entrar, this.asador]);
        } else if (anterior === "entrar") {
          this.mostrarBtns([this.volver, this.cocinaBtn]);
        } else if (anterior === "asador") {
          this.mostrarBtns([this.volver]);
        } else if (anterior === "cocina") {
          this.mostrarBtns([this.volver, this.habitacion1Btn, this.habitacion2Btn, this.tocadorBtn]);
        } else if (anterior === "habitacion1" || anterior === "habitacion2") {
          this.mostrarBtns([this.volver]);
        } else if (anterior === "tocador") {
          this.mostrarBtns([this.volver, this.banoBtn]);
        } else if (anterior === "bano") {
          this.mostrarBtns([this.volver]);
        }
      }, 700);
    }
  }

  iniciarTour() {
    this.historyStack = ["inicio"];
    this.ocultarTodos();
    this.mostrarBtns([this.entrar, this.asador]);
    this.tourImage.src = this.imagenOriginal.src;
    this.tourImage.alt = this.imagenOriginal.alt;
  }

  _asignarEventos() {
    // Entrar muestra cocina
    if (this.entrar)
      this.entrar.addEventListener("click", () => this.cambiarImagenYBotones("entrar", [this.cocinaBtn]));
    // Asador solo muestra volver
    if (this.asador)
      this.asador.addEventListener("click", () => this.cambiarImagenYBotones("asador", []));
    // Cocina muestra habitaciones y tocador
    if (this.cocinaBtn)
      this.cocinaBtn.addEventListener("click", () => this.cambiarImagenYBotones("cocina", [this.habitacion1Btn, this.habitacion2Btn, this.tocadorBtn]));
    // Habitaciones solo muestran volver
    if (this.habitacion1Btn)
      this.habitacion1Btn.addEventListener("click", () => this.cambiarImagenYBotones("habitacion1", []));
    if (this.habitacion2Btn)
      this.habitacion2Btn.addEventListener("click", () => this.cambiarImagenYBotones("habitacion2", []));
    // Tocador muestra baño
    if (this.tocadorBtn)
      this.tocadorBtn.addEventListener("click", () => this.cambiarImagenYBotones("tocador", [this.banoBtn]));
    // Baño solo muestra volver
    if (this.banoBtn)
      this.banoBtn.addEventListener("click", () => this.cambiarImagenYBotones("bano", []));
    // Volver vuelve al estado anterior del historial
    if (this.volver)
      this.volver.addEventListener("click", () => this.volverAlAnterior());
  }
}
