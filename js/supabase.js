
// Configuración de Supabase
const supabaseUrl = 'https://rjzhkazdkwgwphewtyna.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqemhrYXpka3dnd3BoZXd0eW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTUyODgsImV4cCI6MjA1OTc5MTI4OH0.hdoQ-frg9aob8y8ihesOUhqMzVX8OqP8_UBhZjkl9ow';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Funciones para manejar la autenticación
async function signUp(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al registrarse:', error.message);
    return { data: null, error };
  }
}

async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { data: null, error };
  }
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
    return { error };
  }
}

// Verificar si hay una sesión activa
async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error al obtener la sesión:', error.message);
    return { session: null, error };
  }
}

// Exportar las funciones
window.authService = {
  signUp,
  signIn,
  signOut,
  getSession
};
