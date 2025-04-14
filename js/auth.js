
// Funciones para manejar autenticación en todas las páginas

document.addEventListener('DOMContentLoaded', async function() {
  // Comprobar si el usuario está autenticado
  const { session } = await window.authService.getSession();
  updateNavigation(session);
});

// Actualizar la navegación según el estado de autenticación
function updateNavigation(session) {
  const accountLink = document.getElementById('account-link');
  const loginLink = document.getElementById('login-link');
  
  if (session) {
    // Usuario autenticado
    if (accountLink) accountLink.style.display = 'inline-block';
    if (loginLink) loginLink.style.display = 'none';
    
    // Si estamos en la página de login, redirigir al inicio
    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
    }
  } else {
    // Usuario no autenticado
    if (accountLink) accountLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline-block';
    
    // Si estamos en la página de cuenta y no está autenticado, redirigir al login
    if (window.location.pathname.includes('account.html')) {
      window.location.href = 'login.html';
    }
  }
}

// Función para cerrar sesión
async function logout() {
  await window.authService.signOut();
  window.location.href = 'index.html';
}

// Generar un ID de sesión para el carrito de usuarios no autenticados
function getCartSessionId() {
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
}

// Función para generar un UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
