// Validación de Formularios
(() => {
  'use strict'

  // Encuentra todos los formularios con clase needs-validation
  const forms = document.querySelectorAll('.needs-validation')

  // Verifica si son Validos
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {      // verifica si el formulario es válido
        event.preventDefault()          // si NO es válido, evita el envío
        event.stopPropagation()         // detiene la propagación del evento
      }

      form.classList.add('was-validated')  // agrega clase de Bootstrap para mostrar errores
    }, false)
  })
})()



// ========== GESTIÓN DE DATOS DE CABAÑAS ==========

let cabins = []// Array que guarda todas las cabañas

// Función para cargar los datos de las cabañas desde un archivo JSON
function createObjectCab(){
  
  return fetch('cardCabins.json')// Realiza una petición al archivo 'cardCabins.json'
    .then(res => res.json()) // Convierte la respuesta a formato JSON
    .then(res => {
      // Limpia el array de cabañas antes de llenarlo
      cabins = [];
      
      // Recorre cada cabaña del JSON y crea un objeto estructurado
      res.forEach(c =>{
        cabins.push({
          id: c.id,                             // ID único de la cabaña
          title: c.title,                       // Nombre de la cabaña
          price: c.price,                       // Precio por noche
          shortDescription: c.shortDescription, // Descripción corta
          description: c.description,           // Descripción completa
          image: c.image,                       // Array de imágenes
          capacity: c.capacity,                 // Capacidad máxima de huéspedes
          features: c.features,                 // Lista de características/servicios
        });
      });
    });
}

// ========== CREACIÓN DE TARJETAS DE CABAÑAS ==========

// Función que genera las tarjetas HTML de todas las cabañas
function createCabinsCards(){
  
  const card = document.getElementById('container-card');// Obtiene el contenedor donde se mostrarán las tarjetas
  card.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas tarjetas
  
  // Recorre cada cabaña y genera su tarjeta HTML
  cabins.forEach(cabin => {
    card.innerHTML += 
    `<div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="row g-0">
            <!-- Sección de imagen -->
            <div class="col-md-6 col-lg-12 position-relative">
              <!-- Etiqueta de precio superpuesta en la imagen -->
              <span class="price-tag">$${cabin.price}/noche</span>
              <!-- Primera imagen de la cabaña -->
              <img src=${cabin.image[0]} class="card-img-top" alt=${cabin.title} />
            </div>
            <!-- Sección de información -->
            <div class="col-md-6 col-lg-12">
              <div class="card-body p-3">
                <!-- Título que incluye nombre, ID y descripción corta -->
                <h5>${cabin.title} N°${cabin.id} – ${cabin.shortDescription}</h5>
                <!-- Descripción completa -->
                <p>${cabin.description}</p>
                <!-- Botón que abre modal con más detalles -->
                <button class="btn btn-warning w-100" 
                        data-bs-toggle="modal" 
                        data-bs-target="#cabinModal"
                        onclick='fillModal(${JSON.stringify(cabin)})'>Ver Más</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// ========== GESTIÓN DEL MODAL DE DETALLES ==========

// Variable para manejar el carrusel del modal
let modalCarrusel = {
  imagenes: [],
  index: 0
};

// Función que llena el modal con los datos de la cabaña seleccionada
function fillModal(cabin) {
  // Actualiza el título del modal
  document.getElementById('cabinModalLabel').innerHTML = cabin.title+": N°"+cabin.id;
  
  // Actualiza la descripción corta
  document.getElementById('modal-shortDescription').innerHTML = cabin.shortDescription;
  
  // ========== CONFIGURACIÓN DEL CARRUSEL DEL MODAL ==========
  const carruselContainer = document.getElementById('galeria');
  
  if (carruselContainer && cabin.image && cabin.image.length > 0) {
    // Configurar el carrusel del modal
    modalCarrusel.imagenes = cabin.image;
    modalCarrusel.index = 0;
    
    // Actualizar nombres y descripciones en todos los elementos
    const nombres = carruselContainer.querySelectorAll('.name');
    const descripciones = carruselContainer.querySelectorAll('.description');
    
    nombres.forEach(nombre => {
      nombre.textContent = cabin.title;
    });
    
    descripciones.forEach(desc => {
      desc.textContent = cabin.shortDescription;
    });
    
    // Actualizar las imágenes del carrusel
    actualizarImagenesCarruselModal();
    
    // Configurar eventos de los botones (solo una vez)
    configurarEventosCarruselModal();
  }
  
  // Actualiza el precio
  document.getElementById('modal-price').innerHTML = `$${cabin.price} / noche`;
  
  // Actualiza la capacidad
  document.getElementById('modal-capacity').innerHTML = `<b>Capacidad:</b> ${cabin.capacity}`;
  
  // Actualiza la descripción completa
  document.getElementById('modal-description').innerHTML = cabin.description;

  // ========== GESTIÓN DEL FORMULARIO DE RESERVA ==========
  // Guarda el ID de la cabaña en un campo oculto del formulario
  document.getElementById("R_IdCabaña").value = "Cabaña: "+cabin.id;

  // ========== CONFIGURACIÓN DEL SELECT DE HUÉSPEDES ==========
  
  // Configura las opciones de cantidad de huéspedes según la cabaña
  let huespedes = document.getElementById("R_huespedes");
  huespedes.innerHTML = `<option value="" disabled selected>Seleccione cantidad</option>`;
  huespedes.innerHTML += `<option value="1">1 huésped</option>`
  
  // Determina la capacidad máxima según el ID de la cabaña
  let max = 0;
  if(cabin.id=="1" || cabin.id=="2"){
    max = 3; // Cabañas 1 y 2: máximo 3 huéspedes
  }else{
    if(cabin.id=="4" || cabin.id=="5"){
      max = 5; // Cabañas 4 y 5: máximo 5 huéspedes
    }else{
      max = 6; // Otras cabañas: máximo 6 huéspedes
    }
  }
  
  // Genera las opciones del 2 hasta el máximo
  for(let j = 2; j<=max; j++){
    huespedes.innerHTML += `<option value="${j}">${j} huéspedes</option>`
  }

  // ========== CONFIGURACIÓN DE FECHAS ==========
  // Obtiene los campos de fecha
  let fechaEntrada = document.getElementById("R_fechaEntrada");
  let fechaSalida = document.getElementById("R_fechaSalida");
  let hoy = new Date();
  
  // Establece la fecha mínima como hoy (no se puede reservar en el pasado)
  fechaEntrada.min = hoy.toISOString().split("T")[0]; // Formato: aaaa-mm-dd
  fechaSalida.min = hoy.toISOString().split("T")[0];

  // ========== MOSTRAR CARACTERÍSTICAS DE LA CABAÑA ==========
  const modalFeatures = document.getElementById('modal-features');
  modalFeatures.innerHTML = ''; // Limpia la lista anterior

  // Agrega cada característica como un elemento de lista
  cabin.features.forEach(feature => {
    modalFeatures.innerHTML += `<li>${feature}</li>`;
  }); 
}

// ========== FUNCIONES DEL CARRUSEL DEL MODAL ==========

// Función para actualizar las imágenes del carrusel del modal
function actualizarImagenesCarruselModal() {
  const container = document.getElementById('galeria');
  const items = container.querySelectorAll('.itemG');
  
  if (!modalCarrusel.imagenes.length) return;

  // Aplicar imagen a cada elemento del carrusel
  items.forEach((item, i) => {
    const imageIndex = (modalCarrusel.index + i) % modalCarrusel.imagenes.length;
    item.style.backgroundImage = `url('${modalCarrusel.imagenes[imageIndex]}')`;
    item.style.backgroundSize = "cover";
    item.style.backgroundPosition = "center";
  });
}

// Variable para evitar agregar eventos múltiples veces
let eventosCarruselModalConfigurados = false;

// Función para configurar los eventos del carrusel del modal
function configurarEventosCarruselModal() {
  if (eventosCarruselModalConfigurados) return;
  
  const container = document.getElementById('galeria');
  const nextBtn = container.querySelector('.nextG');
  const prevBtn = container.querySelector('.prevG');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const items = container.querySelectorAll('.itemG');
      container.querySelector('.slideG').appendChild(items[0]);
      
      modalCarrusel.index = (modalCarrusel.index + 1) % modalCarrusel.imagenes.length;
      actualizarImagenesCarruselModal();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const items = container.querySelectorAll('.itemG');
      container.querySelector('.slideG').prepend(items[items.length - 1]);
      
      modalCarrusel.index = (modalCarrusel.index - 1 + modalCarrusel.imagenes.length) % modalCarrusel.imagenes.length;
      actualizarImagenesCarruselModal();
    });
  }
  
  eventosCarruselModalConfigurados = true;
}

// ========== VALIDACIÓN DE FECHAS ==========
// Función que actualiza la fecha mínima de salida basada en la fecha de entrada
function minFechaSalida(){
  let fechaEntrada = document.getElementById("R_fechaEntrada");
  let fechaSalida = document.getElementById("R_fechaSalida");  
  // Toma la fecha de entrada y le suma un día
  let valorFechaEntrada = new Date(fechaEntrada.value);
  valorFechaEntrada.setDate(valorFechaEntrada.getDate()+1);  
  // Establece que la fecha de salida debe ser mínimo un día después de la entrada
  fechaSalida.min = valorFechaEntrada.toISOString().split("T")[0];
}

// ========== ENVÍO DE FORMULARIOS ==========
// Función que maneja el envío de formularios (reserva y contacto)
function enviarFormulario(formulario) {
  let mensaje = "";  
  // Verifica si el formulario es válido
  const emailInput = formulario.querySelector(`input[type="email"]`);
  const email = emailInput.value;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|mail|live|icloud|unsl\.edu|edu\.ar|educacion\.ar)\.(com|ar|edu)$/;
  if (!emailPattern.test(email)) {
    emailInput.setCustomValidity("Email inválido");
  } else {
    emailInput.setCustomValidity(""); // limpia el error
  }
  if (!formulario.checkValidity()) {
    // Si no es válido, muestra los errores de validación
    formulario.classList.add('was-validated');
    return false;
  }
  // Si pasa la validación, agrega estilos de validación exitosa
  formulario.classList.add('was-validated');

  // ========== MENSAJES DE CONFIRMACIÓN ==========  
  // Define el mensaje según el tipo de formulario
  if(formulario.id==="formularioReserva"){
    mensaje = "¡Gracias por reservar con nosotros! Pronto nos pondremos en contacto contigo para coordinar el pago y asegurarnos de que todo esté listo para tu experiencia.";
  }
  if(formulario.id=="formularioContacto"){
    mensaje = "¡Gracias por escribirnos! Hemos recibido tu mensaje y pronto nos pondremos en contacto contigo.";
  }  
  // Muestra el mensaje en el modal de confirmación
  document.getElementById("mensajeModalConfirmacion").innerHTML = mensaje;
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
  modal.show();

  // ========== RESETEO DEL FORMULARIO ==========  
  // Después de medio segundo, limpia el formulario
  setTimeout(() => {
    formulario.reset(); // Limpia todos los campos
    formulario.classList.remove('was-validated'); // Quita los estilos de validación
  }, 500);
  return false; // Previene el envío real del formulario
}

// ========== LIMPIEZA DE MODALES ==========// 
// Variable para evitar múltiples event listeners
let modalResetConfigured = false;

// Variable global para acceder al calendario desde cualquier función
let globalCalendarInstance = null;

// Función para limpiar el formulario cuando se cierra el modal
function resetForm() {
    if (modalResetConfigured) return; // Evitar configurar múltiples veces
    
    const modal = document.getElementById("cabinModal");
    if (modal) {
        const form = modal.querySelector("form");
        
        modal.addEventListener("hidden.bs.modal", () => {
            // Limpiar validación de Bootstrap
            form.classList.remove("was-validated");
            form.reset();
            
            // Resetear el calendario también
            if (globalCalendarInstance) {
                globalCalendarInstance.selectedStartDate = null;
                globalCalendarInstance.selectedEndDate = null;
                globalCalendarInstance.renderCalendar();
                globalCalendarInstance.updateRangeInfo();

                // También limpiar los campos de fecha
                document.getElementById('R_fechaEntrada').value = '';
                document.getElementById('R_fechaSalida').value = '';
            }

            console.log("✅ Formulario y calendario reseteados");
        });

        // Marcar como configurado para evitar duplicados
        modalResetConfigured = true;
    }
}

class DateRangeCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.today = new Date();
        
        this.init();
        
        // Asignar a variable global para acceso desde otras funciones
        globalCalendarInstance = this;
    }

    init() {
        this.setupEventListeners();
        this.renderCalendar();
        this.updateMinDates();
    }

    // Método para resetear completamente el calendario
    reset() {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.currentDate = new Date(); // Volver al mes actual
        this.renderCalendar();
        this.updateRangeInfo();
        
        // Limpiar los campos de fecha
        document.getElementById('R_fechaEntrada').value = '';
        document.getElementById('R_fechaSalida').value = '';
        
        // Resetear las fechas mínimas
        this.updateMinDates();
    }

    setupEventListeners() {
        // Navegación del calendario
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Campos de fecha
        document.getElementById('R_fechaEntrada').addEventListener('change', (e) => {
            if (e.target.value) {
                this.selectedStartDate = new Date(e.target.value);
                this.minFechaSalida();
                this.renderCalendar();
                this.updateRangeInfo();
            }
        });

        document.getElementById('R_fechaSalida').addEventListener('change', (e) => {
            if (e.target.value) {
                this.selectedEndDate = new Date(e.target.value);
                this.renderCalendar();
                this.updateRangeInfo();
            }
        });
    }

    updateMinDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('R_fechaEntrada').min = today;
        document.getElementById('R_fechaSalida').min = today;
    }

    minFechaSalida() {
        if (this.selectedStartDate) {
            const nextDay = new Date(this.selectedStartDate);
            nextDay.setDate(nextDay.getDate() + 1);
            document.getElementById('R_fechaSalida').min = nextDay.toISOString().split('T')[0];
        }
    }

    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        const title = document.getElementById('calendar-title');
        
        // Limpiar calendario
        grid.innerHTML = '';
        
        // Configurar título
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        title.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Encabezados de días
        const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });
        
        // Obtener primer día del mes y días en el mes
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDay = firstDay.getDay();
        
        // Días del mes anterior (espacios vacíos)
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            grid.appendChild(emptyDay);
        }
        
        // Días del mes actual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const currentDayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            
            // Deshabilitar días pasados
            if (currentDayDate < this.today) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', () => this.selectDate(currentDayDate));
            }
            
            // Marcar día actual
            if (this.isSameDay(currentDayDate, this.today)) {
                dayElement.classList.add('today');
            }
            
            // Marcar fechas seleccionadas y rango
            this.applyDateStyles(dayElement, currentDayDate);
            
            grid.appendChild(dayElement);
        }
    }

    selectDate(date) {
        if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
            // Seleccionar fecha de inicio
            this.selectedStartDate = date;
            this.selectedEndDate = null;
            document.getElementById('R_fechaEntrada').value = this.formatDate(date);
            document.getElementById('R_fechaSalida').value = '';
            this.minFechaSalida();
        } else if (this.selectedStartDate && !this.selectedEndDate) {
            // Seleccionar fecha de fin
            if (date > this.selectedStartDate) {
                this.selectedEndDate = date;
                document.getElementById('R_fechaSalida').value = this.formatDate(date);
            } else {
                // Si la fecha es anterior, reiniciar
                this.selectedStartDate = date;
                this.selectedEndDate = null;
                document.getElementById('R_fechaEntrada').value = this.formatDate(date);
                document.getElementById('R_fechaSalida').value = '';
                this.minFechaSalida();
            }
        }
        
        this.renderCalendar();
        this.updateRangeInfo();
    }

    applyDateStyles(element, date) {
        if (this.selectedStartDate && this.isSameDay(date, this.selectedStartDate)) {
            element.classList.add('selected-start');
        }
        
        if (this.selectedEndDate && this.isSameDay(date, this.selectedEndDate)) {
            element.classList.add('selected-end');
        }
        
        if (this.selectedStartDate && this.selectedEndDate && 
            date > this.selectedStartDate && date < this.selectedEndDate) {
            element.classList.add('in-range');
        }
    }

    updateRangeInfo() {
        const rangeInfo = document.getElementById('range-info');
        
        if (this.selectedStartDate && this.selectedEndDate) {
            document.getElementById('start-date-display').textContent = this.formatDisplayDate(this.selectedStartDate);
            document.getElementById('end-date-display').textContent = this.formatDisplayDate(this.selectedEndDate);
            
            const nights = Math.ceil((this.selectedEndDate - this.selectedStartDate) / (1000 * 60 * 60 * 24));
            document.getElementById('nights-count').textContent = nights;
            
            rangeInfo.style.display = 'block';
        } else {
            rangeInfo.style.display = 'none';
        }
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear();
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    formatDisplayDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('es-ES', options);
    }
}

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new DateRangeCalendar();
});

// Función actualizada para window.onload
window.onload = function () {
    createObjectCab().then(() => {
      createCabinsCards(); // ✅ Se ejecuta solo cuando los datos ya se cargaron
    });
    resetForm(); // ✅ Configurar el reset del modal
    carruselDinamico();
};




function actualizarImagenesCarrusel(container, carruselObj) {
  const items = container.querySelectorAll('.itemG');
  
  if (!carruselObj.imagenes.length) return;

  // Aplicar imagen a cada elemento del carrusel
  items.forEach((item, i) => {
    const imageIndex = (carruselObj.index + i) % carruselObj.imagenes.length;
    item.style.backgroundImage = `url('${carruselObj.imagenes[imageIndex]}')`;
    item.style.backgroundSize = "cover";
    item.style.backgroundPosition = "center";
  });
}

function agregarEventosCarruseles() {
  // Obtener todos los contenedores de carrusel (excluyendo el del modal)
  const containers = document.querySelectorAll('[data-carrusel]:not(#galeria)');
  
  containers.forEach((container) => {
    const carruselIndex = parseInt(container.dataset.carrusel);
    
    // Solo agregar eventos si el carrusel fue inicializado
    if (carruseles[carruselIndex]) {
      const nextBtn = container.querySelector('.nextG');
      const prevBtn = container.querySelector('.prevG');

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const items = container.querySelectorAll('.itemG');
          container.querySelector('.slideG').appendChild(items[0]);
          
          carruseles[carruselIndex].index = (carruseles[carruselIndex].index + 1) % carruseles[carruselIndex].imagenes.length;
          actualizarImagenesCarrusel(container, carruseles[carruselIndex]);
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const items = container.querySelectorAll('.itemG');
          container.querySelector('.slideG').prepend(items[items.length - 1]);
          
          carruseles[carruselIndex].index = (carruseles[carruselIndex].index - 1 + carruseles[carruselIndex].imagenes.length) % carruseles[carruselIndex].imagenes.length;
          actualizarImagenesCarrusel(container, carruseles[carruselIndex]);
        });
      }
    }
  });
}





// ========== Carrusel Dinamico ========== 
function carruselDinamico(){
  let carrusel = document.getElementById("carrusel");
  let estado = "active";
  carrusel.innerHTML = ""; 
  fetch('imgCarrusel.json')
    .then(res => res.json())
    .then(res => {
      res.forEach((c,i) =>{
        if(i!==0){
          estado = "";
        }
        carrusel.innerHTML += 
        ` <div class="carousel-item ${estado}" data-bs-interval="4000">
            <img src="${c.image}" class="d-block w-100"
              alt="${c.description}" />
          </div>  `;
      });
    });
  
}

window.onload = function () {
    createObjectCab().then(() => {
      createCabinsCards(); // ✅ Se ejecuta solo cuando los datos ya se cargaron
    });
    resetForm();
    carruselDinamico();
};
