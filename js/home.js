
// Funcionalidad para la página de inicio

document.addEventListener('DOMContentLoaded', async function() {
  // Cargar productos destacados
  await loadFeaturedProducts();
});

// Función para cargar productos destacados
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  
  if (!container) return;
  
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Obtener productos destacados (los más recientes o los que marquemos como destacados)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Limpiar el contenedor
      container.innerHTML = '';
      
      // Añadir cada producto
      data.forEach(product => {
        container.appendChild(createProductCard(product));
      });
    } else {
      container.innerHTML = '<p class="text-center">No hay productos destacados disponibles.</p>';
    }
  } catch (error) {
    console.error('Error al cargar los productos destacados:', error);
    container.innerHTML = '<p class="text-center">Error al cargar los productos. Por favor, intenta más tarde.</p>';
  }
}

// Función para crear una tarjeta de producto
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  // Calcular el precio con descuento si existe
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
  const discountedPrice = hasDiscount 
    ? product.price * (1 - product.discount_percentage / 100) 
    : product.price;
  
  // Crear HTML para la tarjeta
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image || 'images/product-placeholder.jpg'}" alt="${product.name}">
      ${product.is_new ? '<span class="product-badge badge-new">Nuevo</span>' : ''}
      ${hasDiscount ? `<span class="product-badge badge-sale">${product.discount_percentage}% OFF</span>` : ''}
      <div class="product-actions">
        <a href="#" class="action-btn wishlist-btn" data-product-id="${product.id}" title="Añadir a favoritos">❤️</a>
        <a href="product.html?id=${product.id}" class="action-btn view-btn" title="Ver detalles">👁️</a>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">
        <a href="product.html?id=${product.id}">${product.name}</a>
      </h3>
      <div class="product-price">
        <span class="current-price">$${discountedPrice.toFixed(2)}</span>
        ${hasDiscount ? `<span class="original-price">$${product.price.toFixed(2)}</span>` : ''}
      </div>
      <button class="btn primary-btn add-to-cart-btn" data-product-id="${product.id}">Añadir al Carrito</button>
    </div>
  `;
  
  // Añadir event listeners
  const addToCartBtn = card.querySelector('.add-to-cart-btn');
  addToCartBtn.addEventListener('click', function(e) {
    e.preventDefault();
    addToCart(product.id);
  });
  
  const wishlistBtn = card.querySelector('.wishlist-btn');
  wishlistBtn.addEventListener('click', function(e) {
    e.preventDefault();
    addToWishlist(product.id);
  });
  
  return card;
}

// Función para añadir un producto al carrito
async function addToCart(productId) {
  try {
    const { session } = await window.authService.getSession();
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    let userId = null;
    let sessionId = null;
    
    if (session) {
      userId = session.user.id;
    } else {
      sessionId = getCartSessionId();
    }
    
    // Comprobar si el producto ya está en el carrito
    const { data: existingItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', productId)
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId);
    
    if (fetchError) throw fetchError;
    
    if (existingItems && existingItems.length > 0) {
      // Actualizar cantidad si ya existe
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItems[0].quantity + 1 })
        .eq('id', existingItems[0].id);
      
      if (updateError) throw updateError;
    } else {
      // Añadir nuevo item al carrito
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([
          {
            product_id: productId,
            user_id: userId,
            session_id: sessionId,
            quantity: 1
          }
        ]);
      
      if (insertError) throw insertError;
    }
    
    // Actualizar el contador del carrito
    updateHeaderCounts();
    
    // Mostrar mensaje de éxito
    alert('Producto añadido al carrito');
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
    alert('Error al añadir al carrito. Por favor, intenta de nuevo.');
  }
}

// Función para añadir un producto a la lista de deseos
async function addToWishlist(productId) {
  try {
    const { session } = await window.authService.getSession();
    
    if (!session) {
      // Redireccionar al login si no está autenticado
      window.location.href = 'login.html';
      return;
    }
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Comprobar si el producto ya está en la lista de deseos
    const { data: existingItems, error: fetchError } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', session.user.id);
    
    if (fetchError) throw fetchError;
    
    if (existingItems && existingItems.length > 0) {
      alert('Este producto ya está en tu lista de deseos');
      return;
    }
    
    // Añadir a la lista de deseos
    const { error: insertError } = await supabase
      .from('wishlist_items')
      .insert([
        {
          product_id: productId,
          user_id: session.user.id
        }
      ]);
    
    if (insertError) throw insertError;
    
    // Actualizar el contador de la lista de deseos
    updateHeaderCounts();
    
    // Mostrar mensaje de éxito
    alert('Producto añadido a favoritos');
  } catch (error) {
    console.error('Error al añadir a favoritos:', error);
    alert('Error al añadir a favoritos. Por favor, intenta de nuevo.');
  }
}
