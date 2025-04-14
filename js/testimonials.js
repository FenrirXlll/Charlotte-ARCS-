
// Funcionalidad para la sección de testimonios de la página principal

document.addEventListener('DOMContentLoaded', function() {
  // Cargar testimonios desde Supabase
  loadTestimonials();
  
  // Configurar el slider de testimonios
  setupTestimonialSlider();
});

// Cargar testimonios
async function loadTestimonials() {
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id(full_name)
      `)
      .is('product_id', null) // Solo testimonios generales, no específicos de productos
      .limit(5)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      displayTestimonials(data);
    }
  } catch (error) {
    console.error('Error al cargar testimonios:', error);
  }
}

// Mostrar testimonios en el slider
function displayTestimonials(testimonials) {
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (!testimonialSlider) return;
  
  // Limpiar slider
  testimonialSlider.innerHTML = '';
  
  // Añadir cada testimonio
  testimonials.forEach(testimonial => {
    const testimonialEl = document.createElement('div');
    testimonialEl.className = 'testimonial';
    
    const userName = testimonial.profiles ? testimonial.profiles.full_name : 'Cliente';
    const date = new Date(testimonial.created_at).toLocaleDateString();
    
    testimonialEl.innerHTML = `
      <div class="testimonial-content">
        <p>"${testimonial.content}"</p>
        <div class="testimonial-author">
          <p>${userName}</p>
          <span class="testimonial-date">${date}</span>
        </div>
      </div>
    `;
    
    testimonialSlider.appendChild(testimonialEl);
  });
  
  // Si no hay suficientes testimonios, agregar algunos por defecto
  if (testimonials.length < 2) {
    const defaultTestimonials = [
      {
        content: "La calidad de la ropa es excepcional. Siempre encuentro lo que busco en Charlotte ARCS.",
        author: "María García"
      },
      {
        content: "Servicio al cliente increíble y envíos rápidos. ¡Muy recomendable!",
        author: "Juan Pérez"
      }
    ];
    
    defaultTestimonials.forEach(testimonial => {
      const testimonialEl = document.createElement('div');
      testimonialEl.className = 'testimonial';
      
      testimonialEl.innerHTML = `
        <div class="testimonial-content">
          <p>"${testimonial.content}"</p>
          <div class="testimonial-author">
            <p>${testimonial.author}</p>
          </div>
        </div>
      `;
      
      testimonialSlider.appendChild(testimonialEl);
    });
  }
}

// Configurar el slider de testimonios
function setupTestimonialSlider() {
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (!testimonialSlider) return;
  
  // Variables para el slider
  let currentIndex = 0;
  const testimonials = testimonialSlider.querySelectorAll('.testimonial');
  
  // Si hay más de un testimonio, configurar el slider automático
  if (testimonials.length > 1) {
    // Mostrar el primer testimonio
    updateSlider();
    
    // Cambiar cada 5 segundos
    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateSlider();
    }, 5000);
  }
  
  // Función para actualizar el slider
  function updateSlider() {
    testimonials.forEach((testimonial, index) => {
      if (index === currentIndex) {
        testimonial.classList.add('active');
      } else {
        testimonial.classList.remove('active');
      }
    });
  }
}
