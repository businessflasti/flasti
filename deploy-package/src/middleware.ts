// Middleware para rastreo de afiliados y servir archivos estáticos
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AffiliateServiceEnhanced } from './lib/affiliate-service-enhanced';
import { supabase } from './lib/supabase';
import { affiliateNotificationService } from './lib/affiliate-notification-service';
import { join } from 'path';
import { stat, readFile } from 'fs/promises';

const affiliateService = AffiliateServiceEnhanced.getInstance();

// Nombre de la cookie para rastrear afiliados
const AFFILIATE_COOKIE_NAME = 'flasti_affiliate';
// Duración de la cookie en días
const COOKIE_EXPIRY_DAYS = 7;

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

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/precios',
  '/contacto'
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname, searchParams } = request.nextUrl;

  // Servir archivos estáticos para la ruta /images
  if (pathname.startsWith('/images/') && !pathname.endsWith('/checkout')) {
    try {
      // Determinar la ruta del archivo
      let filePath = '';

      // Extraer la parte relativa de la ruta
      const relativePath = pathname.replace('/images/', '');

      // Construir la ruta relativa al archivo
      filePath = join('src/app/images', relativePath);

      // Verificar si el archivo existe
      try {
        await stat(filePath);
      } catch (e) {
        console.error(`Archivo no encontrado: ${filePath}`);
        return NextResponse.next();
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
        },
      });
    } catch (error) {
      console.error('Error al servir archivo estático:', error);
      return NextResponse.next();
    }
  }

  // Verificar si es una ruta de dashboard que requiere autenticación
  if (pathname.startsWith('/dashboard')) {
    // Verificar si es una ruta pública
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Verificar si hay alguna cookie de Supabase
    let hasAuthCookie = false;
    try {
      // Buscar cookies de autenticación de Supabase (sb-access-token o similar)
      const cookiesList = request.cookies.getAll();
      for (const cookie of cookiesList) {
        if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
          hasAuthCookie = true;
          break;
        }
      }
    } catch (error) {
      console.error('Error al verificar cookies:', error);
    }

    console.log('Middleware: Verificando acceso a ruta protegida:', pathname);

    // Si no es una ruta pública y no hay cookie de autenticación, redirigir al login
    if (!isPublicRoute && !hasAuthCookie) {
      console.log('Middleware: Redirigiendo a login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Para rutas de dashboard, simplemente continuar con la respuesta normal
    return response;
  }

  // Verificar si es una ruta de aplicación con parámetro de referido
  if ((pathname.startsWith('/app/') || pathname.startsWith('/images') || pathname.startsWith('/ai')) && searchParams.has('ref')) {
    const refId = searchParams.get('ref');
    let appId = 0;

    // Determinar el ID de la app según la URL
    if (pathname.startsWith('/images')) {
      appId = 1; // Flasti Images
    } else if (pathname.startsWith('/ai')) {
      appId = 2; // Flasti AI
    } else if (pathname.startsWith('/app/')) {
      const appIdStr = pathname.split('/')[2]; // Obtener el ID de la app de la URL
      if (appIdStr) {
        appId = parseInt(appIdStr);
      }
    }

    if (refId && appId > 0) {
      // Establecer cookie de afiliado
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

      response.cookies.set({
        name: AFFILIATE_COOKIE_NAME,
        value: `${refId}_${appId}`,
        expires: expiryDate,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      // Registrar la visita en la base de datos
      const ipAddress = request.ip || request.headers.get('x-forwarded-for') || '';
      const userAgent = request.headers.get('user-agent') || '';

      // Registrar la visita de forma síncrona para asegurar que se registre
      try {
        console.log(`Middleware: Registrando visita para afiliado=${refId}, app=${appId}`);

        // Primero, incrementar directamente el contador de clics
        const { error: updateError } = await supabase
          .from('affiliate_links')
          .update({ clicks: supabase.sql`clicks + 1` })
          .eq('user_id', refId)
          .eq('app_id', appId);

        if (updateError) {
          console.error('Middleware: Error al actualizar contador de clics:', updateError);
        } else {
          console.log('Middleware: Contador de clics actualizado correctamente');
        }

        // Luego, registrar la visita completa
        const result = await affiliateService.trackVisit(refId, appId, ipAddress, userAgent);
        console.log('Middleware: Resultado de trackVisit:', result);

        // Obtener el nombre de la app para la notificación
        let appName = "";
        if (appId === 1) {
          appName = "Flasti Imágenes";
        } else if (appId === 2) {
          appName = "Flasti AI";
        } else {
          appName = `App #${appId}`;
        }

        // Enviar notificación de clic al afiliado
        await affiliateNotificationService.notifyLinkClick(refId, appId, appName);
      } catch (error) {
        console.error('Middleware: Error al registrar visita:', error);
      }

      // Redirigir a la página sin el parámetro ref para limpiar la URL
      const url = request.nextUrl.clone();
      url.searchParams.delete('ref');
      return NextResponse.redirect(url);
    }
  }

  // Verificar si es una redirección desde Hotmart
  if (pathname === '/register' && searchParams.has('hotmart')) {
    const hotmartToken = searchParams.get('hotmart');

    if (hotmartToken) {
      // Almacenar el token en una cookie para procesarlo en la página de registro
      response.cookies.set({
        name: 'hotmart_token',
        value: hotmartToken,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }
  }

  return response;
}

// Configurar las rutas donde se ejecutará el middleware
export const config = {
  matcher: [
    // Rutas de aplicaciones para rastreo de afiliados
    '/app/:path*',
    '/images/:path*',
    '/ai/:path*',
    '/dev/:path*',

    // Rutas de autenticación
    '/register',

    // Rutas protegidas que requieren autenticación
    '/dashboard/:path*',
  ],
};