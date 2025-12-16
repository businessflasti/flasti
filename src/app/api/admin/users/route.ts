import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API /admin/users] Iniciando petición...');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('❌ [API /admin/users] No hay header de autorización');
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('✅ [API /admin/users] Token recibido');
    
    // Verificar que las variables de entorno estén configuradas
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [API /admin/users] Variables de entorno no configuradas');
      return NextResponse.json({ 
        success: false, 
        message: 'Error de configuración del servidor' 
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ [API /admin/users] Cliente Supabase creado');

    // Verificar el token y que sea admin
    console.log('🔍 [API /admin/users] Verificando token con getUser...');
    console.log('🔍 [API /admin/users] Token (primeros 50 chars):', token.substring(0, 50));
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    console.log('🔍 [API /admin/users] getUser result:', { 
      hasUser: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      errorCode: authError?.code,
      errorMessage: authError?.message,
      errorStatus: authError?.status
    });
    
    if (authError || !user) {
      console.error('❌ [API /admin/users] Error verificando token:', authError);
      console.error('❌ [API /admin/users] Detalles completos del error:', JSON.stringify(authError, null, 2));
      return NextResponse.json({ 
        success: false, 
        message: 'Token inválido',
        debug: {
          errorCode: authError?.code,
          errorMessage: authError?.message,
          hasToken: !!token,
          tokenLength: token.length
        }
      }, { status: 401 });
    }
    console.log('✅ [API /admin/users] Usuario autenticado:', user.id, user.email);

    // Verificar que sea admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('❌ [API /admin/users] Error obteniendo perfil:', profileError);
    }

    if (!profile?.is_admin) {
      console.log('❌ [API /admin/users] Usuario no es admin');
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
    }
    console.log('✅ [API /admin/users] Usuario es admin');

    // Obtener TODOS los usuarios de auth con paginación
    console.log('🔄 [API /admin/users] Obteniendo lista completa de usuarios...');
    let allUsers: any[] = [];
    let page = 1;
    let hasMore = true;
    const perPage = 1000; // Máximo por página

    while (hasMore) {
      const { data: authData, error: usersError } = await supabase.auth.admin.listUsers({
        page: page,
        perPage: perPage
      });
      
      if (usersError) {
        console.error('❌ [API /admin/users] Error obteniendo usuarios:', usersError);
        return NextResponse.json({ 
          success: false, 
          message: 'Error obteniendo usuarios: ' + usersError.message 
        }, { status: 500 });
      }

      allUsers = allUsers.concat(authData.users);
      
      // Si recibimos menos usuarios que el límite, ya no hay más páginas
      if (authData.users.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }
    
    console.log(`✅ [API /admin/users] ${allUsers.length} usuarios obtenidos en total`)

    // Obtener información de premium, país, dispositivo, nombre, apellido y teléfono de user_profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, is_premium, premium_activated_at, country, device_type, balance, first_name, last_name, phone');
    
    console.log(`✅ [API /admin/users] ${profiles?.length || 0} perfiles obtenidos`);
    if (profiles && profiles.length > 0) {
      const withNames = profiles.filter(p => p.first_name || p.last_name).length;
      console.log(`📝 [API /admin/users] ${withNames} perfiles con nombre/apellido`);
    }

    if (profilesError) {
      console.error('Error obteniendo perfiles:', profilesError);
    }

    // Combinar datos
    const premiumMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

    const users = allUsers.map(u => {
      const profile = premiumMap.get(u.id);
      
      // Log para debug si hay nombre
      if (profile?.first_name || profile?.last_name) {
        console.log(`👤 Usuario con nombre: ${profile.first_name} ${profile.last_name} (${u.email})`);
      }
      
      // Detectar sistema operativo del user agent
      const userAgent = u.user_metadata?.user_agent || '';
      let os = 'Desconocido';
      
      if (userAgent) {
        if (/android/i.test(userAgent)) os = 'Android';
        else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
        else if (/windows/i.test(userAgent)) os = 'Windows';
        else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
        else if (/linux/i.test(userAgent)) os = 'Linux';
      }
      
      return {
        user_id: u.id,
        email: u.email || 'Sin email',
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        phone: profile?.phone || null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
        is_premium: profile?.is_premium || false,
        premium_activated_at: profile?.premium_activated_at,
        country: profile?.country || null,
        device_type: profile?.device_type || null,
        os: os,
        balance: profile?.balance || 0
      };
    });

    // Ordenar por fecha de registro (más recientes primero)
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      users: users,
      total: users.length
    });

  } catch (error) {
    console.error('Error en /api/admin/users:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  }
}
