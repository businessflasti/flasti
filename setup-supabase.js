const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabase() {
  try {
    console.log('Iniciando configuración de Supabase...');
    
    // Verificar si la tabla 'profiles' existe
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.log('La tabla profiles no existe, creándola...');
      
      // Crear la tabla profiles
      const { error: createTableError } = await supabase.rpc('create_profiles_table');
      
      if (createTableError) {
        console.error('Error al crear la tabla profiles:', createTableError);
        
        // Intentar crear la tabla manualmente
        const { error: manualCreateError } = await supabase.rpc('execute_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id),
              email TEXT,
              level INTEGER DEFAULT 1,
              balance DECIMAL DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Crear trigger para insertar automáticamente un perfil cuando se crea un usuario
            CREATE OR REPLACE FUNCTION public.handle_new_user() 
            RETURNS TRIGGER AS $$
            BEGIN
              INSERT INTO public.profiles (id, email, level, balance, created_at)
              VALUES (new.id, new.email, 1, 0, NOW());
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
            
            -- Eliminar el trigger si ya existe
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
            
            -- Crear el trigger
            CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
          `
        });
        
        if (manualCreateError) {
          console.error('Error al crear manualmente la tabla profiles:', manualCreateError);
        } else {
          console.log('Tabla profiles creada manualmente con éxito');
        }
      } else {
        console.log('Tabla profiles creada con éxito');
      }
    } else {
      console.log('La tabla profiles ya existe');
      console.log('Ejemplo de registro:', tables[0]);
    }
    
    console.log('Configuración de Supabase completada');
  } catch (error) {
    console.error('Error general:', error);
  }
}

setupSupabase();
