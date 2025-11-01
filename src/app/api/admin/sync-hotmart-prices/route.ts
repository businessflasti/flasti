import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Mapeo de países a sus códigos de Hotmart
const COUNTRY_MAPPING: { [key: string]: string } = {
  'AR': 'Argentina',
  'CO': 'Colombia',
  'PE': 'Perú',
  'MX': 'México',
  'PA': 'Panamá',
  'GT': 'Guatemala',
  'DO': 'República Dominicana',
  'PY': 'Paraguay',
  'ES': 'España',
  'CR': 'Costa Rica',
  'CL': 'Chile',
  'UY': 'Uruguay',
  'BO': 'Bolivia',
  'HN': 'Honduras'
};

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    const secretKey = request.headers.get('x-cron-secret');
    
    // Permitir acceso con cron secret o token de admin
    if (secretKey !== process.env.CRON_SECRET_KEY && !authHeader) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    // Si viene con token, verificar que sea admin
    if (authHeader && !secretKey) {
      const token = authHeader.replace('Bearer ', '');
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (!profile?.is_admin) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
      }
    }

    console.log('🚀 Iniciando sincronización de precios de Hotmart...');

    // Usar Puppeteer para extraer precios
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const prices: { [key: string]: number } = {};
    let updated = 0;
    let failed = 0;

    try {
      for (const [countryCode, countryName] of Object.entries(COUNTRY_MAPPING)) {
        try {
          console.log(`🔄 Procesando ${countryName} (${countryCode})...`);

          // Navegar a Hotmart con parámetros de país
          await page.goto(`https://pay.hotmart.com/5h87lps7?country=${countryCode}`, {
            waitUntil: 'networkidle2',
            timeout: 30000
          });

          // Esperar a que cargue el precio
          await page.waitForTimeout(3000);

          // Intentar extraer el precio de diferentes selectores posibles
          const priceSelectors = [
            '.checkout-price',
            '[data-price]',
            '.price-value',
            '.amount',
            '.total-price',
            'span[class*="price"]',
            'div[class*="price"]'
          ];

          let priceText = null;
          for (const selector of priceSelectors) {
            try {
              priceText = await page.$eval(selector, (el: any) => el.textContent);
              if (priceText) break;
            } catch (e) {
              // Selector no encontrado, probar el siguiente
            }
          }

          if (priceText) {
            // Limpiar el texto y extraer solo números
            const cleanPrice = priceText
              .replace(/[^\d.,]/g, '')
              .replace(/\./g, '')
              .replace(',', '.');
            
            const price = parseFloat(cleanPrice);

            if (!isNaN(price) && price > 0) {
              prices[countryCode] = price;
              console.log(`✅ ${countryCode}: ${price}`);
              updated++;
            } else {
              console.log(`⚠️ ${countryCode}: Precio inválido (${priceText})`);
              failed++;
            }
          } else {
            console.log(`⚠️ ${countryCode}: No se encontró el precio`);
            failed++;
          }

        } catch (error: any) {
          console.error(`❌ Error procesando ${countryCode}:`, error.message);
          failed++;
        }

        // Esperar entre requests
        await page.waitForTimeout(2000);
      }

    } finally {
      await browser.close();
    }

    // Actualizar precios en Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    for (const [countryCode, price] of Object.entries(prices)) {
      const { error } = await supabase
        .from('country_prices')
        .update({ price })
        .eq('country_code', countryCode);

      if (error) {
        console.error(`❌ Error actualizando ${countryCode} en BD:`, error);
      }
    }

    console.log('=' .repeat(50));
    console.log(`✅ Actualizados: ${updated}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`📊 Total: ${Object.keys(COUNTRY_MAPPING).length}`);
    console.log('=' .repeat(50));

    return NextResponse.json({
      success: true,
      updated,
      failed,
      total: Object.keys(COUNTRY_MAPPING).length,
      prices
    });

  } catch (error: any) {
    console.error('Error en sincronización:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
