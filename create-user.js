const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  const email = 'usuario@test.com';
  const password = 'Test123456';
  const phone = '123456789';
  
  try {
    console.log('Creando usuario en Supabase...');
    
    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Confirmar el email automáticamente
    });
    
    if (authError) {
      console.error('Error al crear el usuario en Auth:', authError);
      return;
    }
    
    console.log('Usuario creado en Auth:', authData.user.id);
    
    // 2. Crear perfil para el usuario
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          name: 'Usuario de Prueba',
          phone,
          level: 1,
          balance: 100.50,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (profileError) {
      console.error('Error al crear el perfil:', profileError);
      return;
    }
    
    console.log('Perfil creado exitosamente');
    console.log('\nDatos de acceso:');
    console.log('Email:', email);
    console.log('Contraseña:', password);
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

createUser();
