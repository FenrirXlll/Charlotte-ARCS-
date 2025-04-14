
// Funcionalidad para la página de inicio

document.addEventListener('DOMContentLoaded', function() {
  // Cargar productos destacados
  loadFeaturedProducts();
  
  // Configurar slider de banner
  setupHeroBanner();
  
  // Configurar formulario de newsletter
  setupNewsletterForm();
});

// Cargar productos destacados
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  if (!container) return;
  
  try {
    // Mostrar indicador de carga
    container.innerHTML = '<div class="loading-indicator">Cargando productos destacados...</div>';
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Obtener productos destacados (los más recientes o marcados como destacados)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Limpiar el contenedor
      container.innerHTML = '';
      
      // Mostrar cada producto
      data.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
      });
    } else {
      container.innerHTML = '<p>No hay productos destacados disponibles.</p>';
    }
  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
    container.innerHTML = '<p>Error al cargar productos. Por favor, intenta de nuevo.</p>';
  }
}

// Crear tarjeta de producto
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  // Calcular precio con descuento si aplica
  let finalPrice = product.price;
  let originalPriceHtml = '';
  
  if (product.discount_percentage && product.discount_percentage > 0) {
    finalPrice = product.price - (product.price * product.discount_percentage / 100);
    originalPriceHtml = `<span class="original-price">$${product.price.toFixed(2)}</span>`;
  }
  
  // Etiqueta de nuevo si el producto es nuevo
  let newTagHtml = '';
  if (product.is_new) {
    newTagHtml = '<span class="product-tag new-tag">Nuevo</span>';
  }
  
  // Etiqueta de descuento si tiene descuento
  let discountTagHtml = '';
  if (product.discount_percentage && product.discount_percentage > 0) {
    discountTagHtml = `<span class="product-tag discount-tag">-${product.discount_percentage}%</span>`;
  }
  
  card.innerHTML = `
    <div class="product-image">
      <a href="product.html?id=${product.id}">
        <img src="${product.image || 'images/product-placeholder.jpg'}" alt="${product.name}">
      </a>
      ${newTagHtml}
      ${discountTagHtml}
    </div>
    <div class="product-info">
      <h3 class="product-title">
        <a href="product.html?id=${product.id}">${product.name}</a>
      </h3>
      <div class="product-price">
        $${finalPrice.toFixed(2)} ${originalPriceHtml}
      </div>
      <div class="product-actions">
        <button class="btn primary-btn add-to-cart-btn" data-id="${product.id}">Añadir al Carrito</button>
        <button class="btn outline-btn add-to-wishlist-btn" data-id="${product.id}">❤️</button>
      </div>
    </div>
  `;
  
  // Añadir eventos a los botones
  card.querySelector('.add-to-cart-btn').addEventListener('click', function() {
    addToCart(product.id);
  });
  
  card.querySelector('.add-to-wishlist-btn').addEventListener('click', function() {
    addToWishlist(product.id);
  });
  
  return card;
}

// Añadir producto al carrito
async function addToCart(productId) {
  try {
    // Verificar si el usuario está autenticado
    const { session } = await window.authService.getSession();
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Verificar si el producto existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError) throw productError;
    
    if (!product) {
      alert('Producto no encontrado.');
      return;
    }
    
    // Obtener ID de sesión o usuario para el carrito
    const userId = session ? session.user.id : null;
    const sessionId = userId ? null : getCartSessionId();
    
    // Verificar si el producto ya está en el carrito
    const { data: existingItem, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', productId)
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId)
      .maybeSingle();
    
    if (existingError) throw existingError;
    
    if (existingItem) {
      // Actualizar cantidad si ya existe
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
      
      if (updateError) throw updateError;
    } else {
      // Insertar nuevo item si no existe
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([{
          user_id: userId,
          session_id: sessionId,
          product_id: productId,
          quantity: 1
        }]);
      
      if (insertError) throw insertError;
    }
    
    // Actualizar contador de carrito
    updateCartCount();
    
    alert('Producto añadido al carrito.');
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
    alert('Error al añadir al carrito. Por favor, intenta de nuevo.');
  }
}

// Añadir producto a la lista de deseos
async function addToWishlist(productId) {
  try {
    // Verificar si el usuario está autenticado
    const { session } = await window.authService.getSession();
    
    if (!session) {
      // Redirigir al login si no está autenticado
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
      return;
    }
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Verificar si el producto ya está en la lista de deseos
    const { data: existingItem, error: existingError } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (existingError) throw existingError;
    
    if (existingItem) {
      alert('Este producto ya está en tu lista de deseos.');
      return;
    }
    
    // Insertar el producto en la lista de deseos
    const { error: insertError } = await supabase
      .from('wishlist_items')
      .insert([{
        user_id: session.user.id,
        product_id: productId
      }]);
    
    if (insertError) throw insertError;
    
    // Actualizar contador de lista de deseos
    updateWishlistCount();
    
    alert('Producto añadido a tu lista de deseos.');
  } catch (error) {
    console.error('Error al añadir a la lista de deseos:', error);
    alert('Error al añadir a la lista de deseos. Por favor, intenta de nuevo.');
  }
}

// Actualizar contador de carrito
async function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (!cartCountElement) return;
  
  try {
    // Verificar si el usuario está autenticado
    const { session } = await window.authService.getSession();
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Obtener ID de sesión o usuario para el carrito
    const userId = session ? session.user.id : null;
    const sessionId = userId ? null : getCartSessionId();
    
    let query = supabase
      .from('cart_items')
      .select('quantity', { count: 'exact' });
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    
    // Actualizar el contador
    cartCountElement.textContent = count || 0;
    
    // Si el contador es 0, ocultar la burbuja
    cartCountElement.style.display = count && count > 0 ? 'block' : 'none';
  } catch (error) {
    console.error('Error al actualizar contador del carrito:', error);
  }
}

// Actualizar contador de la lista de deseos
async function updateWishlistCount() {
  const wishlistCountElement = document.getElementById('wishlist-count');
  if (!wishlistCountElement) return;
  
  try {
    // Verificar si el usuario está autenticado
    const { session } = await window.authService.getSession();
    
    if (!session) {
      // Si no está autenticado, ocultar el contador
      wishlistCountElement.style.display = 'none';
      return;
    }
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    const { count, error } = await supabase
      .from('wishlist_items')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id);
    
    if (error) throw error;
    
    // Actualizar el contador
    wishlistCountElement.textContent = count || 0;
    
    // Si el contador es 0, ocultar la burbuja
    wishlistCountElement.style.display = count && count > 0 ? 'block' : 'none';
  } catch (error) {
    console.error('Error al actualizar contador de la lista de deseos:', error);
  }
}

// Configurar el slider del banner principal
function setupHeroBanner() {
  // Puedes implementar un slider automático si hay múltiples banners
  console.log('Banner principal configurado');
}

// Configurar formulario de newsletter
function setupNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!email) {
        alert('Por favor, ingresa tu correo electrónico.');
        return;
      }
      
      try {
        // Desactivar el botón de envío
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Suscribiendo...';
        
        const supabase = supabase.createClient(supabaseUrl, supabaseKey);
        
        // Verificar si el correo ya está suscrito
        const { data: existingEmail, error: checkError } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (existingEmail) {
          alert('Este correo electrónico ya está suscrito a nuestro boletín.');
        } else {
          // Insertar nuevo suscriptor
          const { error: insertError } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email }]);
          
          if (insertError) throw insertError;
          
          alert('¡Gracias por suscribirte a nuestro boletín!');
          emailInput.value = '';
        }
      } catch (error) {
        console.error('Error al suscribirse al boletín:', error);
        alert('Error al suscribirse al boletín. Por favor, intenta de nuevo.');
      } finally {
        // Reactivar el botón de envío
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Suscribirse';
      }
    });
  }
}
