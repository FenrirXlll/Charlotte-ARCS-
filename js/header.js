// Funcionalidad para el encabezado en todas las páginas

document.addEventListener('DOMContentLoaded', function() {
  // Menú móvil
  const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuButton && mainNav) {
    mobileMenuButton.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      
      // Cambiar el aspecto del botón de menú
      const bars = this.querySelectorAll('.bar');
      
      if (mainNav.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  }
  
  // Cerrar el menú al hacer clic en un enlace
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        
        // Restaurar el botón de menú
        const bars = mobileMenuButton.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  });
  
  // Actualizar los contadores del carrito y lista de deseos
  updateHeaderCounts();
  
  // Resaltar el enlace de la página actual
  highlightCurrentPage();
  
  // Agregar efectos de desplazamiento
  setupScrollEffects();
  
  // Agregar menús desplegables si existen
  setupDropdownMenus();
});

// Función para actualizar los contadores en el encabezado
async function updateHeaderCounts() {
  const cartCountElement = document.getElementById('cart-count');
  const wishlistCountElement = document.getElementById('wishlist-count');
  
  try {
    // Obtener la sesión del usuario
    const { session } = await window.authService.getSession();
    
    if (cartCountElement) {
      // Obtener el recuento del carrito
      const cartCount = await getCartCount(session);
      cartCountElement.textContent = cartCount;
    }
    
    if (wishlistCountElement && session) {
      // Obtener el recuento de la lista de deseos (solo para usuarios autenticados)
      const wishlistCount = await getWishlistCount(session);
      wishlistCountElement.textContent = wishlistCount;
    } else if (wishlistCountElement) {
      wishlistCountElement.textContent = '0';
    }
  } catch (error) {
    console.error('Error al actualizar los contadores:', error);
  }
}

// Obtener el número de productos en el carrito
async function getCartCount(session) {
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);
  let query = supabase.from('cart_items').select('quantity');
  
  if (session) {
    // Usuario autenticado
    query = query.eq('user_id', session.user.id);
  } else {
    // Usuario no autenticado con ID de sesión
    const sessionId = getCartSessionId();
    query = query.eq('session_id', sessionId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error al obtener el recuento del carrito:', error);
    return 0;
  }
  
  // Sumar las cantidades
  return data.reduce((total, item) => total + item.quantity, 0);
}

// Obtener el número de productos en la lista de deseos
async function getWishlistCount(session) {
  if (!session) return 0;
  
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', session.user.id);
  
  if (error) {
    console.error('Error al obtener el recuento de la lista de deseos:', error);
    return 0;
  }
  
  return data.length;
}

// Resaltar el enlace de la página actual
function highlightCurrentPage() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Si estamos en la página de inicio y el enlace es a index.html o /
    if ((currentPage === '/' || currentPage === '/index.html') && 
        (linkPath === 'index.html' || linkPath === '/')) {
      link.classList.add('active');
    }
    // Para otras páginas
    else if (currentPage.includes(linkPath) && linkPath !== 'index.html' && linkPath !== '/') {
      link.classList.add('active');
    }
    else {
      link.classList.remove('active');
    }
  });
  
  // Crear indicador de página actual
  createPageIndicator();
}

// Crear indicador animado para la página actual
function createPageIndicator() {
  // Remover indicador existente si hay
  const existingIndicator = document.querySelector('.current-page-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  const activeLink = document.querySelector('.main-nav a.active');
  if (activeLink) {
    const indicator = document.createElement('span');
    indicator.className = 'current-page-indicator';
    
    // Posicionar el indicador debajo del enlace activo
    const linkRect = activeLink.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left}px)`;
    
    // Añadir al DOM
    document.body.appendChild(indicator);
  }
}

// Configurar efectos al hacer scroll
function setupScrollEffects() {
  const header = document.getElementById('main-header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Añadir/quitar clase scrolled
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Ocultar/mostrar header al hacer scroll hacia abajo/arriba
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      // Scroll hacia abajo
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scroll hacia arriba
      header.style.transform = 'translateY(0)';
      
      if (scrollTop <= 50) {
        // Al inicio de la página, añadir animación
        header.classList.add('header-animate-in');
        setTimeout(() => {
          header.classList.remove('header-animate-in');
        }, 500);
      }
    }
    
    lastScrollTop = scrollTop;
  });
}

// Configurar menús desplegables
function setupDropdownMenus() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (link && menu) {
      // En dispositivos móviles, hacer clic para mostrar/ocultar
      if (window.innerWidth <= 768) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    }
  });
}

// Animaciones para elementos cuando se hacen visibles
document.addEventListener('scroll', function() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  animateElements.forEach(element => {
    if (isElementInViewport(element) && !element.classList.contains('animated')) {
      element.classList.add('animated');
      
      const animationType = element.getAttribute('data-animation') || 'fadeIn';
      element.style.animation = `${animationType} 0.8s ease forwards`;
    }
  });
});

// Comprobar si un elemento está en el viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}
