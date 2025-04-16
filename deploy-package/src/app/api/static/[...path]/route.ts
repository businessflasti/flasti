import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { stat, readFile } from 'fs/promises';

// Mapa de tipos MIME para diferentes extensiones de archivo
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
};

/**
 * Manejador para servir archivos estáticos
 */
export async function GET(request: NextRequest) {
  try {
    // Extraer la ruta del archivo de la URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.replace('/api/static/', '').split('/');
    const path = pathSegments || [];
    const filePath = join(process.cwd(), 'src/app/images', ...path);

    // Verificar si el archivo existe
    try {
      await stat(filePath);
    } catch (e) {
      console.error(`Archivo no encontrado: ${filePath}`);
      return new NextResponse('Archivo no encontrado', { status: 404 });
    }

    // Leer el archivo
    const fileContent = await readFile(filePath);

    // Determinar el tipo MIME basado en la extensión
    const extension = filePath.substring(filePath.lastIndexOf('.'));
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';

    // Devolver el archivo con el tipo de contenido correcto
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Caché por 1 día
      },
    });
  } catch (error) {
    console.error('Error al servir archivo estático:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
