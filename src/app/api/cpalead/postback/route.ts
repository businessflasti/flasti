import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Configuración de seguridad para CPALead
const CPALEAD_CONFIG = {
  API_KEY: '22ac92e230e74a1ea5152eaa3258fecd',
  // IPs permitidas de CPALead (según documentación oficial)
  ALLOWED_IPS: [
    '127.0.0.1', // Para testing local
    '34.69.179.33', // IP oficial de CPALead según documentación
  ],
  SECRET_KEY: process.env.CPALEAD_SECRET_KEY || 'flasti_cpalead_secret_2024'
};

// Tipos para el postback de CPALead
interface CPALeadPostback {
  subid: string;        // ID del usuario de Supabase
  amount: string;       // Monto de la conversión
  offer_id: string;     // ID de la oferta
  currency: string;     // Moneda del pago
  transaction_id?: string; // ID de transacción único
  ip?: string;          // IP del usuario que completó la oferta
  status?: string;      // Estado de la conversión
  timestamp?: string;   // Timestamp de la conversión
}

/**
 * Valida que la solicitud provenga de CPALead
 */
function validateRequest(request: NextRequest): boolean {
  try {
    // Obtener IP del cliente
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';

    console.log('CPALead Postback: IP del cliente:', clientIP);

    // En desarrollo, permitir localhost
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // Validar IP (ahora habilitado con la IP oficial de CPALead)
    if (!CPALEAD_CONFIG.ALLOWED_IPS.includes(clientIP)) {
      console.error('CPALead Postback: IP no autorizada:', clientIP);
      return false;
    }

    return true;
  } catch (error) {
    console.error('CPALead Postback: Error en validación:', error);
    return false;
  }
}

/**
 * Procesa la acreditación del saldo en Supabase
 */
async function processConversion(postbackData: CPALeadPostback): Promise<boolean> {
  try {
    const { subid, amount, offer_id, currency, transaction_id, ip, status } = postbackData;

    // Validar datos requeridos
    if (!subid || !amount || !offer_id) {
      console.error('CPALead Postback: Datos requeridos faltantes:', { subid, amount, offer_id });
      return false;
    }

    // Convertir amount a número
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      console.error('CPALead Postback: Monto inválido:', amount);
      return false;
    }

    console.log('CPALead Postback: Procesando conversión para usuario:', subid, 'Monto:', amountNumber);

    // Verificar que el usuario existe
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id, balance')
      .eq('user_id', subid)
      .single();

    if (userError || !userProfile) {
      console.error('CPALead Postback: Usuario no encontrado:', subid, userError);
      return false;
    }

    // Verificar si la transacción ya fue procesada (evitar duplicados)
    if (transaction_id) {
      const { data: existingTransaction } = await supabase
        .from('cpalead_transactions')
        .select('id')
        .eq('transaction_id', transaction_id)
        .single();

      if (existingTransaction) {
        console.log('CPALead Postback: Transacción ya procesada:', transaction_id);
        return true; // Ya fue procesada, pero es exitosa
      }
    }

    // Iniciar transacción para actualizar saldo
    const currentBalance = userProfile.balance || 0;
    const newBalance = currentBalance + amountNumber;

    // Actualizar saldo del usuario
    const { error: balanceError } = await supabase
      .from('user_profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', subid);

    if (balanceError) {
      console.error('CPALead Postback: Error al actualizar saldo:', balanceError);
      return false;
    }

    // Registrar la transacción en el historial
    const transactionData = {
      user_id: subid,
      transaction_id: transaction_id || `cpalead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      offer_id,
      amount: amountNumber,
      currency: currency || 'USD',
      status: status || 'completed',
      ip_address: ip,
      source: 'cpalead',
      created_at: new Date().toISOString(),
      metadata: {
        original_postback: postbackData
      }
    };

    const { error: transactionError } = await supabase
      .from('cpalead_transactions')
      .insert([transactionData]);

    if (transactionError) {
      console.error('CPALead Postback: Error al registrar transacción:', transactionError);
      // No retornar false aquí porque el saldo ya se actualizó
    }

    // Registrar en el log de actividad del usuario
    const activityData = {
      user_id: subid,
      activity_type: 'cpalead_conversion',
      details: {
        offer_id,
        amount: amountNumber,
        currency,
        transaction_id: transactionData.transaction_id,
        previous_balance: currentBalance,
        new_balance: newBalance
      },
      created_at: new Date().toISOString()
    };

    await supabase
      .from('affiliate_activity_logs')
      .insert([activityData]);

    // Crear notificación para el usuario sobre la conversión completada
    try {
      await supabase.from('notifications').insert({
        user_id: subid,
        type: 'success',
        title: '¡Oferta completada!',
        message: `Has ganado $${amountNumber.toFixed(2)} USD por completar una oferta. Tu nuevo saldo es $${newBalance.toFixed(2)} USD.`,
        read: false,
        created_at: new Date().toISOString()
      });
      console.log('CPALead Postback: Notificación creada para usuario:', subid);
    } catch (notificationError) {
      console.error('CPALead Postback: Error al crear notificación:', notificationError);
      // No fallar la conversión por un error de notificación
    }

    console.log('CPALead Postback: Conversión procesada exitosamente:', {
      user_id: subid,
      amount: amountNumber,
      new_balance: newBalance,
      transaction_id: transactionData.transaction_id
    });

    return true;

  } catch (error) {
    console.error('CPALead Postback: Error al procesar conversión:', error);
    return false;
  }
}

/**
 * Endpoint POST para recibir postbacks de CPALead
 */
export async function POST(request: NextRequest) {
  try {
    console.log('CPALead Postback: Recibida solicitud POST');

    // Validar que la solicitud provenga de CPALead
    if (!validateRequest(request)) {
      console.error('CPALead Postback: Solicitud no autorizada');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obtener datos del postback
    let postbackData: CPALeadPostback;
    
    try {
      postbackData = await request.json();
    } catch (parseError) {
      console.error('CPALead Postback: Error al parsear JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    console.log('CPALead Postback: Datos recibidos:', postbackData);

    // Procesar la conversión
    const success = await processConversion(postbackData);

    if (success) {
      console.log('CPALead Postback: Procesado exitosamente');
      return NextResponse.json(
        { 
          status: 'success',
          message: 'Conversion processed successfully',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    } else {
      console.error('CPALead Postback: Error al procesar conversión');
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Failed to process conversion'
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('CPALead Postback: Error inesperado:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para recibir postbacks de CPALead (método principal)
 */
export async function GET(request: NextRequest) {
  try {
    console.log('CPALead Postback: Recibida solicitud GET');

    // Validar que la solicitud provenga de CPALead
    if (!validateRequest(request)) {
      console.error('CPALead Postback: Solicitud no autorizada');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obtener parámetros de la URL (CPALead usa GET con query parameters)
    const { searchParams } = new URL(request.url);
    
    const postbackData = {
      subid: searchParams.get('subid') || '',
      amount: searchParams.get('payout') || searchParams.get('virtual_currency') || '0',
      offer_id: searchParams.get('campaign_id') || searchParams.get('lead_id') || '',
      currency: 'USD', // CPALead generalmente paga en USD
      transaction_id: searchParams.get('lead_id') || `cpalead_${Date.now()}`,
      ip: searchParams.get('ip_address') || '',
      status: 'completed',
      campaign_name: searchParams.get('campaign_name') || '',
      country_iso: searchParams.get('country_iso') || '',
      password: searchParams.get('password') || ''
    };

    console.log('CPALead Postback: Parámetros recibidos:', postbackData);

    // Validar password si está configurado
    const expectedPassword = process.env.CPALEAD_POSTBACK_PASSWORD;
    if (expectedPassword && postbackData.password !== expectedPassword) {
      console.error('CPALead Postback: Password inválido');
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Procesar la conversión
    const success = await processConversion(postbackData);

    if (success) {
      console.log('CPALead Postback: Procesado exitosamente');
      // CPALead espera una respuesta simple
      return new NextResponse('OK', { status: 200 });
    } else {
      console.error('CPALead Postback: Error al procesar conversión');
      return new NextResponse('ERROR', { status: 400 });
    }

  } catch (error) {
    console.error('CPALead Postback: Error inesperado:', error);
    return new NextResponse('ERROR', { status: 500 });
  }
}