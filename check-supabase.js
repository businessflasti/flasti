const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSupabase() {
  try {
    // Verificar si la tabla 'profiles' existe
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error al verificar las tablas:', tablesError);
      return;
    }
    
    const profilesTableExists = tables.some(table => table.table_name === 'profiles');
    console.log('¿Existe la tabla profiles?', profilesTableExists);
    
    if (!profilesTableExists) {
      console.log('Creando tabla profiles...');
      
      // Crear la tabla profiles
      const { error: createTableError } = await supabase.rpc('create_profiles_table');
      
      if (createTableError) {
        console.error('Error al crear la tabla profiles:', createTableError);
        console.log('Intentando crear la tabla manualmente...');
        
        // Intentar crear la tabla manualmente
        const { error: manualCreateError } = await supabase.query(`
          CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT NOT NULL,
            name TEXT,
            phone TEXT,
            level INTEGER DEFAULT 1,
            balance DECIMAL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        
        if (manualCreateError) {
          console.error('Error al crear la tabla manualmente:', manualCreateError);
        } else {
          console.log('Tabla profiles creada manualmente con éxito');
        }
      } else {
        console.log('Tabla profiles creada con éxito');
      }
    }
    
    // Verificar la configuración de autenticación
    console.log('\nVerificando configuración de autenticación...');
    const { data: authSettings, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Error al verificar la configuración de autenticación:', authError);
    } else {
      console.log('Configuración de autenticación:', authSettings ? 'OK' : 'No disponible');
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

checkSupabase();
