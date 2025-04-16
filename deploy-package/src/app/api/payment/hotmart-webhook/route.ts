import { NextRequest, NextResponse } from 'next/server';
import { AffiliateServiceEnhanced } from '@/lib/affiliate-service-enhanced';
import { supabase } from '@/lib/supabase';

// Instancia del servicio de afiliados
const affiliateService = new AffiliateServiceEnhanced();

/**
 * Webhook para recibir notificaciones de Hotmart
 * 
 * Este endpoint recibe notificaciones cuando se completa una venta en Hotmart
 * y registra la venta en el sistema de afiliados.
 * 
 * Documentación de Hotmart: https://developers.hotmart.com/docs/en/webhooks/
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar la autenticidad de la solicitud
    const hotmartSignature = req.headers.get('X-Hotmart-Signature');
    if (!verifyHotmartSignature(req, hotmartSignature)) {
      console.error('Firma de Hotmart inválida');
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }
    
    // Obtener los datos de la notificación
    const data = await req.json();
    
    // Verificar que sea una notificación de venta aprobada
    if (data.event !== 'PURCHASE_APPROVED' && data.event !== 'PURCHASE_COMPLETE') {
      return NextResponse.json({ message: 'Evento ignorado' }, { status: 200 });
    }
    
    // Extraer información relevante
    const {
      purchase: {
        transaction: transactionCode,
        offer: { code: productCode },
        buyer: { email: buyerEmail },
        price: { value: amount }
      }
    } = data;
    
    // Obtener el ID de la app basado en el código de producto de Hotmart
    const appId = getAppIdFromProductCode(productCode);
    if (!appId) {
      console.error('Producto no reconocido:', productCode);
      return NextResponse.json({ error: 'Producto no reconocido' }, { status: 400 });
    }
    
    // Buscar el afiliado asociado a esta venta
    const affiliateId = await findAffiliateForSale(data);
    
    // Si se encontró un afiliado, registrar la venta
    if (affiliateId) {
      const result = await affiliateService.registerSale(
        transactionCode,
        appId,
        amount,
        affiliateId,
        buyerEmail,
        req.ip || '0.0.0.0'
      );
      
      if (result.success) {
        console.log(`Venta registrada para afiliado ${affiliateId}, comisión: ${result.commission}`);
      } else {
        console.error('Error al registrar venta:', result.error);
      }
    } else {
      console.log('Venta sin afiliado asociado');
      
      // Registrar la venta sin afiliado para estadísticas
      await supabase.from('sales').insert({
        transaction_id: transactionCode,
        app_id: appId,
        amount: amount,
        buyer_email: buyerEmail,
        ip_address: req.ip || '0.0.0.0',
        status: 'completed'
      });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar webhook de Hotmart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * Verifica la firma de Hotmart para autenticar la solicitud
 */
function verifyHotmartSignature(req: NextRequest, signature: string | null): boolean {
  // En producción, implementar la verificación real de la firma
  // https://developers.hotmart.com/docs/en/webhooks/security/
  
  // Para desarrollo, aceptamos todas las solicitudes
  return process.env.NODE_ENV !== 'production' || !!signature;
}

/**
 * Obtiene el ID de la app basado en el código de producto de Hotmart
 */
function getAppIdFromProductCode(productCode: string): number | null {
  // Mapeo de códigos de producto de Hotmart a IDs de app
  const productMap: Record<string, number> = {
    'FLASTI_IMAGES': 1, // Flasti Images
    'FLASTI_AI': 2,     // Flasti AI
    // Agregar más productos según sea necesario
  };
  
  return productMap[productCode] || null;
}

/**
 * Busca el afiliado asociado a una venta
 */
async function findAffiliateForSale(data: any): Promise<string | null> {
  try {
    // 1. Verificar si Hotmart proporciona información de afiliado
    if (data.purchase.affiliate && data.purchase.affiliate.code) {
      return data.purchase.affiliate.code;
    }
    
    // 2. Buscar en la base de datos por la dirección IP o email del comprador
    const buyerEmail = data.purchase.buyer.email;
    const buyerIp = data.purchase.buyer.ip || '0.0.0.0';
    
    // Buscar visitas recientes (7 días) con la misma IP
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: visits } = await supabase
      .from('affiliate_visits')
      .select('affiliate_id')
      .eq('ip_address', buyerIp)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (visits && visits.length > 0) {
      return visits[0].affiliate_id;
    }
    
    // 3. Si no se encuentra, la venta no tiene afiliado
    return null;
  } catch (error) {
    console.error('Error al buscar afiliado para venta:', error);
    return null;
  }
}
