class Tour {
  constructor(options) {
    this.destinos = options.destinos;
    this.imagenOriginal = options.destinos.inicio;
    this.historyStack = ["inicio"];
    const idsBotones = {
      entrar: "entrar",
      asador: "asador",
      cocina: "cocina-btn",
      habitacion1: "habitacion1-btn",
      habitacion2: "habitacion2-btn",
      habitacion3: "habitacion3-btn",
      tocador: "tocador-btn",
      bano: "bano-btn",
      bano2: "bano2-btn",
      balcon: "balcon-btn",
      volver: "volver-btn"
    };
    this.botones = {};
    for (const [clave, id] of Object.entries(idsBotones)) {
      this.botones[clave] = document.getElementById(id);
    }
    this.tourImage = document.getElementById(options.imagenId || "tour-image");
    this.todosLosBotones = Object.values(this.botones).filter(Boolean);
    this._asignarEventos();
    window.addEventListener("DOMContentLoaded", () => this.iniciarTour());
  }

  ocultarTodos() {
    this.todosLosBotones.forEach(btn => {
      btn.style.display = "none";
      btn.classList.add("hide");
    });
  }

  mostrarBtns(btns) {
    btns.forEach(btn => {
      btn.style.display = "block";
      setTimeout(() => btn.classList.remove("hide"), 20);
    });
  }

  cambiarImagenYBotones(destino, botonesAMostrar = [], botonClickeado = null) {
    // Zoom hacia el botón
    if (botonClickeado && this.tourImage) {
      const container = this.tourImage.parentElement;
      const rectCont = container.getBoundingClientRect();
      const rectBtn = botonClickeado.getBoundingClientRect();
      const x = ((rectBtn.left + rectBtn.width / 2) - rectCont.left) / rectCont.width * 100;
      const y = ((rectBtn.top + rectBtn.height / 2) - rectCont.top) / rectCont.height * 100;
      this.tourImage.style.transformOrigin = `${x}% ${y}%`;
    } else if (this.tourImage) {
      this.tourImage.style.transformOrigin = "50% 50%";
    }
    if (this.historyStack[this.historyStack.length - 1] !== destino) {
      this.historyStack.push(destino);
    }
    this.tourImage.classList.remove("tour-zoom-in", "tour-zoom-out");
    void this.tourImage.offsetWidth;
    this.tourImage.classList.add("tour-zoom-in");
    this.ocultarTodos();
    setTimeout(() => {
      this.tourImage.src = this.destinos[destino].src;
      this.tourImage.alt = this.destinos[destino].alt;
      this.tourImage.classList.remove("tour-zoom-in");
      this.mostrarBtns([this.botones.volver, ...botonesAMostrar.filter(Boolean)]);
      this.tourImage.style.transformOrigin = "50% 50%";
    }, 700);
  }

  volverAlAnterior() {
    if (this.historyStack.length > 1) {
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
        let botonesMostrar = [];
        if (anterior === "inicio") {
          if (this.botones.entrar) botonesMostrar.push(this.botones.entrar);
          if (this.botones.asador) botonesMostrar.push(this.botones.asador);
        } else if (anterior === "entrar") {
          if (this.botones.volver) botonesMostrar.push(this.botones.volver);
          if (this.botones.cocina) botonesMostrar.push(this.botones.cocina);
          if (this.botones.asador) botonesMostrar.push(this.botones.asador);
          if (this.botones.habitacion3) botonesMostrar.push(this.botones.habitacion3);
          if (this.botones.balcon) botonesMostrar.push(this.botones.balcon);
        } else if (anterior === "asador") {
          if (this.botones.volver) botonesMostrar.push(this.botones.volver);
        } else if (anterior === "cocina") {
          if (this.botones.volver) botonesMostrar.push(this.botones.volver);
          if (this.botones.habitacion1) botonesMostrar.push(this.botones.habitacion1);
          if (this.botones.habitacion2) botonesMostrar.push(this.botones.habitacion2);
          if (this.botones.habitacion3) botonesMostrar.push(this.botones.habitacion3);
          if (this.botones.tocador) botonesMostrar.push(this.botones.tocador);
        } else if (anterior === "habitacion1" || anterior === "habitacion2") {
          if (this.botones.volver) botonesMostrar.push(this.botones.volver);
        } else if (anterior === "habitacion3") {
          if (this.botones.volver) botonesMostrar.push(this.botones.volver);
          if (this.botones.bano2) botonesMostrar.push(this.botones.bano2);
          if (this.botones.balcon) botonesMostrar.push(this.botones.balcon);
        } else if (anterior === "tocador") {
          if (this.botones.volver) botonesMostrar.push(this.botones.volver);
          if (this.botones.bano) botonesMostrar.push(this.botones.bano);
        } else if (anterior === "bano" || anterior === "bano2" || anterior === "balcon") {
          if (this.botones.volver) botonesMostrar.push(this.botones.volver);
        }
        this.mostrarBtns(botonesMostrar.filter(Boolean));
        this.tourImage.style.transformOrigin = "50% 50%";
      }, 700);
    }
  }

  iniciarTour() {
    this.historyStack = ["inicio"];
    this.ocultarTodos();
    const iniciarBtns = [];
    if (this.botones.entrar) iniciarBtns.push(this.botones.entrar);
    if (this.botones.asador) iniciarBtns.push(this.botones.asador);
    this.mostrarBtns(iniciarBtns);
    this.tourImage.src = this.imagenOriginal.src;
    this.tourImage.alt = this.imagenOriginal.alt;
    this.tourImage.style.transformOrigin = "50% 50%";
  }

  _asignarEventos() {
    if (this.botones.entrar)
      this.botones.entrar.addEventListener("click", e =>
        this.cambiarImagenYBotones(
          "entrar",
          [
            this.botones.cocina,
            this.botones.habitacion3,
            this.botones.balcon
          ],
          e.currentTarget
        )
      );
    if (this.botones.asador)
      this.botones.asador.addEventListener("click", e => this.cambiarImagenYBotones("asador", [], e.currentTarget));
    if (this.botones.cocina)
      this.botones.cocina.addEventListener("click", e =>
        this.cambiarImagenYBotones(
          "cocina",
          [
            this.botones.habitacion1,
            this.botones.habitacion2,
            this.botones.habitacion3,
            this.botones.tocador
          ],
          e.currentTarget
        )
      );
    if (this.botones.habitacion1)
      this.botones.habitacion1.addEventListener("click", e => this.cambiarImagenYBotones("habitacion1", [], e.currentTarget));
    if (this.botones.habitacion2)
      this.botones.habitacion2.addEventListener("click", e => this.cambiarImagenYBotones("habitacion2", [], e.currentTarget));
    if (this.botones.habitacion3)
      this.botones.habitacion3.addEventListener("click", e =>
        this.cambiarImagenYBotones(
          "habitacion3",
          [this.botones.bano2],
          e.currentTarget
        )
      );
    if (this.botones.tocador)
      this.botones.tocador.addEventListener("click", e => this.cambiarImagenYBotones("tocador", [this.botones.bano], e.currentTarget));
    if (this.botones.bano)
      this.botones.bano.addEventListener("click", e => this.cambiarImagenYBotones("bano", [], e.currentTarget));
    if (this.botones.bano2)
      this.botones.bano2.addEventListener("click", e => this.cambiarImagenYBotones("bano2", [], e.currentTarget));
    if (this.botones.balcon)
      this.botones.balcon.addEventListener("click", e => this.cambiarImagenYBotones("balcon", [], e.currentTarget));
    if (this.botones.volver)
      this.botones.volver.addEventListener("click", () => this.volverAlAnterior());
  }
}
