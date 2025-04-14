
// Funcionalidad para la página de preguntas frecuentes

document.addEventListener('DOMContentLoaded', function() {
  // Configurar tabs de categorías
  setupFaqTabs();
  
  // Configurar acordeón de preguntas
  setupFaqAccordion();
});

// Configurar los tabs de categorías
function setupFaqTabs() {
  const categoryButtons = document.querySelectorAll('.faq-category');
  const categoryContents = document.querySelectorAll('.faq-category-content');
  
  if (categoryButtons.length === 0 || categoryContents.length === 0) return;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Quitar clase activa de todos los botones
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Agregar clase activa al botón actual
      this.classList.add('active');
      
      // Mostrar el contenido correspondiente
      const category = this.dataset.category;
      
      // Ocultar todos los contenidos
      categoryContents.forEach(content => content.classList.remove('active'));
      
      // Mostrar el contenido correspondiente
      document.getElementById(category).classList.add('active');
    });
  });
}

// Configurar el acordeón de preguntas
function setupFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  
  if (questions.length === 0) return;
  
  questions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      
      // Verificar si el ítem ya está activo
      const isActive = faqItem.classList.contains('active');
      
      // Cerrar todos los ítems activos
      document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
      });
      
      // Si el ítem no estaba activo, activarlo
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
}
