import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  sendWelcomeEmail, 
  sendCommissionEmail, 
  sendWithdrawalEmail, 
  sendLevelUpgradeEmail 
} from '@/utils/email-templates';

// Inicializar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Verifica si la solicitud está autorizada
 * @param request Solicitud entrante
 * @returns Cliente de Supabase autenticado o null si no está autorizado
 */
async function getAuthorizedClient(request: NextRequest) {
  // Obtener el token de autorización
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  // Verificar el token
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  // Verificar si el usuario es administrador
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (userError || !userData || userData.role !== 'admin') {
    return null;
  }

  return supabase;
}

/**
 * Manejador de solicitudes POST
 * @param request Solicitud entrante
 * @returns Respuesta
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autorización
    const client = await getAuthorizedClient(request);
    if (!client) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener datos de la solicitud
    const body = await request.json();
    const { type, to, data } = body;

    if (!type || !to || !data) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    let result;

    // Enviar el correo según el tipo
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(to, data.name);
        break;
      case 'commission':
        result = await sendCommissionEmail(to, {
          name: data.name,
          amount: data.amount,
          balance: data.balance,
          transactionId: data.transactionId,
          date: data.date,
          productName: data.productName,
          saleAmount: data.saleAmount,
          commissionRate: data.commissionRate
        });
        break;
      case 'withdrawal':
        result = await sendWithdrawalEmail(to, {
          name: data.name,
          amount: data.amount,
          balance: data.balance,
          transactionId: data.transactionId,
          requestDate: data.requestDate,
          processDate: data.processDate,
          paymentMethod: data.paymentMethod
        });
        break;
      case 'level-upgrade':
        result = await sendLevelUpgradeEmail(to, {
          name: data.name,
          level: data.level,
          commissionRate: data.commissionRate
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de correo no válido' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: 'Error al enviar el correo', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en la API de correo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
