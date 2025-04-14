
// Funciones para manejar los comentarios en todas las páginas

document.addEventListener('DOMContentLoaded', async function() {
  // Cargar comentarios
  await loadComments();
  
  // Configurar el formulario de comentarios
  setupCommentForm();
});

// Cargar comentarios
async function loadComments() {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  
  try {
    commentsList.innerHTML = '<p>Cargando comentarios...</p>';
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Verificar si estamos en una página de producto
    const productId = getProductIdFromUrl();
    
    let query = supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id(full_name),
        comment_replies(*, profiles:user_id(full_name))
      `)
      .order('created_at', { ascending: false });
    
    // Filtrar por producto si estamos en una página de producto
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      commentsList.innerHTML = '';
      
      data.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
      });
    } else {
      commentsList.innerHTML = '<p>No hay comentarios aún. ¡Sé el primero en comentar!</p>';
    }
  } catch (error) {
    console.error('Error al cargar los comentarios:', error);
    commentsList.innerHTML = '<p>Error al cargar los comentarios. Por favor, intenta de nuevo.</p>';
  }
}

// Crear elemento de comentario
function createCommentElement(comment) {
  const commentElement = document.createElement('div');
  commentElement.className = 'comment';
  
  const userName = comment.profiles ? comment.profiles.full_name : 'Usuario';
  const date = new Date(comment.created_at).toLocaleDateString();
  
  commentElement.innerHTML = `
    <div class="comment-header">
      <div class="comment-user">
        <span class="user-name">${userName}</span>
      </div>
      <div class="comment-date">${date}</div>
    </div>
    <div class="comment-content">
      <p>${comment.content}</p>
    </div>
  `;
  
  // Añadir respuestas si hay
  if (comment.comment_replies && comment.comment_replies.length > 0) {
    comment.comment_replies.forEach(reply => {
      const replyElement = document.createElement('div');
      replyElement.className = 'comment-reply';
      
      const replyUserName = reply.profiles ? reply.profiles.full_name : 'Administrador';
      const replyDate = new Date(reply.created_at).toLocaleDateString();
      
      replyElement.innerHTML = `
        <div class="comment">
          <div class="comment-header">
            <div class="comment-user">
              <span class="user-name">${replyUserName}</span>
              <span class="admin-badge">Admin</span>
            </div>
            <div class="comment-date">${replyDate}</div>
          </div>
          <div class="comment-content">
            <p>${reply.content}</p>
          </div>
        </div>
      `;
      
      commentElement.appendChild(replyElement);
    });
  }
  
  return commentElement;
}

// Configurar el formulario de comentarios
function setupCommentForm() {
  const commentForm = document.getElementById('comment-form');
  
  if (!commentForm) return;
  
  commentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Verificar si el usuario está autenticado
    const { session } = await window.authService.getSession();
    
    if (!session) {
      alert('Debes iniciar sesión para dejar un comentario');
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
      return;
    }
    
    const commentContent = document.getElementById('comment-content').value.trim();
    
    if (!commentContent) {
      alert('Por favor, escribe un comentario');
      return;
    }
    
    // Obtener el ID del producto si estamos en una página de producto
    const productId = getProductIdFromUrl();
    
    try {
      const supabase = supabase.createClient(supabaseUrl, supabaseKey);
      
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            user_id: session.user.id,
            content: commentContent,
            product_id: productId || null
          }
        ]);
      
      if (error) throw error;
      
      // Limpiar el formulario
      document.getElementById('comment-content').value = '';
      
      // Recargar comentarios
      await loadComments();
      
      alert('Comentario publicado con éxito');
    } catch (error) {
      console.error('Error al publicar el comentario:', error);
      alert('Error al publicar el comentario. Por favor, intenta de nuevo.');
    }
  });
}

// Obtener el ID del producto de la URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}
