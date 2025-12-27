// Script para probar la conexión con Supabase
// Ejecuta con: node test-supabase-connection.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Verificando configuración...');
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada');
console.log('Service Key:', supabaseServiceKey ? '✅ Configurada' : '❌ No configurada');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('\n🔍 Probando conexión con Supabase...');
    
    // Test 1: Verificar que podemos consultar user_profiles
    console.log('\n📋 Test 1: Consultando user_profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, email, is_admin')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ Error consultando user_profiles:', profilesError);
    } else {
      console.log('✅ user_profiles accesible');
      console.log(`   Encontrados ${profiles.length} perfiles`);
      const adminCount = profiles.filter(p => p.is_admin).length;
      console.log(`   Admins encontrados: ${adminCount}`);
    }
    
    // Test 2: Verificar admin específico
    console.log('\n📋 Test 2: Verificando admin flasti.business@gmail.com...');
    const { data: adminProfile, error: adminError } = await supabase
      .from('user_profiles')
      .select('user_id, email, is_admin')
      .eq('email', 'flasti.business@gmail.com')
      .single();
    
    if (adminError) {
      console.error('❌ Error consultando admin:', adminError);
    } else if (adminProfile) {
      console.log('✅ Admin encontrado:');
      console.log('   User ID:', adminProfile.user_id);
      console.log('   Email:', adminProfile.email);
      console.log('   Is Admin:', adminProfile.is_admin);
    } else {
      console.log('❌ Admin no encontrado');
    }
    
    // Test 3: Probar auth.admin.listUsers
    console.log('\n📋 Test 3: Probando auth.admin.listUsers...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 5
    });
    
    if (authError) {
      console.error('❌ Error listando usuarios:', authError);
    } else {
      console.log('✅ auth.admin.listUsers funciona');
      console.log(`   Usuarios encontrados: ${authData.users.length}`);
    }
    
    console.log('\n✅ Todas las pruebas completadas');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testConnection();
