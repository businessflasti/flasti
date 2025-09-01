import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Obtener IP desde headers (x-forwarded-for preferido)
    const forwarded = request.headers.get('x-forwarded-for') || '';
    const ip = (forwarded.split(',')[0] || '').trim() || request.headers.get('x-real-ip') || '';

    // Servicios: ipapi primero, ipinfo como fallback
    const services = [
      ip ? `https://ipapi.co/${ip}/country/` : 'https://ipapi.co/country/',
      ip ? `https://ipinfo.io/${ip}/country` : 'https://ipinfo.io/country'
    ];

    for (const url of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;

        const text = (await res.text()).trim().replace(/"/g, '');
        if (text && text.length === 2) {
          return NextResponse.json({ country: text }, { status: 200 });
        }
      } catch (err) {
        // continuar al siguiente servicio
        continue;
      }
    }

    // Si no se detecta, devolver 204 para indicar "no content / no detection"
    return NextResponse.json({ country: null, error: 'not-detected' }, { status: 204 });

  } catch (error) {
    console.error('API detect-country error:', error);
    return NextResponse.json({ country: null, error: 'server-error' }, { status: 500 });
  }
}
