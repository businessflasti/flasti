import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

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
 * Manejador para servir el archivo checkout.html estático
 */
export async function GET(request: NextRequest) {
  try {
    // Leer el archivo HTML
    const filePath = join(process.cwd(), 'src/app/images/checkout.html');
    const html = readFileSync(filePath, 'utf-8');

    // Modificar las rutas de los recursos estáticos para usar la carpeta public
    const modifiedHtml = html
      .replace(/href="styles\.css"/g, 'href="/images/styles.css"')
      .replace(/href="responsive\.css"/g, 'href="/images/responsive.css"')
      .replace(/href="checkout\.css"/g, 'href="/images/checkout.css"')
      .replace(/src="script\.js"/g, 'src="/images/script.js"')
      .replace(/src="checkout\.js"/g, 'src="/images/checkout.js"')
      .replace(/src="affiliate-tracking\.js"/g, 'src="/images/affiliate-tracking.js"')
      .replace(/href="images\//g, 'href="/images/images/')
      .replace(/src="images\//g, 'src="/images/images/');

    // Devolver el HTML modificado con el tipo de contenido correcto
    return new NextResponse(modifiedHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error al servir checkout.html:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
