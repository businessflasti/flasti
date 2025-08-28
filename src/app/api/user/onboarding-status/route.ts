import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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

    const userId = session.user.id;
    console.log('Verificando onboarding para usuario:', userId);

    // Verificar si el usuario ya completó el onboarding
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('user_onboarding')
      .select('completed_at')
      .eq('user_id', userId)
      .single();

    console.log('Resultado de consulta onboarding:', { 
      data: onboardingData, 
      error: onboardingError?.message,
      errorCode: onboardingError?.code 
    });

    // Si no hay error y hay datos, el onboarding está completado
    const hasCompletedOnboarding = !onboardingError && onboardingData;

    const result = { 
      hasCompletedOnboarding: !!hasCompletedOnboarding,
      completedAt: onboardingData?.completed_at || null,
      userId: userId // Para debugging
    };

    console.log('Enviando respuesta:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error en onboarding-status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}