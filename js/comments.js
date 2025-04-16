
// Funcionalidad para la sección de comentarios

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar sección de comentarios
  initComments();
  
  // Configurar el formulario de comentarios
  setupCommentForm();
  
  // Configurar los botones de vista
  setupViewToggle();
});

// Lista de comentarios de muestra
const sampleComments = [
  {
    id: "1",
    userName: "María Rodríguez",
    userAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
    content: "¡Excelente servicio! Los productos son de muy alta calidad y el trato del personal es inmejorable. La blusa que compré es exactamente como se veía en la foto y me quedó perfecta.",
    rating: 5,
    date: "15/03/2025"
  },
  {
    id: "2",
    userName: "Carlos Mendoza",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Muy contento con mi compra. El envío fue rápido y el producto llegó en perfectas condiciones. Repetiré sin duda.",
    rating: 5,
    date: "10/03/2025"
  },
  {
    id: "3",
    userName: "Sofía López",
    userAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    content: "La calidad de los productos es excelente. He comprado varias veces y nunca me han decepcionado. El servicio al cliente también es muy bueno.",
    rating: 5,
    date: "05/03/2025"
  },
  {
    id: "4",
    userName: "Javier Martínez",
    userAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    content: "Me encanta esta tienda. Los diseños son únicos y la calidad es superior. Siempre encuentro algo que me gusta.",
    rating: 4,
    date: "28/02/2025"
  },
  {
    id: "5",
    userName: "Lucía Hernández",
    userAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    content: "El envío tardó más de lo esperado. La calidad del producto es buena, pero deberían mejorar los tiempos de entrega.",
    rating: 3,
    date: "20/02/2025",
    replies: [
      {
        id: "5-reply-1",
        userName: "Atención al Cliente",
        content: "Estimada Lucía, lamentamos la demora en su entrega. Estamos trabajando para mejorar nuestros tiempos de envío. Le agradecemos sus comentarios y le ofrecemos un 10% de descuento en su próxima compra como compensación.",
        date: "21/02/2025"
      }
    ]
  },
  {
    id: "6",
    userName: "Eduardo González",
    userAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    content: "Muy satisfecho con mi compra. El perfume es exactamente como lo describían y el aroma dura todo el día.",
    rating: 5,
    date: "15/02/2025"
  },
  {
    id: "7",
    userName: "Ana Torres",
    userAvatar: "https://randomuser.me/api/portraits/women/42.jpg",
    content: "Excelente experiencia de compra. La página web es muy intuitiva y el proceso de pago es rápido y seguro.",
    rating: 5,
    date: "10/02/2025"
  },
  {
    id: "8",
    userName: "Roberto Sánchez",
    userAvatar: "https://randomuser.me/api/portraits/men/62.jpg",
    content: "Pedí un traje para una boda y llegó 2 días después de la fecha prometida. No pude usarlo para la ocasión. La calidad es buena, pero la demora fue inaceptable.",
    rating: 2,
    date: "05/02/2025",
    replies: [
      {
        id: "8-reply-1",
        userName: "Atención al Cliente",
        content: "Estimado Roberto, lamentamos profundamente esta situación. Entendemos la importancia de recibir los productos a tiempo, especialmente para ocasiones especiales. Nos gustaría ofrecerle un reembolso parcial como compensación. Por favor, contáctenos directamente para gestionarlo.",
        date: "06/02/2025"
      }
    ]
  },
  {
    id: "9",
    userName: "Carmen Díaz",
    userAvatar: "https://randomuser.me/api/portraits/women/52.jpg",
    content: "Los cosméticos que compré son de excelente calidad. Me encanta que sean productos exclusivos que no se encuentran en otras tiendas.",
    rating: 5,
    date: "30/01/2025"
  },
  {
    id: "10",
    userName: "Miguel Álvarez",
    userAvatar: "https://randomuser.me/api/portraits/men/72.jpg",
    content: "Compré un reloj como regalo para mi padre y quedó encantado. La presentación y el empaque son muy elegantes, perfectos para regalo.",
    rating: 5,
    date: "25/01/2025"
  }
];

// Inicializar comentarios
function initComments() {
  updateCommentsList();
  updateCommentsTable();
  
  // Por defecto, mostrar la vista de lista
  document.querySelector('[data-view="list"]').click();
}

// Configurar el formulario de comentarios
function setupCommentForm() {
  const commentForm = document.getElementById('comment-form');
  const ratingStars = document.querySelectorAll('#rating-stars .star');
  const ratingInput = document.getElementById('rating');
  
  // Configurar estrellas de valoración
  ratingStars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      ratingInput.value = rating;
      
      // Actualizar estrellas
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('filled');
        } else {
          s.classList.remove('filled');
        }
      });
    });
    
    // Efecto hover
    star.addEventListener('mouseenter', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
    });
  });
  
  // Quitar efecto hover al salir del contenedor
  document.getElementById('rating-stars').addEventListener('mouseleave', function() {
    ratingStars.forEach(star => {
      star.classList.remove('hover');
    });
  });
  
  // Manejar envío del formulario
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const commentText = document.getElementById('comment').value.trim();
      const rating = parseInt(document.getElementById('rating').value);
      
      if (!commentText) {
        alert('Por favor, escribe un comentario.');
        return;
      }
      
      // Crear nuevo comentario
      const newComment = {
        id: Date.now().toString(),
        userName: "Usuario Anónimo",
        content: commentText,
        rating: rating,
        date: new Date().toLocaleDateString()
      };
      
      // Simular guardado en base de datos
      sampleComments.unshift(newComment);
      
      // Actualizar vistas
      updateCommentsList();
      updateCommentsTable();
      
      // Reiniciar formulario
      commentForm.reset();
      document.getElementById('rating').value = "5";
      ratingStars.forEach(star => {
        star.classList.add('filled');
      });
      
      // Mostrar mensaje de confirmación
      alert('¡Gracias por tu comentario!');
    });
  }
}

// Actualizar la vista de lista de comentarios
function updateCommentsList() {
  const container = document.getElementById('comments-container');
  if (!container) return;
  
  let listHTML = '<div class="comment-list">';
  
  sampleComments.forEach(comment => {
    listHTML += `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div class="user-info">
            <img src="${comment.userAvatar || 'images/user-placeholder.jpg'}" alt="${comment.userName}" class="user-avatar">
            <span class="user-name">${comment.userName}</span>
          </div>
          <div class="comment-date">${comment.date}</div>
        </div>
        <div class="stars-container">
          ${renderStars(comment.rating)}
        </div>
        <div class="comment-content">
          <p>${comment.content}</p>
        </div>
        <div class="comment-actions">
          <button class="comment-action">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 10v12"></path>
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
            </svg>
            <span>Útil</span>
          </button>
          <button class="comment-action">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Responder</span>
          </button>
        </div>
        
        ${comment.replies ? renderReplies(comment.replies) : ''}
      </div>
    `;
  });
  
  listHTML += '</div>';
  
  // Guardar el contenido actual
  const currentView = document.querySelector('.view-button.active').getAttribute('data-view');
  
  // Insertar el HTML
  container.innerHTML = listHTML;
  
  // Si no estamos en la vista de lista, ocultar
  if (currentView !== 'list') {
    container.querySelector('.comment-list').style.display = 'none';
  }
}

// Actualizar la vista de tabla de comentarios
function updateCommentsTable() {
  const container = document.getElementById('comments-container');
  if (!container) return;
  
  let tableHTML = `
    <div class="comments-table-container" style="display: none;">
      <table class="comments-table">
        <thead>
          <tr>
            <th class="user-col">Usuario</th>
            <th class="rating-col">Valoración</th>
            <th class="content-col">Comentario</th>
            <th class="date-col">Fecha</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  sampleComments.forEach(comment => {
    tableHTML += `
      <tr>
        <td class="user-col">
          <div class="user-info">
            <img src="${comment.userAvatar || 'images/user-placeholder.jpg'}" alt="${comment.userName}" class="user-avatar">
            <span class="user-name">${comment.userName}</span>
          </div>
        </td>
        <td class="rating-col">
          <div class="stars-container">
            ${renderStars(comment.rating)}
          </div>
        </td>
        <td class="content-col">
          <p>${comment.content}</p>
          ${comment.replies ? `<div class="replies-count">${comment.replies.length} respuesta(s)</div>` : ''}
        </td>
        <td class="date-col">${comment.date}</td>
      </tr>
    `;
  });
  
  tableHTML += `
        </tbody>
      </table>
    </div>
  `;
  
  // Añadir la tabla al contenedor
  container.innerHTML += tableHTML;
}

// Configurar los botones de cambio de vista
function setupViewToggle() {
  const viewButtons = document.querySelectorAll('.view-button');
  const container = document.getElementById('comments-container');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover clase activa de todos los botones
      viewButtons.forEach(btn => btn.classList.remove('active'));
      
      // Añadir clase activa al botón clicked
      this.classList.add('active');
      
      const view = this.getAttribute('data-view');
      
      if (view === 'list') {
        container.querySelector('.comment-list').style.display = 'block';
        container.querySelector('.comments-table-container').style.display = 'none';
      } else {
        container.querySelector('.comment-list').style.display = 'none';
        container.querySelector('.comments-table-container').style.display = 'block';
      }
    });
  });
}

// Renderizar estrellas para la valoración
function renderStars(rating) {
  let starsHTML = '';
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += '<span class="star filled">★</span>';
    } else if (i - 0.5 === rating) {
      starsHTML += '<span class="star half-filled">★</span>';
    } else {
      starsHTML += '<span class="star">★</span>';
    }
  }
  
  return starsHTML;
}

// Renderizar respuestas a los comentarios
function renderReplies(replies) {
  let repliesHTML = '';
  
  replies.forEach(reply => {
    repliesHTML += `
      <div class="comment-reply">
        <div class="comment">
          <div class="comment-header">
            <div class="user-info">
              <span class="user-name">${reply.userName}</span>
            </div>
            <div class="comment-date">${reply.date}</div>
          </div>
          <div class="comment-content">
            <p>${reply.content}</p>
          </div>
        </div>
      </div>
    `;
  });
  
  return repliesHTML;
}

// Actualizar barras de progreso de la calificación
function updateRatingBars() {
  // Contar calificaciones
  const ratings = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  
  sampleComments.forEach(comment => {
    ratings[comment.rating]++;
  });
  
  // Actualizar barras
  const totalComments = sampleComments.length;
  
  for (let i = 5; i >= 1; i--) {
    const percent = (ratings[i] / totalComments) * 100;
    const progressBar = document.querySelector(`.rating-bar[data-rating="${i}"] .rating-progress-fill`);
    const countEl = document.querySelector(`.rating-bar[data-rating="${i}"] .rating-count`);
    
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
    
    if (countEl) {
      countEl.textContent = ratings[i];
    }
  }
}

// Animación al hacer scroll
document.addEventListener('scroll', function() {
  const comments = document.querySelectorAll('.comment');
  const commentForm = document.querySelector('.comment-form');
  
  // Comprobar si los elementos están en el viewport
  comments.forEach(comment => {
    if (isElementInViewport(comment) && !comment.classList.contains('animated')) {
      comment.classList.add('animated');
      animateElement(comment);
    }
  });
  
  if (commentForm && isElementInViewport(commentForm) && !commentForm.classList.contains('animated')) {
    commentForm.classList.add('animated');
    animateElement(commentForm);
  }
});

// Comprobar si un elemento está en el viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

// Animar un elemento
function animateElement(el) {
  el.style.animation = 'slideUp 0.5s ease forwards';
}
