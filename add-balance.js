// Script para agregar saldo a la cuenta de un usuario
// Ejecutar con: node add-balance.js

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'TU_URL_DE_SUPABASE';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'TU_CLAVE_DE_SERVICIO_DE_SUPABASE';

// Crear cliente de Supabase con la clave de servicio para tener acceso completo
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Datos del usuario y monto a agregar
const userEmail = 'fagibor419@provko.com';
const amountToAdd = 100; // $100 USD

async function addBalance() {
  try {
    console.log(`Agregando $${amountToAdd} a la cuenta de ${userEmail}...`);
    
    // Buscar el usuario por correo electrónico
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (userError) {
      console.error('Error al buscar usuario:', userError);
      
      // Intentar buscar en auth.users
      const { data: authUserData, error: authUserError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', userEmail)
        .single();
      
      if (authUserError) {
        console.error('Error al buscar usuario en auth.users:', authUserError);
        return;
      }
      
      userData = authUserData;
    }
    
    if (!userData) {
      console.error('Usuario no encontrado');
      return;
    }
    
    const userId = userData.id;
    console.log(`Usuario encontrado con ID: ${userId}`);
    
    // Verificar si el usuario tiene un perfil en user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error al verificar perfil:', profileError);
      return;
    }
    
    if (profileData) {
      // Actualizar balance en user_profiles
      const currentBalance = profileData.balance || 0;
      const newBalance = currentBalance + amountToAdd;
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ balance: newBalance })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error al actualizar balance:', updateError);
        return;
      }
      
      console.log(`Balance actualizado correctamente. Nuevo balance: $${newBalance}`);
    } else {
      // Crear perfil en user_profiles
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          balance: amountToAdd,
          level: 1
        });
      
      if (insertError) {
        console.error('Error al crear perfil:', insertError);
        return;
      }
      
      console.log(`Perfil creado correctamente con balance inicial: $${amountToAdd}`);
    }
    
    console.log('Operación completada con éxito');
  } catch (error) {
    console.error('Error general:', error);
  }
}

// Ejecutar la función
addBalance();
