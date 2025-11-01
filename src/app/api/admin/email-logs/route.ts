import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar que el usuario sea admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
    }

    // Obtener todos los logs de correos
    const { data: logs, error: logsError } = await supabase
      .from('user_email_logs')
      .select('*')
      .order('sent_at', { ascending: false });

    if (logsError) {
      return NextResponse.json({ error: 'Error obteniendo logs' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      logs: logs || []
    });

  } catch (error) {
    console.error('Error obteniendo logs:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
