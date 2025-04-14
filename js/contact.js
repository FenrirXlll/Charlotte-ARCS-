
// Funcionalidad para la página de contacto

document.addEventListener('DOMContentLoaded', function() {
  // Configurar formulario de contacto
  setupContactForm();
});

// Configurar formulario de contacto
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');
  const contactError = document.getElementById('contact-error');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Ocultar mensajes previos
      contactSuccess.style.display = 'none';
      contactError.style.display = 'none';
      
      // Obtener valores del formulario
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;
      
      // Validar campos
      if (!name || !email || !subject || !message) {
        contactError.textContent = 'Por favor, completa todos los campos marcados con *';
        contactError.style.display = 'block';
        return;
      }
      
      try {
        // Deshabilitar botón de envío
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // Enviar mensaje a Supabase
        const supabase = supabase.createClient(supabaseUrl, supabaseKey);
        
        const { data, error } = await supabase
          .from('contact_messages')
          .insert([{
            name,
            email,
            subject,
            message
          }]);
        
        if (error) throw error;
        
        // Mostrar mensaje de éxito
        contactSuccess.textContent = '¡Mensaje enviado con éxito! Te responderemos lo antes posible.';
        contactSuccess.style.display = 'block';
        
        // Restablecer formulario
        contactForm.reset();
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        
        // Mostrar mensaje de error
        contactError.textContent = 'Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.';
        contactError.style.display = 'block';
      } finally {
        // Reactivar botón de envío
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
      }
    });
  }
}
