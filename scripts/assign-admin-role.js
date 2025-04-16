// Este script asigna el rol de administrador a un usuario específico
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Email del usuario al que quieres asignar el rol de administrador
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Por favor proporciona el email del usuario como argumento');
  console.error('Ejemplo: node assign-admin-role.js usuario@ejemplo.com');
  process.exit(1);
}

async function assignAdminRole() {
  try {
    // Buscar el usuario por email
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) {
      console.error('Error al buscar usuario:', userError);
      return;
    }

    if (!userData) {
      console.error(`No se encontró ningún usuario con el email: ${userEmail}`);
      return;
    }

    const userId = userData.id;

    // Verificar si ya existe un rol para el usuario
    const { data: existingRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (roleError && !roleError.message.includes('No rows found')) {
      console.error('Error al verificar rol existente:', roleError);
      return;
    }

    if (existingRole) {
      // Actualizar rol existente
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error al actualizar rol:', updateError);
        return;
      }

      console.log(`Rol de administrador actualizado para el usuario: ${userEmail}`);
    } else {
      // Crear nuevo rol
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (insertError) {
        console.error('Error al crear rol:', insertError);
        return;
      }

      console.log(`Rol de administrador asignado al usuario: ${userEmail}`);
    }
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

assignAdminRole();
