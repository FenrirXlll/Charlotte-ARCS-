
// Funcionalidad para la página de confirmación de pedido

document.addEventListener('DOMContentLoaded', async function() {
  // Obtener el ID del pedido de la URL
  const orderId = getOrderIdFromUrl();
  
  if (!orderId) {
    // Redireccionar al inicio si no hay ID de pedido
    window.location.href = 'index.html';
    return;
  }
  
  // Cargar los detalles del pedido
  await loadOrderDetails(orderId);
});

// Obtener el ID del pedido de la URL
function getOrderIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Cargar los detalles del pedido
async function loadOrderDetails(orderId) {
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Obtener el pedido con sus elementos
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*, product:product_id(*))
      `)
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    
    if (!order) {
      throw new Error('Pedido no encontrado');
    }
    
    // Actualizar los detalles en la página
    document.getElementById('order-number').textContent = order.id.substring(0, 8);
    document.getElementById('order-date').textContent = new Date(order.created_at).toLocaleDateString();
    document.getElementById('order-total').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('order-payment').textContent = getPaymentMethodText(order.payment_method);
    document.getElementById('order-status').textContent = getStatusText(order.status);
    
    // Mostrar los productos del pedido
    const itemsContainer = document.getElementById('order-items');
    
    if (order.order_items && order.order_items.length > 0) {
      itemsContainer.innerHTML = '<h2>Productos</h2>';
      
      const productsList = document.createElement('div');
      productsList.className = 'order-products';
      
      order.order_items.forEach(item => {
        const product = item.product;
        
        const productElement = document.createElement('div');
        productElement.className = 'checkout-item';
        
        productElement.innerHTML = `
          <img src="${product.image || 'images/product-placeholder.jpg'}" alt="${product.name}" class="checkout-item-image">
          <div class="checkout-item-details">
            <div class="checkout-item-name">${product.name}</div>
            <div class="checkout-item-price">
              <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        `;
        
        productsList.appendChild(productElement);
      });
      
      itemsContainer.appendChild(productsList);
    }
  } catch (error) {
    console.error('Error al cargar los detalles del pedido:', error);
    alert('Error al cargar los detalles del pedido. Por favor, intenta de nuevo.');
    window.location.href = 'index.html';
  }
}

// Obtener texto descriptivo del método de pago
function getPaymentMethodText(method) {
  const methodMap = {
    'card': 'Tarjeta de Crédito/Débito',
    'paypal': 'PayPal',
    'transfer': 'Transferencia Bancaria'
  };
  
  return methodMap[method] || 'Desconocido';
}

// Obtener texto descriptivo del estado del pedido
function getStatusText(status) {
  const statusMap = {
    'pending': 'Pendiente',
    'processing': 'Procesando',
    'shipped': 'Enviado',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado'
  };
  
  return statusMap[status] || 'Desconocido';
}
