
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
