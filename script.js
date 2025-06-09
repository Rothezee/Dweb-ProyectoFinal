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
          <span class="price-tag">$${cabin.price}/noche</span>
          <img src=${cabin.image[0]} class="card-img-top" alt=${cabin.title} />
          <div class="card-body p-3">
            <h5>${cabin.title} N°${cabin.id} – ${cabin.shortDescription}</h5>
            <p>${cabin.description}</p>
            <button class="btn btn-warning w-100" 
                    data-bs-toggle="modal" 
                    data-bs-target="#cabinModal"
                    onclick='fillModal(${JSON.stringify(cabin)})'>Ver Más</button>
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
  fechaEntrada.min = new Date().toISOString().split("T")[0];//fecha actual aaaa-mm-dd
  fechaSalida.min = new Date().toISOString().split("T")[0];//fecha actual aaaa-mm-dd
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

//funcion para reinciar mensajes y formulario al cerrar modal
function resetForm(){
  const modal = document.getElementById("cabinModal"); // Reemplazá con tu ID real
  const form = modal.querySelector("form");
  modal.addEventListener("hidden.bs.modal", () => {
    // Limpiar sólo los estilos de validación (sin romper funcionalidad)
    form.classList.remove("was-validated");
    form.reset();
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

