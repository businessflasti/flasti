import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar autenticación
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { userId, completedAt } = await request.json();
    
    // Verificar que el userId coincida con el usuario autenticado
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado para este usuario' },
        { status: 403 }
      );
    }

    console.log('Completando onboarding para usuario:', userId);

    // Insertar o actualizar el registro de onboarding
    const { data, error } = await supabase
      .from('user_onboarding')
      .upsert({
        user_id: userId,
        completed_at: completedAt,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error al completar onboarding:', error);
      return NextResponse.json(
        { error: 'Error al guardar onboarding' },
        { status: 500 }
      );
    }

    console.log('Onboarding completado exitosamente:', data);
    return NextResponse.json({ 
      success: true, 
      data 
    });

  } catch (error) {
    console.error('Error en complete-onboarding:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}