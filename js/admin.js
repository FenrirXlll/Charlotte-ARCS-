// Funcionalidad para el panel de administración

document.addEventListener('DOMContentLoaded', async function() {
  // Verificar si el usuario tiene acceso de administrador
  await checkAdminAccess();
  
  // Configurar las pestañas de administración
  setupAdminTabs();
  
  // Configurar listeners de eventos para el panel de administración
  setupProductListeners();
  setupOrderManagement();
  setupSiteSettings();
  setupCommentManagement();
});

// Verificar si el usuario tiene acceso de administrador
async function checkAdminAccess() {
  try {
    const { session } = await window.authService.getSession();
    
    if (!session) {
      // Redirigir al inicio de sesión si no está autenticado
      window.location.href = 'login.html?redirect=admin';
      return;
    }
    
    // Verificar si el correo es admin@charlotte.mx
    if (session.user.email !== 'admin@charlotte.mx') {
      // No es administrador, redirigir al inicio
      alert('No tienes permisos de administrador');
      window.location.href = 'index.html';
      return;
    }
    
    // Mostrar el panel de administración
    document.querySelector('.admin-panel').style.display = 'block';
    document.getElementById('admin-loading').style.display = 'none';
  } catch (error) {
    console.error('Error al verificar acceso de administrador:', error);
    alert('Error al verificar permisos. Por favor, intenta de nuevo.');
    window.location.href = 'index.html';
  }
}

// Configurar las pestañas de administración
function setupAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Desactivar todas las pestañas
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Activar la pestaña seleccionada
      this.classList.add('active');
      const tabId = this.dataset.tab;
      document.getElementById(`${tabId}-tab`).classList.add('active');
      
      // Cargar datos específicos de la pestaña si es necesario
      if (tabId === 'products') {
        loadProductList();
      } else if (tabId === 'orders') {
        loadOrdersList();
      } else if (tabId === 'comments') {
        // Cargar comentarios
        if (typeof window.commentsAdmin !== 'undefined' && window.commentsAdmin.loadCommentsForAdmin) {
          window.commentsAdmin.loadCommentsForAdmin();
        } else {
          loadAdminComments();
        }
      }
    });
  });
}

// Configurar la gestión de productos
function setupProductListeners() {
  // Cargar lista de productos
  loadProductList();
  
  // Listener para formulario de añadir producto
  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await addProduct(this);
    });
  }
  
  // Listener para formulario de editar producto
  const editProductForm = document.getElementById('edit-product-form');
  if (editProductForm) {
    editProductForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      await updateProduct(productId, this);
    });
  }
}

// Cargar lista de productos para administración
async function loadProductList() {
  const container = document.getElementById('products-list');
  if (!container) return;
  
  try {
    container.innerHTML = '<p>Cargando productos...</p>';
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      container.innerHTML = '';
      
      // Crear tabla de productos
      const table = document.createElement('table');
      table.className = 'admin-table';
      
      // Crear encabezado
      table.innerHTML = `
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Inventario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="products-table-body"></tbody>
      `;
      
      container.appendChild(table);
      const tbody = document.getElementById('products-table-body');
      
      // Agregar filas de productos
      data.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${product.image || 'images/product-placeholder.jpg'}" alt="${product.name}" class="admin-product-thumb"></td>
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.inventory_count || 0}</td>
          <td>
            <button class="btn outline-btn edit-product-btn" data-id="${product.id}">Editar</button>
            <button class="btn destructive-btn delete-product-btn" data-id="${product.id}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
        
        // Añadir listeners a los botones
        row.querySelector('.edit-product-btn').addEventListener('click', () => showEditProductForm(product));
        row.querySelector('.delete-product-btn').addEventListener('click', () => confirmDeleteProduct(product));
      });
    } else {
      container.innerHTML = '<p>No hay productos disponibles. Agrega tu primer producto.</p>';
    }
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    container.innerHTML = '<p>Error al cargar los productos. Por favor, intenta de nuevo.</p>';
  }
}

// Mostrar el formulario de edición de producto
function showEditProductForm(product) {
  const form = document.getElementById('edit-product-form');
  if (!form) return;
  
  // Ocultar el formulario de añadir y mostrar el de editar
  document.getElementById('add-product-section').style.display = 'none';
  document.getElementById('edit-product-section').style.display = 'block';
  
  // Rellenar el formulario con los datos del producto
  form.dataset.productId = product.id;
  form.querySelector('#edit-product-name').value = product.name;
  form.querySelector('#edit-product-price').value = product.price;
  form.querySelector('#edit-product-description').value = product.description;
  form.querySelector('#edit-product-inventory').value = product.inventory_count || 0;
  form.querySelector('#edit-product-category').value = product.category;
  
  // Opciones adicionales
  if (form.querySelector('#edit-product-is-new')) {
    form.querySelector('#edit-product-is-new').checked = product.is_new || false;
  }
  if (form.querySelector('#edit-product-discount')) {
    form.querySelector('#edit-product-discount').value = product.discount_percentage || 0;
  }
  
  // Imagen actual
  const currentImagePreview = form.querySelector('#edit-current-image');
  if (currentImagePreview) {
    currentImagePreview.src = product.image || 'images/product-placeholder.jpg';
    currentImagePreview.style.display = 'block';
  }
  
  // Scroll al formulario
  form.scrollIntoView({ behavior: 'smooth' });
}

// Actualizar un producto existente
async function updateProduct(productId, form) {
  try {
    // Obtener valores del formulario
    const name = form.querySelector('#edit-product-name').value;
    const price = parseFloat(form.querySelector('#edit-product-price').value);
    const description = form.querySelector('#edit-product-description').value;
    const inventory = parseInt(form.querySelector('#edit-product-inventory').value);
    const category = form.querySelector('#edit-product-category').value;
    const isNew = form.querySelector('#edit-product-is-new')?.checked || false;
    const discountPercentage = parseInt(form.querySelector('#edit-product-discount')?.value || 0);
    
    // Validar datos
    if (!name || isNaN(price) || !description || !category) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    // Actualizar producto en Supabase
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Preparar datos para la actualización
    const productData = {
      name,
      price,
      description,
      inventory_count: inventory,
      category,
      is_new: isNew,
      discount_percentage: discountPercentage > 0 ? discountPercentage : null,
      updated_at: new Date()
    };
    
    // Manejar la subida de imagen si hay una nueva
    const imageInput = form.querySelector('#edit-product-image');
    if (imageInput && imageInput.files && imageInput.files[0]) {
      const file = imageInput.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      // Subir imagen
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL de la imagen
      const { data: imageData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      productData.image = imageData.publicUrl;
    }
    
    // Actualizar producto
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId);
    
    if (error) throw error;
    
    alert('Producto actualizado con éxito');
    loadProductList();
    
    // Restablecer formulario y volver a la lista
    form.reset();
    document.getElementById('edit-product-section').style.display = 'none';
    document.getElementById('add-product-section').style.display = 'block';
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    alert('Error al actualizar el producto: ' + error.message);
  }
}

// Confirmar eliminación de producto
function confirmDeleteProduct(product) {
  if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}"?`)) {
    deleteProduct(product.id);
  }
}

// Eliminar un producto
async function deleteProduct(productId) {
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Eliminar el producto
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) throw error;
    
    alert('Producto eliminado con éxito');
    loadProductList();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    alert('Error al eliminar el producto: ' + error.message);
  }
}

// Añadir un nuevo producto
async function addProduct(form) {
  try {
    // Obtener valores del formulario
    const name = form.querySelector('#add-product-name').value;
    const price = parseFloat(form.querySelector('#add-product-price').value);
    const description = form.querySelector('#add-product-description').value;
    const inventory = parseInt(form.querySelector('#add-product-inventory').value || 0);
    const category = form.querySelector('#add-product-category').value;
    const isNew = form.querySelector('#add-product-is-new')?.checked || false;
    const discountPercentage = parseInt(form.querySelector('#add-product-discount')?.value || 0);
    
    // Validar datos
    if (!name || isNaN(price) || !description || !category) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    // Obtener imagen
    const imageInput = form.querySelector('#add-product-image');
    if (!imageInput || !imageInput.files || !imageInput.files[0]) {
      alert('Por favor, selecciona una imagen para el producto.');
      return;
    }
    
    // Subir imagen a Supabase Storage
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    const file = imageInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    // Subir imagen
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Obtener URL de la imagen
    const { data: imageData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    // Crear el producto en la base de datos
    const { error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price,
          description,
          image: imageData.publicUrl,
          inventory_count: inventory,
          category,
          is_new: isNew,
          discount_percentage: discountPercentage > 0 ? discountPercentage : null
        }
      ]);
    
    if (error) throw error;
    
    alert('Producto añadido con éxito');
    form.reset();
    loadProductList();
  } catch (error) {
    console.error('Error al añadir el producto:', error);
    alert('Error al añadir el producto: ' + error.message);
  }
}

// Configurar la gestión de pedidos
function setupOrderManagement() {
  // Cargar lista de pedidos
  loadOrdersList();
  
  // Listener para cambios de estado de pedidos
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('update-order-status')) {
      const orderId = e.target.dataset.orderId;
      const status = e.target.dataset.status;
      updateOrderStatus(orderId, status);
    }
  });
}

// Cargar lista de pedidos para administración
async function loadOrdersList() {
  const container = document.getElementById('orders-list');
  if (!container) return;
  
  try {
    container.innerHTML = '<p>Cargando pedidos...</p>';
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id(full_name),
        order_items:order_items(*, product:product_id(*))
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      container.innerHTML = '';
      
      data.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Calcular total de productos
        const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Construir HTML del pedido
        orderCard.innerHTML = `
          <div class="order-header">
            <div class="order-info">
              <h3>Pedido #${order.id.substring(0, 8)}</h3>
              <p>Cliente: ${order.profiles?.full_name || 'Usuario'}</p>
              <p>Fecha: ${new Date(order.created_at).toLocaleDateString()}</p>
              <p>Total: $${order.total.toFixed(2)}</p>
              <p>Estado: <span class="order-status status-${order.status}">${getStatusText(order.status)}</span></p>
            </div>
            <div class="order-actions">
              <select class="status-select" data-order-id="${order.id}">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Procesando</option>
                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregado</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
              </select>
              <button class="btn primary-btn update-order-status" data-order-id="${order.id}">Actualizar</button>
            </div>
          </div>
          <div class="order-items">
            <h4>Productos (${totalItems})</h4>
            <div class="order-products-list">
              ${order.order_items.map(item => `
                <div class="order-product">
                  <img src="${item.product?.image || 'images/product-placeholder.jpg'}" alt="${item.product?.name}">
                  <div class="order-product-info">
                    <p>${item.product?.name}</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio: $${item.price.toFixed(2)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="order-shipping">
            <h4>Información de envío</h4>
            <p>${order.shipping_address}</p>
          </div>
        `;
        
        container.appendChild(orderCard);
        
        // Añadir listener para el cambio de estado
        const statusSelect = orderCard.querySelector('.status-select');
        const updateButton = orderCard.querySelector('.update-order-status');
        
        statusSelect.addEventListener('change', function() {
          updateButton.dataset.status = this.value;
        });
      });
    } else {
      container.innerHTML = '<p>No hay pedidos disponibles.</p>';
    }
  } catch (error) {
    console.error('Error al cargar los pedidos:', error);
    container.innerHTML = '<p>Error al cargar los pedidos. Por favor, intenta de nuevo.</p>';
  }
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

// Actualizar el estado de un pedido
async function updateOrderStatus(orderId, status) {
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
    
    alert('Estado del pedido actualizado correctamente');
    loadOrdersList();
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    alert('Error al actualizar el estado del pedido: ' + error.message);
  }
}

// Configurar opciones del sitio
function setupSiteSettings() {
  const siteSettingsForm = document.getElementById('site-settings-form');
  if (siteSettingsForm) {
    // Cargar configuración actual
    loadSiteSettings();
    
    // Listener para formulario de configuración
    siteSettingsForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await saveSiteSettings(this);
    });
  }
}

// Cargar configuración del sitio
async function loadSiteSettings() {
  const form = document.getElementById('site-settings-form');
  if (!form) return;
  
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Supongamos que tenemos una tabla 'site_settings' para almacenar configuración
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 es el código para "no se encontraron resultados"
      throw error;
    }
    
    // Si hay datos, rellenar el formulario
    if (data) {
      if (form.querySelector('#setting-shop-enabled')) {
        form.querySelector('#setting-shop-enabled').checked = data.shop_enabled;
      }
      
      if (form.querySelector('#setting-shipping-rate')) {
        form.querySelector('#setting-shipping-rate').value = data.shipping_rate || 0;
      }
      
      if (form.querySelector('#setting-free-shipping-threshold')) {
        form.querySelector('#setting-free-shipping-threshold').value = data.free_shipping_threshold || 0;
      }
      
      if (form.querySelector('#setting-store-notice')) {
        form.querySelector('#setting-store-notice').value = data.store_notice || '';
      }
    }
  } catch (error) {
    console.error('Error al cargar la configuración del sitio:', error);
    alert('Error al cargar la configuración del sitio: ' + error.message);
  }
}

// Guardar configuración del sitio
async function saveSiteSettings(form) {
  try {
    const shopEnabled = form.querySelector('#setting-shop-enabled')?.checked || false;
    const shippingRate = parseFloat(form.querySelector('#setting-shipping-rate')?.value || 0);
    const freeShippingThreshold = parseFloat(form.querySelector('#setting-free-shipping-threshold')?.value || 0);
    const storeNotice = form.querySelector('#setting-store-notice')?.value || '';
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Verificar si ya existe una configuración
    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);
    
    if (fetchError) throw fetchError;
    
    let saveError;
    
    if (data && data.length > 0) {
      // Actualizar configuración existente
      const { error } = await supabase
        .from('site_settings')
        .update({
          shop_enabled: shopEnabled,
          shipping_rate: shippingRate,
          free_shipping_threshold: freeShippingThreshold,
          store_notice: storeNotice,
          updated_at: new Date()
        })
        .eq('id', data[0].id);
      
      saveError = error;
    } else {
      // Crear nueva configuración
      const { error } = await supabase
        .from('site_settings')
        .insert([{
          shop_enabled: shopEnabled,
          shipping_rate: shippingRate,
          free_shipping_threshold: freeShippingThreshold,
          store_notice: storeNotice
        }]);
      
      saveError = error;
    }
    
    if (saveError) throw saveError;
    
    alert('Configuración guardada con éxito');
  } catch (error) {
    console.error('Error al guardar la configuración del sitio:', error);
    alert('Error al guardar la configuración del sitio: ' + error.message);
  }
}

// Configurar la gestión de comentarios
function setupCommentManagement() {
  // Si estamos en la pestaña de comentarios, cargar los comentarios
  const commentsTab = document.querySelector('.admin-tab[data-tab="comments"]');
  if (commentsTab && commentsTab.classList.contains('active')) {
    if (typeof window.commentsAdmin !== 'undefined' && window.commentsAdmin.loadCommentsForAdmin) {
      window.commentsAdmin.loadCommentsForAdmin();
    } else {
      loadAdminComments();
    }
  }
}

// Cargar comentarios para administración - Función de respaldo
function loadAdminComments() {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  
  commentsList.innerHTML = '<p>Cargando comentarios...</p>';
  
  // Intentar cargar el script de administración de comentarios
  const script = document.createElement('script');
  script.src = 'js/admin-comments.js';
  script.onload = function() {
    // El script se ha cargado correctamente
    if (typeof loadAdminComments === 'function') {
      loadAdminComments();
    }
  };
  script.onerror = function() {
    // Error al cargar el script
    commentsList.innerHTML = '<p>Error al cargar la funcionalidad de comentarios. Por favor, recarga la página.</p>';
  };
  
  document.head.appendChild(script);
}
