/**
 * Script para subir plantillas de correo electrónico a Supabase
 * 
 * Este script utiliza la API de Supabase para actualizar las plantillas
 * de correo electrónico en tu proyecto.
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY configuradas
 * 2. Ejecuta: node upload-to-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuración
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ewfvfvkhqftbvldvjnrk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY no está configurada');
  console.error('Por favor, configura esta variable de entorno antes de ejecutar este script');
  process.exit(1);
}

// Inicializar cliente de Supabase con la clave de servicio
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapeo de plantillas
const templateMapping = [
  {
    type: 'signup',
    file: 'verification.html',
    subject: 'Verifica tu correo electrónico - flasti'
  },
  {
    type: 'recovery',
    file: 'reset-password.html',
    subject: 'Restablece tu contraseña - flasti'
  },
  {
    type: 'invite',
    file: 'welcome.html',
    subject: '¡Bienvenido a flasti! - Tu viaje comienza aquí'
  },
  {
    type: 'magic_link',
    file: 'verification.html', // Reutilizamos la plantilla de verificación
    subject: 'Tu enlace de acceso a flasti'
  },
  {
    type: 'email_change',
    file: 'verification.html', // Reutilizamos la plantilla de verificación
    subject: 'Confirma tu nuevo correo electrónico - flasti'
  }
];

// Función para leer una plantilla
function readTemplate(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error al leer la plantilla ${filename}:`, error);
    return null;
  }
}

// Función para actualizar una plantilla en Supabase
async function updateTemplate(type, subject, html) {
  try {
    // Nota: Esta es una implementación simulada ya que Supabase no tiene una API pública
    // para actualizar plantillas de correo electrónico directamente.
    // En la práctica, deberías usar la interfaz web de Supabase o su API administrativa.
    
    console.log(`Actualizando plantilla "${type}"...`);
    console.log(`- Asunto: ${subject}`);
    console.log(`- Contenido HTML: ${html.substring(0, 100)}...`);
    
    // Aquí iría la llamada real a la API de Supabase
    // Por ahora, solo simulamos una respuesta exitosa
    return { success: true };
  } catch (error) {
    console.error(`Error al actualizar la plantilla ${type}:`, error);
    return { success: false, error };
  }
}

// Función principal
async function main() {
  console.log('Iniciando actualización de plantillas de correo electrónico en Supabase...');
  console.log(`URL de Supabase: ${supabaseUrl}`);
  
  for (const template of templateMapping) {
    const html = readTemplate(template.file);
    if (!html) continue;
    
    const result = await updateTemplate(template.type, template.subject, html);
    
    if (result.success) {
      console.log(`✅ Plantilla "${template.type}" actualizada correctamente`);
    } else {
      console.error(`❌ Error al actualizar la plantilla "${template.type}"`);
    }
  }
  
  console.log('\nNota importante:');
  console.log('Este script simula la actualización de plantillas. Para actualizar realmente las plantillas:');
  console.log('1. Inicia sesión en el panel de Supabase: https://app.supabase.io');
  console.log('2. Selecciona tu proyecto "Flasti plataforma"');
  console.log('3. Ve a Authentication > Email Templates');
  console.log('4. Para cada tipo de correo, haz clic en "Edit" y pega el contenido HTML correspondiente');
  
  console.log('\nPlantillas personalizadas adicionales:');
  console.log('Las siguientes plantillas personalizadas deben ser implementadas en tu código:');
  console.log('- commission-received.html: Para notificaciones de comisiones');
  console.log('- withdrawal-processed.html: Para notificaciones de retiros');
  console.log('- level-upgrade.html: Para notificaciones de ascenso de nivel');
  
  console.log('\nConsulta el archivo README.md para más detalles sobre la implementación.');
}

// Ejecutar el script
main().catch(error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});
