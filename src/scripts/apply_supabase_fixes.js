// Script para aplicar correcciones a Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://ewfvfvkhqftbvldvjnrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZnZmdmtocWZ0YnZsZHZqbnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTczMDgsImV4cCI6MjA1ODk5MzMwOH0.6AuPXHtii0dCrVrZg2whHa5ZyO_4VVN9dDNKIjN7pMo';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Leer el archivo SQL
const sqlFilePath = path.join(__dirname, 'fix_registration_issues.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

// Función principal
async function applyFixes() {
  console.log('Aplicando correcciones a Supabase...');
  
  try {
    // Ejecutar el script SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sqlQuery });
    
    if (error) {
      console.error('Error al ejecutar el script SQL:', error);
      
      // Intentar ejecutar el script por partes
      console.log('Intentando ejecutar el script por partes...');
      
      // Dividir el script en sentencias individuales
      const statements = sqlQuery.split(';').filter(stmt => stmt.trim() !== '');
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i] + ';';
        console.log(`Ejecutando sentencia ${i + 1} de ${statements.length}...`);
        
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql_query: stmt });
          
          if (stmtError) {
            console.error(`Error en la sentencia ${i + 1}:`, stmtError);
          } else {
            console.log(`Sentencia ${i + 1} ejecutada correctamente.`);
          }
        } catch (stmtErr) {
          console.error(`Error al ejecutar la sentencia ${i + 1}:`, stmtErr);
        }
      }
    } else {
      console.log('Script SQL ejecutado correctamente.');
    }
    
    // Verificar que las tablas existen
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['profiles', 'user_profiles']);
      
    if (tablesError) {
      console.error('Error al verificar tablas:', tablesError);
    } else {
      console.log('Tablas existentes:', tablesData.map(t => t.table_name).join(', '));
    }
    
    // Verificar políticas de seguridad
    const { data: policiesData, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .in('tablename', ['profiles', 'user_profiles']);
      
    if (policiesError) {
      console.error('Error al verificar políticas:', policiesError);
    } else {
      console.log('Políticas existentes:', policiesData.length);
    }
    
    console.log('Correcciones aplicadas correctamente.');
  } catch (err) {
    console.error('Error inesperado:', err);
  }
}

// Ejecutar la función principal
applyFixes();
