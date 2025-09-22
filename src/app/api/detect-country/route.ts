import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Obtener IP desde headers (x-forwarded-for preferido)
    const forwarded = request.headers.get('x-forwarded-for') || '';
    const ip = (forwarded.split(',')[0] || '').trim() || request.headers.get('x-real-ip') || '';
    
    console.log('🌍 Detectando país para IP:', ip || 'auto-detect');
    console.log('🌍 Headers disponibles:', {
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-real-ip': request.headers.get('x-real-ip'),
      'cf-ipcountry': request.headers.get('cf-ipcountry'),
      'x-vercel-ip-country': request.headers.get('x-vercel-ip-country')
    });

    // Verificar headers de país primero (más rápido y confiable)
    const countryFromHeaders = request.headers.get('cf-ipcountry') || 
                              request.headers.get('x-vercel-ip-country') ||
                              request.headers.get('x-country-code');
    
    if (countryFromHeaders && countryFromHeaders.length === 2 && countryFromHeaders !== 'XX') {
      console.log('🌍 País detectado desde headers:', countryFromHeaders);
      return NextResponse.json({ country: countryFromHeaders, source: 'headers' }, { status: 200 });
    }

    // Servicios de geolocalización con más opciones
    const services = [
      // Servicios principales
      ip ? `https://ipapi.co/${ip}/country_code/` : 'https://ipapi.co/country_code/',
      ip ? `https://ipinfo.io/${ip}/country` : 'https://ipinfo.io/country',
      
      // Servicios adicionales
      'https://api.country.is/',
      ip ? `https://ip-api.com/json/${ip}?fields=countryCode` : 'https://ip-api.com/json/?fields=countryCode',
      'https://ipwhois.app/json/?objects=country_code',
      
      // Servicios de respaldo
      ip ? `https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ip}&fields=country_code2` : 'https://api.ipgeolocation.io/ipgeo?apiKey=free&fields=country_code2'
    ];

    for (const url of services) {
      try {
        console.log('🌍 Probando servicio:', url);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Aumentar timeout
        
        const res = await fetch(url, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*'
          }
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          console.log('🌍 Servicio respondió con error:', res.status, res.statusText);
          continue;
        }

        let countryCode = '';
        
        // Manejar diferentes formatos de respuesta
        if (url.includes('country.is')) {
          const json = await res.json();
          countryCode = json.country;
        } else if (url.includes('ip-api.com')) {
          const json = await res.json();
          countryCode = json.countryCode;
        } else if (url.includes('ipgeolocation.io')) {
          const json = await res.json();
          countryCode = json.country_code2;
        } else if (url.includes('ipwhois.app')) {
          const json = await res.json();
          countryCode = json.country_code;
        } else {
          // Para ipapi.co e ipinfo.io (texto plano)
          const text = await res.text();
          countryCode = text.trim().replace(/"/g, '').replace(/\n/g, '');
        }
        
        console.log('🌍 Respuesta del servicio:', url, '→', countryCode);
        
        if (countryCode && countryCode.length === 2 && countryCode !== 'XX') {
          console.log('🌍 País detectado exitosamente:', countryCode);
          return NextResponse.json({ 
            country: countryCode, 
            source: url.includes('ipapi.co') ? 'ipapi' : 
                   url.includes('ipinfo.io') ? 'ipinfo' :
                   url.includes('country.is') ? 'country.is' :
                   url.includes('ip-api.com') ? 'ip-api' :
                   url.includes('ipgeolocation.io') ? 'ipgeolocation' :
                   url.includes('ipwhois.app') ? 'ipwhois' : 'unknown'
          }, { status: 200 });
        }
      } catch (err) {
        console.log('🌍 Error con servicio:', url, err instanceof Error ? err.message : String(err));
        continue;
      }
    }

    // Si no se detecta, usar US como fallback
    console.log('🌍 No se pudo detectar país desde ningún servicio, usando US como fallback');
    return NextResponse.json({ country: 'US', fallback: true, source: 'fallback' }, { status: 200 });

  } catch (error) {
    console.error('🌍 API detect-country error:', error);
    return NextResponse.json({ country: 'US', error: 'server-error', source: 'error-fallback' }, { status: 200 });
  }
}
