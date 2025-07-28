import { NextRequest, NextResponse } from 'next/server';
import { getReversalsFromCpaLead } from '@/lib/cpa-lead-api';
import { supabase } from '@/lib/supabase';

/**
 * Valida que el usuario tenga permisos de administrador
 */
async function validateAdminAccess(request: NextRequest): Promise<boolean> {
  try {
    // Obtener el token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);

    // Verificar el token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return false;
    }

    // Verificar si el usuario es administrador
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return false;
    }

    return profile.role === 'admin' || profile.role === 'super_admin';

  } catch (error) {
    console.error('Admin validation error:', error);
    return false;
  }
}

/**
 * Procesa y almacena las reversiones en Supabase
 */
async function processReversals(reversals: any[]): Promise<void> {
  try {
    for (const reversal of reversals) {
      const { subid, amount, offer_id, transaction_id, reason, date } = reversal;

      if (!subid || !amount || !offer_id) {
        console.warn('CPALead Reversal: Datos incompletos:', reversal);
        continue;
      }

      // Verificar si la reversión ya fue procesada
      const { data: existingReversal } = await supabase
        .from('cpalead_reversals')
        .select('id')
        .eq('transaction_id', transaction_id)
        .single();

      if (existingReversal) {
        console.log('CPALead Reversal: Ya procesada:', transaction_id);
        continue;
      }

      // Obtener el perfil del usuario
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('id, balance')
        .eq('user_id', subid)
        .single();

      if (userError || !userProfile) {
        console.error('CPALead Reversal: Usuario no encontrado:', subid);
        continue;
      }

      const reversalAmount = parseFloat(amount);
      if (isNaN(reversalAmount)) {
        console.error('CPALead Reversal: Monto inválido:', amount);
        continue;
      }

      // Actualizar saldo del usuario (restar la reversión)
      const currentBalance = userProfile.balance || 0;
      const newBalance = Math.max(0, currentBalance - reversalAmount); // No permitir saldo negativo

      const { error: balanceError } = await supabase
        .from('user_profiles')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', subid);

      if (balanceError) {
        console.error('CPALead Reversal: Error al actualizar saldo:', balanceError);
        continue;
      }

      // Registrar la reversión
      const reversalData = {
        user_id: subid,
        transaction_id: transaction_id || `reversal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        offer_id,
        amount: reversalAmount,
        reason: reason || 'No reason provided',
        reversal_date: date || new Date().toISOString(),
        previous_balance: currentBalance,
        new_balance: newBalance,
        source: 'cpalead',
        created_at: new Date().toISOString(),
        metadata: {
          original_reversal: reversal
        }
      };

      const { error: reversalError } = await supabase
        .from('cpalead_reversals')
        .insert([reversalData]);

      if (reversalError) {
        console.error('CPALead Reversal: Error al registrar reversión:', reversalError);
        continue;
      }

      // Registrar en el log de actividad
      const activityData = {
        user_id: subid,
        activity_type: 'cpalead_reversal',
        details: {
          offer_id,
          amount: reversalAmount,
          reason,
          transaction_id: reversalData.transaction_id,
          previous_balance: currentBalance,
          new_balance: newBalance
        },
        created_at: new Date().toISOString()
      };

      await supabase
        .from('affiliate_activity_logs')
        .insert([activityData]);

      console.log('CPALead Reversal: Procesada exitosamente:', {
        user_id: subid,
        amount: reversalAmount,
        new_balance: newBalance,
        transaction_id: reversalData.transaction_id
      });
    }

  } catch (error) {
    console.error('CPALead Reversal: Error al procesar reversiones:', error);
    throw error;
  }
}

/**
 * GET - Obtener reversiones de CPALead
 */
export async function GET(request: NextRequest) {
  try {
    // Validar acceso de administrador
    const isAdmin = await validateAdminAccess(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const processReversalsParam = searchParams.get('process') === 'true';

    if (!startDate || !endDate) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          required: ['start (yyyy-mm-dd)', 'end (yyyy-mm-dd)'],
          optional: ['process (true/false)']
        },
        { status: 400 }
      );
    }

    console.log('CPALead Admin: Obteniendo reversiones:', { startDate, endDate, processReversalsParam });

    // Obtener reversiones de CPALead
    const reversals = await getReversalsFromCpaLead(startDate, endDate);

    // Si se solicita procesar las reversiones
    if (processReversalsParam && reversals.length > 0) {
      await processReversals(reversals);
    }

    return NextResponse.json({
      success: true,
      data: {
        reversals,
        count: reversals.length,
        processed: processReversalsParam,
        date_range: {
          start: startDate,
          end: endDate
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('CPALead Admin: Error en endpoint de reversiones:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Procesar reversiones manualmente
 */
export async function POST(request: NextRequest) {
  try {
    // Validar acceso de administrador
    const isAdmin = await validateAdminAccess(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing startDate or endDate' },
        { status: 400 }
      );
    }

    console.log('CPALead Admin: Procesando reversiones manualmente:', { startDate, endDate });

    // Obtener y procesar reversiones
    const reversals = await getReversalsFromCpaLead(startDate, endDate);
    
    if (reversals.length > 0) {
      await processReversals(reversals);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${reversals.length} reversals successfully`,
      count: reversals.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('CPALead Admin: Error al procesar reversiones:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process reversals',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}