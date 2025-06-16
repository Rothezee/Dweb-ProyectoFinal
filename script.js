       // Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


//Funcion para obtener los datos del archivo Jason
let cabins = []
function createObjectCab(){
  return fetch('cardCabins.json')
    .then(res => res.json())
    .then(res => {
      cabins = [];
      res.forEach(c =>{
        cabins.push({
          id: c.id,
          title: c.title,
          price: c.price,
          shortDescription: c.shortDescription,
          description: c.description,
          image: c.image,
          capacity: c.capacity,
          features: c.features,
        });
      });
    });
}

//Funcion para crear card de cabañas
function createCabinsCards(){
  const card = document.getElementById('container-card');
  card.innerHTML = '';
  cabins.forEach(cabin => {
    card.innerHTML += 
    `<div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="row g-0">
            <div class="col-md-6 col-lg-12 position-relative">
              <span class="price-tag">$${cabin.price}/noche</span>
              <img src=${cabin.image[0]} class="card-img-top" alt=${cabin.title} />
            </div>
            <div class="col-md-6 col-lg-12">
              <div class="card-body p-3">
                <h5>${cabin.title} N°${cabin.id} – ${cabin.shortDescription}</h5>
                <p>${cabin.description}</p>
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

function fillModal(cabin) {
  document.getElementById('cabinModalLabel').innerHTML = cabin.title+": N°"+cabin.id;
  document.getElementById('modal-shortDescription').innerHTML = cabin.shortDescription;
  document.querySelectorAll("img[name='imagenes-modal']").forEach((img,i) => {
    img.src = cabin.image[i+1];
    img.alt = cabin.title;
  });
  document.getElementById('modal-price').innerHTML = `$${cabin.price} / noche`;
  document.getElementById('modal-capacity').innerHTML = `<b>Capacidad:</b> ${cabin.capacity}`;
  document.getElementById('modal-description').innerHTML = cabin.description;

  //Indicador de cabaña en input invisible (para indicar que cabaña es al enviar el formulario)
  document.getElementById("R_IdCabaña").value = "Cabaña: "+cabin.id;
  //

  //opciones de cantidad de huespedes segun cabaña seleccionada
  let huespedes = document.getElementById("R_huespedes");
  huespedes.innerHTML = `<option value="" disabled selected>Seleccione cantidad</option>`;
  huespedes.innerHTML += `<option value="1">1 huésped</option>`
  let max = 0;
  if(cabin.id=="1" || cabin.id=="2"){
    max = 3;
  }else{
    if(cabin.id=="4" || cabin.id=="5"){
      max = 5;
    }else{
      max = 6;
    }
  }
  for(let j = 2; j<=max; j++){
    huespedes.innerHTML += `<option value="${j}">${j} huéspedes</option>`
  }
  //
  //limitaciones de fechas (Defecto)
  let fechaEntrada = document.getElementById("R_fechaEntrada");
  let fechaSalida = document.getElementById("R_fechaSalida");
  let fechaVencimientoTarjeta = document.getElementById("R_vencimiento");
  let hoy = new Date();
  fechaEntrada.min = hoy.toISOString().split("T")[0];//fecha actual aaaa-mm-dd
  fechaSalida.min = hoy.toISOString().split("T")[0];//fecha actual aaaa-mm-dd
  fechaVencimientoTarjeta.min = hoy.toISOString().slice(0, 7);//Obtine las primeras 7 letras osea YYYY-MM
  // 
  const modalFeatures = document.getElementById('modal-features');
  modalFeatures.innerHTML = ''; // Limpiamos primero

  cabin.features.forEach(feature => {
    modalFeatures.innerHTML += `<li>${feature}</li>`;
  }); 
}

//fucnion para poner limitacion a la fecha de salida
function minFechaSalida(){
  let fechaEntrada = document.getElementById("R_fechaEntrada");
  let fechaSalida = document.getElementById("R_fechaSalida");
  let valorFechaEntrada = new Date(fechaEntrada.value);
  valorFechaEntrada.setDate(valorFechaEntrada.getDate()+1);
  fechaSalida.min = valorFechaEntrada.toISOString().split("T")[0];
}

//funcion datos de tarjeta
function datosTargeta() {
  let formaPago = document.getElementById("R_formaPago");
  const datosTarjeta = document.getElementById("datosTarjeta");
  const necesitaTarjeta = formaPago.value === "Credito" || formaPago.value === "Debito";

  datosTarjeta.classList.toggle("d-none", !necesitaTarjeta);

  // Si no se necesita tarjeta, limpiamos los valores
  if (!necesitaTarjeta) {
    datosTarjeta.querySelectorAll("input").forEach(input => {
      input.value = "";
      input.classList.remove("is-invalid", "is-valid");
    });
  }
}
//funcion para que no afecte los datos de la tarjeta con la validacion al elegir tranferencia
function actualizarCamposPago() {
  const formaPago = document.getElementById("R_formaPago").value;
  const camposTarjeta = document.querySelectorAll(".campo-tarjeta");

  if (formaPago === "Credito" || formaPago === "Debito") {
    camposTarjeta.forEach(campo => {
      campo.disabled = false;
      campo.required = true;
    });
  } else {
    camposTarjeta.forEach(campo => {
      campo.disabled = true;
      campo.required = false;
    });
  }
}

//mostrar modal de confirmacion
function enviarFormulario(formulario) {
  let mensaje = "";
  if (!formulario.checkValidity()) {
    formulario.classList.add('was-validated');
    return false;
  }

  // Si pasa la validación
  formulario.classList.add('was-validated');

  // Mostrar modal de confirmación
  if(formulario.id==="formularioReserva"){
    mensaje = "¡Gracias por reservar con nosotros! Pronto nos pondremos en contacto contigo para coordinar el pago y asegurarnos de que todo esté listo para tu experiencia.";
  }
  if(formulario.id=="formularioContacto"){
    mensaje = "¡Gracias por escribirnos! Hemos recibido tu mensaje y pronto nos pondremos en contacto contigo.";
  }
  document.getElementById("mensajeModalConfirmacion").innerHTML = mensaje;
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
  modal.show();

  // Opcional: resetear el formulario luego de mostrar el modal
  setTimeout(() => {
    formulario.reset();
    formulario.classList.remove('was-validated');
  }, 500);

  return false; 
}
//
//-------------------------

//funcion para reinciar mensajes y formulario al cerrar modal
function resetForm(){
  const modal = document.getElementById("cabinModal"); // Reemplazá con tu ID real
  const form = modal.querySelector("form");
  modal.addEventListener("hidden.bs.modal", () => {
    // Limpiar sólo los estilos de validación (sin romper funcionalidad)
    form.classList.remove("was-validated");
    form.reset();
    datosTargeta();
  });
  
}



//Carrusel Dinamico

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

