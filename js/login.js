
// Funcionalidad para la página de inicio de sesión/registro

document.addEventListener('DOMContentLoaded', function() {
  // Verificar si ya está autenticado
  checkAuthStatus();
  
  // Configurar pestañas de login/registro
  setupAuthTabs();
  
  // Configurar formularios
  setupLoginForm();
  setupRegisterForm();
});

// Verificar si el usuario ya está autenticado
async function checkAuthStatus() {
  const { session } = await window.authService.getSession();
  
  if (session) {
    // Verificar si hay una redirección específica
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      // Redirigir a la página de inicio si ya está autenticado
      window.location.href = 'index.html';
    }
  }
}

// Configurar las pestañas de login/registro
function setupAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Quitar clase activa de todas las pestañas
      tabs.forEach(t => t.classList.remove('active'));
      
      // Añadir clase activa a la pestaña actual
      this.classList.add('active');
      
      // Mostrar el formulario correspondiente
      if (this.dataset.tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
      } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
      }
    });
  });
}

// Configurar el formulario de inicio de sesión
function setupLoginForm() {
  const loginForm = document.getElementById('form-login');
  const loginError = document.getElementById('login-error');
  const loginSuccess = document.getElementById('login-success');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Ocultar mensajes previos
      loginError.style.display = 'none';
      loginSuccess.style.display = 'none';
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      try {
        // Desactivar el botón de envío
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Iniciando sesión...';
        
        // Intentar iniciar sesión
        const { data, error } = await window.authService.signIn(email, password);
        
        if (error) throw error;
        
        // Mostrar mensaje de éxito
        loginSuccess.textContent = '¡Inicio de sesión exitoso! Redireccionando...';
        loginSuccess.style.display = 'block';
        
        // Verificar si es el administrador
        if (email === 'admin@charlotte.mx') {
          // Redirigir al panel de administración
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 1500);
        } else {
          // Verificar si hay una redirección específica
          const urlParams = new URLSearchParams(window.location.search);
          const redirectUrl = urlParams.get('redirect');
          
          if (redirectUrl) {
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1500);
          } else {
            // Redirigir a la página principal
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        
        // Mostrar mensaje de error
        loginError.textContent = error.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.';
        loginError.style.display = 'block';
        
        // Reactivar el botón de envío
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Iniciar Sesión';
      }
    });
  }
}

// Configurar el formulario de registro
function setupRegisterForm() {
  const registerForm = document.getElementById('form-register');
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Ocultar mensajes previos
      registerError.style.display = 'none';
      registerSuccess.style.display = 'none';
      
      const fullName = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      // Validar contraseñas
      if (password !== confirmPassword) {
        registerError.textContent = 'Las contraseñas no coinciden.';
        registerError.style.display = 'block';
        return;
      }
      
      // Verificar si es un intento de registro como administrador
      if (email === 'admin@charlotte.mx') {
        registerError.textContent = 'Este correo electrónico no está disponible para registro.';
        registerError.style.display = 'block';
        return;
      }
      
      try {
        // Desactivar el botón de envío
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';
        
        // Intentar registrarse
        const { data, error } = await window.authService.signUp(email, password, fullName);
        
        if (error) throw error;
        
        // Mostrar mensaje de éxito
        registerSuccess.textContent = '¡Registro exitoso! Verifica tu correo electrónico para confirmar tu cuenta.';
        registerSuccess.style.display = 'block';
        
        // Limpiar el formulario
        this.reset();
      } catch (error) {
        console.error('Error al registrarse:', error);
        
        // Mostrar mensaje de error
        registerError.textContent = error.message || 'Error al registrarse. Por favor, intenta de nuevo.';
        registerError.style.display = 'block';
      } finally {
        // Reactivar el botón de envío
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Registrarse';
      }
    });
  }
}
