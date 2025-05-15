
    const cabins = [
      {
        id: 1,
        title: 'Cabaña Montaña',
        price: 150,
        shortDescription: 'Acogedora cabaña con vistas panorámicas a la montaña.',
        description: 'Disfruta de esta acogedora cabaña con impresionantes vistas panorámicas a la montaña. Cuenta con cocina completa, chimenea, terraza privada y todas las comodidades para una estancia perfecta en contacto con la naturaleza. Ideal para parejas o pequeñas familias que buscan tranquilidad y aventura.',
        image: 'https://cdn.pixabay.com/photo/2021/09/07/18/44/stream-6604669_1280.jpg',
        capacity: '2-4 personas',
        features: ['Wi-Fi', 'Chimenea', 'Terraza', 'Cocina equipada', 'Estacionamiento']
      },
      {
        id: 2,
        title: 'Cabaña Lago',
        price: 220,
        shortDescription: 'Espaciosa cabaña con acceso directo al lago y muelle privado.',
        description: 'Esta amplia cabaña ofrece acceso directo al lago con muelle privado, ideal para los amantes de la pesca y deportes acuáticos. Cuenta con 2 dormitorios, sala de estar con vista al lago, cocina moderna y un amplio deck para disfrutar del atardecer. Perfecta para familias o grupos de amigos.',
        image: 'https://cdn.pixabay.com/photo/2016/11/18/22/21/architecture-1837150_1280.jpg',
        capacity: '4-6 personas',
        features: ['Acceso al lago', 'Muelle privado', 'Wi-Fi', 'Parrilla', 'Aire acondicionado']
      },
      {
        id: 3,
        title: 'Cabaña Bosque',
        price: 180,
        shortDescription: 'Cabaña rústica en medio del bosque con total privacidad.',
        description: 'Cabaña rústica pero moderna ubicada en pleno bosque, ofreciendo total privacidad y una experiencia única en contacto con la naturaleza. Cuenta con un diseño sostenible, energía solar, agua de manantial y todas las comodidades necesarias para una estancia confortable. Senderos para caminatas salen directamente desde la cabaña.',
        image: 'https://cdn.pixabay.com/photo/2018/09/02/14/32/cottages-3648930_1280.jpg',
        capacity: '2-4 personas',
        features: ['Aislada', 'Ecológica', 'Senderos', 'Chimenea', 'Terraza']
      },
      {
        id: 4,
        title: 'Cabaña Familiar',
        price: 280,
        shortDescription: 'Amplia cabaña para toda la familia con zona de juegos.',
        description: 'Esta espaciosa cabaña es perfecta para familias numerosas. Cuenta con 3 dormitorios, 2 baños, amplio salón con chimenea, cocina completa, y una zona exterior con juegos para niños y jacuzzi. Su ubicación permite fácil acceso a senderos y a solo 5 minutos en auto del pueblo cercano.',
        image: 'https://cdn.pixabay.com/photo/2017/11/24/10/43/ticket-2974645_1280.jpg',
        capacity: '6-8 personas',
        features: ['Jacuzzi', 'Área de juegos', 'Wi-Fi', 'TV satelital', 'Lavadora']
      },
      {
        id: 5,
        title: 'Cabaña Romántica',
        price: 190,
        shortDescription: 'Íntima cabaña ideal para parejas con jacuzzi privado.',
        description: 'Cabaña diseñada especialmente para parejas que buscan un escape romántico. Cuenta con una amplia habitación con cama king, baño con ducha doble, sala de estar con chimenea, cocina pequeña pero completa, y lo mejor: un jacuzzi privado en la terraza con vistas a las estrellas.',
        image: 'https://cdn.pixabay.com/photo/2014/11/21/17/17/house-540796_1280.jpg',
        capacity: '2 personas',
        features: ['Jacuzzi privado', 'Chimenea', 'Cama King', 'Desayuno incluido', 'Vistas']
      },
      {
        id: 6,
        title: 'Cabaña Premium',
        price: 350,
        shortDescription: 'Cabaña de lujo con todas las comodidades y vistas panorámicas.',
        description: 'Nuestra cabaña más exclusiva ofrece una experiencia de lujo en medio de la naturaleza. Amplios espacios, acabados premium, tecnología de punta, piscina climatizada privada, sauna, y vistas panorámicas desde cada ventana. Un verdadero santuario para quienes buscan lo mejor sin renunciar al contacto con la naturaleza.',
        image: 'https://cdn.pixabay.com/photo/2016/08/28/16/43/stilt-house-1626354_1280.jpg',
        capacity: '4-6 personas',
        features: ['Piscina climatizada', 'Sauna', 'Smart TV', 'Cocina gourmet', 'Sistema de sonido']
      }
    ];

//Funcion para crear card de cabañas
    function createCabinCards() {
      const container = document.getElementById('cabins-container');
      container.innerHTML = '';
      
      cabins.forEach(cabin => {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6';
        card.innerHTML = `
          <div class="cabin-card animate-on-scroll" data-id="${cabin.id}" data-aos="fade-up">
            <span class="price-tag">$${cabin.price}/noche</span>
            <img src="${cabin.image}" alt="${cabin.title}" class="card-img-top">
            <div class="card-body p-3">
              <h5 class="card-title">${cabin.title}</h5>
              <p class="card-text text-muted mb-2">${cabin.capacity}</p>
              <p class="card-text">${cabin.shortDescription}</p>
              <ul class="cabin-features">
                ${cabin.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
              </ul>
              <button class="btn reserve-btn text-white mt-3 w-100">Ver detalles</button>
            </div>
          </div>
        `;
        container.appendChild(card);
        
        // Add click event to open expanded view
        const cabinCard = card.querySelector('.cabin-card');
        cabinCard.addEventListener('click', () => openExpandedView(cabin));
      });
    }

    // Function to open expanded view
    function openExpandedView(cabin) {
      const expandedCard = document.getElementById('expanded-card');
      const expandedImage = document.getElementById('expanded-image');
      const expandedTitle = document.getElementById('expanded-title');
      const expandedPrice = document.getElementById('expanded-price');
      const expandedCapacity = document.getElementById('expanded-capacity');
      const expandedDescription = document.getElementById('expanded-description');
      const expandedFeatures = document.getElementById('expanded-features');
      
      // Set the data
      expandedImage.src = cabin.image;
      expandedImage.alt = cabin.title;
      expandedTitle.textContent = cabin.title;
      expandedPrice.textContent = `$${cabin.price} / noche`;
      expandedCapacity.textContent = cabin.capacity;
      expandedDescription.textContent = cabin.description;
      
      // Add features
      expandedFeatures.innerHTML = '';
      cabin.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        expandedFeatures.appendChild(li);
      });
      
      // Show the expanded view
      expandedCard.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close expanded view
    function closeExpandedView() {
      const expandedCard = document.getElementById('expanded-card');
      expandedCard.classList.remove('active');
      document.body.style.overflow = ''; // Allow scrolling again
    }

    // Initialize date pickers
    function initDatePickers() {
      flatpickr("#check-in", {
        dateFormat: "Y-m-d",
        minDate: "today"
      });
      
      flatpickr("#check-out", {
        dateFormat: "Y-m-d",
        minDate: "today"
      });
      
      flatpickr("#check-in-filter", {
        dateFormat: "Y-m-d",
        minDate: "today"
      });
      
      flatpickr("#check-out-filter", {
        dateFormat: "Y-m-d",
        minDate: "today"
      });
    }

    // Handle booking form submission
    function handleBookingSubmission() {
      const bookingForm = document.getElementById('booking-form');
      const loadingOverlay = document.getElementById('loading-overlay');
      const reservationSuccess = document.getElementById('reservation-success');
      
      bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        
        // Simulate API call with timeout
        setTimeout(() => {
          // Hide loading overlay
          loadingOverlay.classList.remove('active');
          
          // Close expanded view
          closeExpandedView();
          
          // Show success message
          reservationSuccess.classList.add('show');
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            reservationSuccess.classList.remove('show');
          }, 5000);
          
          // Reset form
          bookingForm.reset();
        }, 2000);
      });
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      // Create cabin cards
      createCabinCards();
      
      // Initialize date pickers
      initDatePickers();
      
      // Handle booking form submission
      handleBookingSubmission();
      
      // Close expanded view button
      document.getElementById('close-expanded').addEventListener('click', closeExpandedView);
      
      // Filter buttons (just for UI demonstration - not implementing actual filtering in prototype)
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        });
      });
      
      // Save last view to LocalStorage (basic implementation for prototype)
      const saveViewToLocalStorage = () => {
        localStorage.setItem('lastView', JSON.stringify({
          scrollPosition: window.scrollY,
          timestamp: new Date().getTime()
        }));
      };
      
      // Save view periodically
      setInterval(saveViewToLocalStorage, 5000);
      
      // Restore last view if available
      const lastView = JSON.parse(localStorage.getItem('lastView'));
      if (lastView && (new Date().getTime() - lastView.timestamp < 3600000)) { // Within the last hour
        window.scrollTo(0, lastView.scrollPosition);
      }
    });

// Detectar cuando los elementos están en el viewport
function handleScrollAnimation() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const windowHeight = window.innerHeight;

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    // Si el elemento está dentro del viewport, añadir clase `visible`
    if (elementTop < windowHeight - 100) {
      element.classList.add('visible');
    }
  });
}

// Añadir evento de scroll
window.addEventListener('scroll', handleScrollAnimation);

// Llamar la función una vez para detectar elementos visibles al cargar la página
document.addEventListener('DOMContentLoaded', handleScrollAnimation);