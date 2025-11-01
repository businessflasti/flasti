import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Crear cliente con service role para verificación de admin
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar el token y que sea admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que sea admin
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId requerido' }, { status: 400 });
    }

    console.log('🗑️ Iniciando eliminación de usuario:', userId);

    // Intentar usar la función RPC primero
    try {
      const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('delete_user_completely', {
        target_user_id: userId
      });

      if (rpcError) {
        console.log('⚠️ Función RPC no disponible, usando método manual:', rpcError.message);
        throw rpcError;
      }

      if (rpcResult && rpcResult.success) {
        console.log('✅ Usuario eliminado usando función RPC');
        return NextResponse.json({
          success: true,
          message: 'Usuario eliminado definitivamente'
        });
      }
    } catch (rpcError) {
      console.log('⚠️ Usando método manual de eliminación');
    }

    // MÉTODO MANUAL: Eliminar todos los datos relacionados
    const tablesToClean = [
      'notifications',
      'rewards_history', 
      'withdrawal_requests',
      'games_balance',
      'games_activity',
      'games_withdrawals',
      'affiliate_clicks',
      'affiliate_conversions',
      'cpalead_transactions',
      'cpalead_reversals',
      'user_onboarding',
      'affiliate_activity_logs',
      'checkout_leads',
      'user_roles',
      'chat_conversations',
      'chat_messages',
      'affiliate_links',
      'commissions',
      'withdrawals',
      'sales',
      'user_profiles',
      'profiles'
    ];

    for (const table of tablesToClean) {
      try {
        const column = table === 'profiles' ? 'id' : 'user_id';
        const { error } = await supabaseAdmin.from(table).delete().eq(column, userId);
        if (error) {
          console.log(`⚠️ Error eliminando de ${table}:`, error.message);
        } else {
          console.log(`✅ ${table} limpiado`);
        }
      } catch (e: any) {
        console.log(`⚠️ Tabla ${table} no existe o error:`, e.message);
      }
    }

    // Eliminar el usuario de auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('❌ Error eliminando usuario de auth:', deleteError);
      
      // Intentar obtener más detalles del error
      console.error('Detalles del error:', JSON.stringify(deleteError, null, 2));
      
      return NextResponse.json({ 
        success: false, 
        error: 'No se pudo eliminar el usuario. Puede tener datos relacionados en otras tablas.' 
      }, { status: 500 });
    }

    console.log('✅ Usuario eliminado completamente');

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado definitivamente'
    });

  } catch (error) {
    console.error('Error en /api/admin/delete-user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
