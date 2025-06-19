(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation') // busca todos los forms con esta clase

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

// Array global que almacenará todas las cabañas cargadas desde el JSON
let cabins = []

// Función para cargar los datos de las cabañas desde un archivo JSON
function createObjectCab(){
  // Realiza una petición al archivo 'cardCabins.json'
  return fetch('cardCabins.json')
    .then(res => res.json()) // Convierte la respuesta a formato JSON
    .then(res => {
      // Limpia el array de cabañas antes de llenarlo
      cabins = [];
      
      // Recorre cada cabaña del JSON y crea un objeto estructurado
      res.forEach(c =>{
        cabins.push({
          id: c.id,                           // ID único de la cabaña
          title: c.title,                     // Nombre de la cabaña
          price: c.price,                     // Precio por noche
          shortDescription: c.shortDescription, // Descripción corta
          description: c.description,         // Descripción completa
          image: c.image,                     // Array de imágenes
          capacity: c.capacity,               // Capacidad máxima de huéspedes
          features: c.features,               // Lista de características/servicios
        });
      });
    });
}

// ========== CREACIÓN DE TARJETAS DE CABAÑAS ==========

// Función que genera las tarjetas HTML de todas las cabañas
function createCabinsCards(){
  // Obtiene el contenedor donde se mostrarán las tarjetas
  const card = document.getElementById('container-card');
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

// ========== LIMPIEZA DE MODALES ==========

// Función para limpiar el formulario cuando se cierra el modal
function resetForm(){
  const modal = document.getElementById("cabinModal");
  const form = modal.querySelector("form");
  
  // Escucha el evento de cierre del modal
  modal.addEventListener("hidden.bs.modal", () => {
    // Limpia los estilos de validación y resetea el formulario
    form.classList.remove("was-validated");
    form.reset();
  });
}

// ========== CARRUSEL PARA GALERÍA PRINCIPAL ==========
// (Mantiene tu funcionalidad existente para otros carruseles)

// Array para manejar múltiples carruseles
let carruseles = [];

function carruselDinamicoGal() {
  fetch('galeria.json')
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        alert("No hay datos disponibles");
        return;
      }

      // Obtener todos los contenedores de carrusel (excluyendo el del modal)
      const containers = document.querySelectorAll('[data-carrusel]:not(#galeria)');
      
      containers.forEach((container) => {
        const carruselIndex = parseInt(container.dataset.carrusel);
        
        // Verificar que existe data para este carrusel
        if (data[carruselIndex] && data[carruselIndex].image.length) {
          const datosCarrusel = data[carruselIndex];
          
          // Inicializar objeto carrusel
          carruseles[carruselIndex] = {
            imagenes: datosCarrusel.image,
            index: 0
          };
          
          // Actualizar carrusel 
          actualizarCarrusel(container, datosCarrusel, carruseles[carruselIndex]);
        }
      });
      
      // Agregar eventos después de configurar todos los carruseles
      agregarEventosCarruseles();
    })
    .catch(err => {
      console.error("Error cargando JSON:", err);
    });
}

function actualizarCarrusel(container, datos, carruselObj) {
  if (!container) return;

  // Actualizar textos específicos de este container
  const nombres = container.querySelectorAll('.name');
  const descripciones = container.querySelectorAll('.description');

  nombres.forEach(nombre => {
    nombre.textContent = datos.title;
  });

  descripciones.forEach(desc => {
    desc.textContent = datos.shortDescription;
  });

  // Actualizar imágenes
  actualizarImagenesCarrusel(container, carruselObj);
}

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
