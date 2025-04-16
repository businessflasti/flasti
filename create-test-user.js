const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  const email = 'usuario.prueba@example.com';
  const password = 'Password123!';
  
  try {
    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) {
      console.error('Error al crear el usuario en Auth:', authError);
      return;
    }
    
    console.log('Usuario creado en Auth:', authData.user);
    
    // Crear perfil para el usuario
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          name: 'Usuario de Prueba',
          level: 1,
          balance: 100.50,
          created_at: new Date().toISOString(),
        },
      ]);
    
    if (profileError) {
      console.error('Error al crear el perfil:', profileError);
      return;
    }
    
    console.log('Perfil creado:', profileData);
    console.log('\nDatos de acceso:');
    console.log('Email:', email);
    console.log('Contraseña:', password);
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

createTestUser();
