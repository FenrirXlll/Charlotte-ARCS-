
// Funcionalidad para administrar comentarios en el panel de administración

document.addEventListener('DOMContentLoaded', function() {
  // Verificar si estamos en la pestaña de comentarios
  if (document.getElementById('comments-tab')) {
    // Cargar comentarios para administración
    loadAdminComments();
  }
});

// Cargar comentarios para administración
async function loadAdminComments() {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  
  try {
    commentsList.innerHTML = '<p>Cargando comentarios...</p>';
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id(full_name),
        products:product_id(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      commentsList.innerHTML = '';
      
      data.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-card';
        
        const userName = comment.profiles ? comment.profiles.full_name : 'Usuario';
        const date = new Date(comment.created_at).toLocaleDateString();
        const productName = comment.products ? comment.products.name : 'General';
        
        commentCard.innerHTML = `
          <div class="comment-header">
            <div class="comment-user">
              <span class="user-name">${userName}</span>
              ${comment.product_id ? `<span class="comment-product">en <a href="product.html?id=${comment.product_id}">${productName}</a></span>` : ''}
            </div>
            <div class="comment-date">${date}</div>
          </div>
          <div class="comment-content">
            <p>${comment.content}</p>
          </div>
          <div class="comment-actions">
            <button class="btn outline-btn reply-comment-btn" data-id="${comment.id}">Responder</button>
            <button class="btn destructive-btn delete-comment-btn" data-id="${comment.id}">Eliminar</button>
          </div>
        `;
        
        commentsList.appendChild(commentCard);
        
        // Añadir evento al botón de eliminar
        commentCard.querySelector('.delete-comment-btn').addEventListener('click', function() {
          const commentId = this.dataset.id;
          if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
            deleteComment(commentId);
          }
        });
        
        // Añadir evento al botón de responder
        commentCard.querySelector('.reply-comment-btn').addEventListener('click', function() {
          const commentId = this.dataset.id;
          showReplyForm(commentId, commentCard);
        });
      });
    } else {
      commentsList.innerHTML = '<p>No hay comentarios.</p>';
    }
  } catch (error) {
    console.error('Error al cargar los comentarios:', error);
    commentsList.innerHTML = '<p>Error al cargar los comentarios. Por favor, intenta de nuevo.</p>';
  }
}

// Mostrar formulario de respuesta
function showReplyForm(commentId, commentCard) {
  // Verificar si ya existe un formulario de respuesta
  if (commentCard.querySelector('.reply-form')) {
    return;
  }
  
  // Crear formulario de respuesta
  const replyForm = document.createElement('div');
  replyForm.className = 'reply-form';
  
  replyForm.innerHTML = `
    <div class="form-group">
      <textarea placeholder="Escribe tu respuesta..." class="reply-content"></textarea>
    </div>
    <div class="form-actions">
      <button class="btn primary-btn submit-reply-btn">Responder</button>
      <button class="btn outline-btn cancel-reply-btn">Cancelar</button>
    </div>
  `;
  
  // Añadir el formulario de respuesta al comentario
  commentCard.appendChild(replyForm);
  
  // Enfocar el textarea
  replyForm.querySelector('textarea').focus();
  
  // Añadir evento al botón de cancelar
  replyForm.querySelector('.cancel-reply-btn').addEventListener('click', function() {
    replyForm.remove();
  });
  
  // Añadir evento al botón de enviar
  replyForm.querySelector('.submit-reply-btn').addEventListener('click', async function() {
    const replyContent = replyForm.querySelector('textarea').value.trim();
    
    if (!replyContent) {
      alert('Por favor, escribe una respuesta');
      return;
    }
    
    await submitReply(commentId, replyContent);
    replyForm.remove();
  });
}

// Enviar respuesta a un comentario
async function submitReply(commentId, content) {
  try {
    const { session } = await window.authService.getSession();
    
    if (!session) {
      alert('Debes iniciar sesión para responder');
      return;
    }
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select('product_id')
      .eq('id', commentId)
      .single();
    
    if (commentError) throw commentError;
    
    const { error } = await supabase
      .from('comment_replies')
      .insert([
        {
          comment_id: commentId,
          user_id: session.user.id,
          content,
          product_id: comment.product_id
        }
      ]);
    
    if (error) throw error;
    
    alert('Respuesta enviada con éxito');
    loadAdminComments();
  } catch (error) {
    console.error('Error al enviar la respuesta:', error);
    alert('Error al enviar la respuesta: ' + error.message);
  }
}

// Eliminar un comentario
async function deleteComment(commentId) {
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Eliminar primero las respuestas asociadas
    const { error: repliesError } = await supabase
      .from('comment_replies')
      .delete()
      .eq('comment_id', commentId);
    
    if (repliesError) throw repliesError;
    
    // Luego eliminar el comentario
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
    
    alert('Comentario eliminado con éxito');
    loadAdminComments();
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    alert('Error al eliminar el comentario: ' + error.message);
  }
}
