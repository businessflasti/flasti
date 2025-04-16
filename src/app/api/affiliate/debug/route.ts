import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

/**
 * Endpoint de diagnóstico para depurar problemas con las apps de afiliados
 */
export async function GET(request: NextRequest) {
  try {
    // Crear cliente de Supabase con cookies para autenticación
    const supabaseServerClient = createServerClient();
    
    // Verificar si el usuario está autenticado
    const { data: { session } } = await supabaseServerClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado', authenticated: false },
        { status: 401 }
      );
    }
    
    // Verificar si la tabla affiliate_apps existe
    const { data: tableExists, error: tableError } = await supabaseServerClient.rpc(
      'check_table_exists',
      { table_name: 'affiliate_apps' }
    );
    
    // Si hay error en la función RPC, verificar manualmente
    let tablesInfo = null;
    if (tableError) {
      const { data: tables, error: infoError } = await supabaseServerClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'affiliate_apps');
      
      tablesInfo = { tables, error: infoError };
    }
    
    // Contar cuántas apps hay en la tabla
    const { data: appsCount, error: countError } = await supabaseServerClient
      .from('affiliate_apps')
      .select('id', { count: 'exact', head: true });
    
    // Obtener las apps disponibles
    const { data: apps, error: appsError } = await supabaseServerClient
      .from('affiliate_apps')
      .select('*')
      .eq('is_active', true);
    
    // Obtener el nivel del usuario
    let userLevel = 1; // Nivel por defecto
    let userLevelInfo = { source: 'default' };
    
    // Intentar obtener el nivel de user_profiles
    const { data: userData, error: userError } = await supabaseServerClient
      .from('user_profiles')
      .select('level')
      .eq('user_id', session.user.id)
      .single();
    
    if (!userError && userData) {
      userLevel = userData.level;
      userLevelInfo = { source: 'user_profiles', level: userLevel };
    } else {
      // Si no se encuentra en user_profiles, buscar en profiles
      const { data: profileData, error: profileError } = await supabaseServerClient
        .from('profiles')
        .select('level')
        .eq('id', session.user.id)
        .single();
      
      if (!profileError && profileData) {
        userLevel = profileData.level;
        userLevelInfo = { source: 'profiles', level: userLevel };
      } else {
        userLevelInfo = { 
          source: 'default', 
          userProfilesError: userError,
          profilesError: profileError
        };
      }
    }
    
    // Verificar si hay comisiones configuradas
    const { data: commissions, error: commissionsError } = await supabaseServerClient
      .from('affiliate_commission_rates')
      .select('*')
      .limit(5);
    
    return NextResponse.json({
      authenticated: true,
      userId: session.user.id,
      tableExists: tableExists || tablesInfo,
      appsCount: appsCount?.length || 0,
      countError,
      apps,
      appsError,
      userLevelInfo,
      commissions: commissions?.length || 0,
      commissionsError
    });
  } catch (error) {
    console.error('Error en diagnóstico de afiliados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}
