/**
 * Script para copiar las plantillas de correo electrónico al directorio de compilación
 * 
 * Este script debe ejecutarse después de la compilación de Next.js para asegurarse
 * de que las plantillas de correo electrónico estén disponibles en el servidor.
 * 
 * Uso:
 * 1. Añadir al package.json en scripts:
 *    "postbuild": "node scripts/copy-email-templates.js"
 */

const fs = require('fs');
const path = require('path');

// Directorios de origen y destino
const sourceDir = path.join(__dirname, '..', 'email-templates');
const destDir = path.join(__dirname, '..', '.next', 'server', 'email-templates');

// Crear el directorio de destino si no existe
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Directorio creado: ${destDir}`);
}

// Copiar todas las plantillas
try {
  const files = fs.readdirSync(sourceDir);
  
  for (const file of files) {
    // Solo copiar archivos HTML
    if (path.extname(file) === '.html') {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copiado: ${file}`);
    }
  }
  
  console.log('Todas las plantillas de correo electrónico han sido copiadas correctamente.');
} catch (error) {
  console.error('Error al copiar las plantillas de correo electrónico:', error);
  process.exit(1);
}
