import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

/**
 * Endpoint para obtener las apps disponibles para promoción
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API: Iniciando solicitud de apps de afiliados');

    // Crear cliente de Supabase con cookies para autenticación
    const supabaseServerClient = createServerClient();
    console.log('API: Cliente de Supabase creado');

    // Verificar si el usuario está autenticado
    const { data: { session } } = await supabaseServerClient.auth.getSession();
    console.log('API: Sesión verificada:', session ? 'Autenticado' : 'No autenticado');

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener el nivel del usuario
    let userLevel = 1; // Nivel por defecto
    console.log('API: Obteniendo nivel del usuario:', session.user.id);

    // Intentar obtener el nivel de user_profiles
    const { data: userData, error: userError } = await supabaseServerClient
      .from('user_profiles')
      .select('level')
      .eq('user_id', session.user.id)
      .single();

    console.log('API: Resultado de user_profiles:', userData, userError);

    if (userError) {
      // Si no se encuentra en user_profiles, buscar en profiles
      const { data: profileData, error: profileError } = await supabaseServerClient
        .from('profiles')
        .select('level')
        .eq('id', session.user.id)
        .single();

      console.log('API: Resultado de profiles:', profileData, profileError);

      if (!profileError && profileData) {
        userLevel = profileData.level;
      }
    } else if (userData) {
      userLevel = userData.level;
    }

    console.log('API: Nivel del usuario determinado:', userLevel);

    // Obtener las apps disponibles - Usar cliente directo para evitar problemas de RLS
    console.log('API: Obteniendo apps disponibles');

    const { data: apps, error: appsError } = await supabaseServerClient
      .from('affiliate_apps')
      .select('*')
      .order('name');

    console.log('API: Resultado de apps:', apps ? `${apps.length} apps encontradas` : 'No hay apps', appsError);

    if (appsError) {
      console.error('API: Error al obtener apps:', appsError);
      return NextResponse.json(
        { error: 'Error al obtener apps', details: appsError },
        { status: 500 }
      );
    }

    // Si no hay apps, intentar obtener todas sin filtro de is_active
    if (!apps || apps.length === 0) {
      console.log('API: No se encontraron apps activas, intentando sin filtro');

      const { data: allApps, error: allAppsError } = await supabaseServerClient
        .from('affiliate_apps')
        .select('*')
        .order('name');

      console.log('API: Resultado de todas las apps:', allApps ? `${allApps.length} apps encontradas` : 'No hay apps', allAppsError);

      if (allAppsError) {
        console.error('API: Error al obtener todas las apps:', allAppsError);
      }
    }

    // Obtener las comisiones para cada app según el nivel del usuario
    console.log('API: Calculando comisiones para las apps');

    const appsWithCommissions = apps && apps.length > 0 ? await Promise.all(apps.map(async (app) => {
      console.log('API: Procesando app:', app.id, app.name);

      const { data: commissionData, error: commissionError } = await supabaseServerClient
        .from('affiliate_commission_rates')
        .select('commission_rate')
        .eq('app_id', app.id)
        .eq('user_level', userLevel)
        .single();

      console.log('API: Comisión para nivel', userLevel, ':', commissionData, commissionError);

      let commissionRate = 0.30; // Tasa por defecto

      if (!commissionError && commissionData) {
        commissionRate = commissionData.commission_rate;
      } else {
        // Si no hay una tasa específica para el nivel, usar la del nivel 1
        const { data: defaultCommissionData, error: defaultCommissionError } = await supabaseServerClient
          .from('affiliate_commission_rates')
          .select('commission_rate')
          .eq('app_id', app.id)
          .eq('user_level', 1)
          .single();

        console.log('API: Comisión por defecto (nivel 1):', defaultCommissionData, defaultCommissionError);

        if (defaultCommissionData) {
          commissionRate = defaultCommissionData.commission_rate;
        }
      }

      // Calcular la comisión en dinero
      const commissionAmount = app.base_price * commissionRate;

      return {
        ...app,
        commission_rate: commissionRate,
        commission_percentage: `${(commissionRate * 100).toFixed(0)}%`,
        commission_amount: commissionAmount,
        affiliate_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://flasti.co'}?ref=${session.user.id}`
      };
    })) : [];

    console.log('API: Respuesta final:', {
      appsCount: appsWithCommissions.length,
      userLevel
    });

    return NextResponse.json({
      apps: appsWithCommissions,
      user_level: userLevel
    });
  } catch (error) {
    console.error('API: Error al obtener apps para afiliados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}
