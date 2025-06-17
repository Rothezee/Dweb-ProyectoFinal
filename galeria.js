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

      // Obtener todos los contenedores de carrusel
      const containers = document.querySelectorAll('[data-carrusel]');
      
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
  // Obtener todos los contenedores de carrusel
  const containers = document.querySelectorAll('[data-carrusel]');
  
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

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  carruselDinamicoGal();
});
