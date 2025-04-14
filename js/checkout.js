
// Funcionalidad para la página de checkout

document.addEventListener('DOMContentLoaded', async function() {
  // Verificar el estado de autenticación
  await checkAuthStatus();
  
  // Cargar el resumen del carrito
  await loadCartSummary();
  
  // Configurar los métodos de pago
  setupPaymentMethods();
  
  // Configurar el formulario de checkout
  setupCheckoutForm();
});

// Verificar si el usuario está autenticado
async function checkAuthStatus() {
  try {
    const { session } = await window.authService.getSession();
    
    if (session) {
      // Usuario autenticado, ocultar mensaje de login
      document.getElementById('login-message').style.display = 'none';
      
      // Pre-rellenar campos con la información del perfil
      const supabase = supabase.createClient(supabaseUrl, supabaseKey);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (!error && profile) {
        // Rellenar los campos del formulario con los datos del perfil
        document.getElementById('checkout-name').value = profile.full_name || '';
        document.getElementById('checkout-email').value = session.user.email || '';
        
        // Si hay más campos en el perfil, rellenarlos
        if (profile.phone) {
          document.getElementById('checkout-phone').value = profile.phone;
        }
        if (profile.address) {
          document.getElementById('checkout-address').value = profile.address;
        }
        if (profile.city) {
          document.getElementById('checkout-city').value = profile.city;
        }
        if (profile.state) {
          document.getElementById('checkout-state').value = profile.state;
        }
        if (profile.zip) {
          document.getElementById('checkout-zip').value = profile.zip;
        }
        if (profile.country) {
          document.getElementById('checkout-country').value = profile.country;
        }
      }
    } else {
      // Usuario no autenticado, mostrar mensaje de login
      document.getElementById('login-message').style.display = 'block';
    }
  } catch (error) {
    console.error('Error al verificar el estado de autenticación:', error);
  }
}

// Cargar el resumen del carrito
async function loadCartSummary() {
  const itemsContainer = document.getElementById('checkout-items');
  const subtotalElement = document.getElementById('checkout-subtotal');
  const shippingElement = document.getElementById('checkout-shipping');
  const totalElement = document.getElementById('checkout-total');
  
  try {
    // Obtener la sesión para saber si el usuario está autenticado
    const { session } = await window.authService.getSession();
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    let query = supabase
      .from('cart_items')
      .select('*, product:products(*)');
    
    if (session) {
      // Usuario autenticado, filtrar por user_id
      query = query.eq('user_id', session.user.id);
    } else {
      // Usuario no autenticado, usar el session_id almacenado en localStorage
      const sessionId = getCartSessionId();
      query = query.eq('session_id', sessionId);
    }
    
    const { data: cartItems, error } = await query;
    
    if (error) throw error;
    
    if (cartItems && cartItems.length > 0) {
      // Limpiar el contenedor
      itemsContainer.innerHTML = '';
      
      let subtotal = 0;
      
      // Añadir cada producto
      cartItems.forEach(item => {
        const product = item.product;
        
        // Calcular precio con descuento si existe
        const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
        const price = hasDiscount 
          ? product.price * (1 - product.discount_percentage / 100) 
          : product.price;
        
        // Calcular total por artículo
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        
        // Crear elemento de artículo
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        itemElement.innerHTML = `
          <img src="${product.image || 'images/product-placeholder.jpg'}" alt="${product.name}" class="checkout-item-image">
          <div class="checkout-item-details">
            <div class="checkout-item-name">${product.name}</div>
            <div class="checkout-item-price">
              <span>$${price.toFixed(2)} x ${item.quantity}</span>
              <span>$${itemTotal.toFixed(2)}</span>
            </div>
          </div>
        `;
        
        itemsContainer.appendChild(itemElement);
      });
      
      // Calcular envío
      // Por defecto, envío de $5 y gratis por encima de $50
      const shipping = subtotal >= 50 ? 0 : 5;
      
      // Actualizar los totales
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
      totalElement.textContent = `$${(subtotal + shipping).toFixed(2)}`;
      
      // Guardar los valores para usarlos al procesar el pedido
      window.checkoutData = {
        subtotal,
        shipping,
        total: subtotal + shipping,
        items: cartItems
      };
    } else {
      // No hay artículos en el carrito
      itemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
      subtotalElement.textContent = '$0.00';
      shippingElement.textContent = '$0.00';
      totalElement.textContent = '$0.00';
      
      // Redirigir al carrito después de un breve retraso
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Error al cargar el resumen del carrito:', error);
    itemsContainer.innerHTML = '<p>Error al cargar los productos. Por favor, intenta de nuevo.</p>';
  }
}

// Configurar los métodos de pago
function setupPaymentMethods() {
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  const cardFields = document.getElementById('card-payment-fields');
  const paypalFields = document.getElementById('paypal-payment-fields');
  const transferFields = document.getElementById('transfer-payment-fields');
  
  paymentMethods.forEach(method => {
    method.addEventListener('change', function() {
      // Ocultar todos los campos
      cardFields.style.display = 'none';
      paypalFields.style.display = 'none';
      transferFields.style.display = 'none';
      
      // Mostrar los campos correspondientes al método seleccionado
      switch (this.value) {
        case 'card':
          cardFields.style.display = 'block';
          break;
        case 'paypal':
          paypalFields.style.display = 'block';
          break;
        case 'transfer':
          transferFields.style.display = 'block';
          break;
      }
    });
  });
}

// Configurar el formulario de checkout
function setupCheckoutForm() {
  const checkoutForm = document.getElementById('checkout-form');
  
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      try {
        // Desactivar el botón de envío para evitar múltiples envíos
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';
        
        // Obtener los datos del formulario
        const formData = {
          name: document.getElementById('checkout-name').value,
          email: document.getElementById('checkout-email').value,
          phone: document.getElementById('checkout-phone').value,
          address: document.getElementById('checkout-address').value,
          city: document.getElementById('checkout-city').value,
          state: document.getElementById('checkout-state').value,
          zip: document.getElementById('checkout-zip').value,
          country: document.getElementById('checkout-country').value,
          notes: document.getElementById('checkout-notes').value,
          paymentMethod: document.querySelector('input[name="payment-method"]:checked').value
        };
        
        // Validar datos específicos del método de pago
        if (formData.paymentMethod === 'card') {
          formData.cardName = document.getElementById('card-name').value;
          formData.cardNumber = document.getElementById('card-number').value;
          formData.cardExpiry = document.getElementById('card-expiry').value;
          formData.cardCvc = document.getElementById('card-cvc').value;
          
          // Validar datos de la tarjeta
          if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
            throw new Error('Por favor, completa todos los campos de la tarjeta.');
          }
        } else if (formData.paymentMethod === 'transfer') {
          formData.transferReference = document.getElementById('transfer-reference').value;
          
          // Validar referencia de transferencia
          if (!formData.transferReference) {
            throw new Error('Por favor, ingresa la referencia de la transferencia.');
          }
        }
        
        // Obtener la sesión para saber si el usuario está autenticado
        const { session } = await window.authService.getSession();
        const supabase = supabase.createClient(supabaseUrl, supabaseKey);
        
        // Crear la dirección de envío como texto
        const shippingAddress = `${formData.name}\n${formData.address}\n${formData.city}, ${formData.state} ${formData.zip}\n${formData.country}\nTeléfono: ${formData.phone}`;
        
        // Crear el pedido en la base de datos
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              user_id: session ? session.user.id : null,
              total: window.checkoutData.total,
              shipping_address: shippingAddress,
              payment_method: formData.paymentMethod,
              status: 'pending'
            }
          ])
          .select('id')
          .single();
        
        if (orderError) throw orderError;
        
        // Agregar los productos al pedido
        const orderItems = window.checkoutData.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.discount_percentage 
            ? item.product.price * (1 - item.product.discount_percentage / 100) 
            : item.product.price
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        // Vaciar el carrito
        let cartQuery = supabase.from('cart_items');
        
        if (session) {
          cartQuery = cartQuery.delete().eq('user_id', session.user.id);
        } else {
          const sessionId = getCartSessionId();
          cartQuery = cartQuery.delete().eq('session_id', sessionId);
        }
        
        const { error: cartError } = await cartQuery;
        
        if (cartError) throw cartError;
        
        // Redirigir a la página de confirmación
        window.location.href = `confirmation.html?id=${order.id}`;
      } catch (error) {
        console.error('Error al procesar el pedido:', error);
        alert('Error al procesar el pedido: ' + error.message);
        
        // Reactivar el botón de envío
        const submitButton = checkoutForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar Pedido';
      }
    });
  }
}
