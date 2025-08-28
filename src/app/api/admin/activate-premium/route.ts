import { NextRequest, NextResponse } from 'next/server';
import { activateUserPremium, activatePremiumByEmail } from '@/lib/premium-service';

/**
 * Endpoint para activar premium manualmente (solo para testing/admin)
 * POST /api/admin/activate-premium
 * 
 * Body:
 * {
 *   "userId": "uuid", // O
 *   "email": "user@example.com", // O
 *   "paymentMethod": "manual"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, email, paymentMethod = 'manual' } = await request.json();

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Se requiere userId o email' },
        { status: 400 }
      );
    }

    let result;

    if (userId) {
      console.log(`🎯 Activando premium por userId: ${userId}`);
      result = await activateUserPremium(userId, paymentMethod);
    } else {
      console.log(`🎯 Activando premium por email: ${email}`);
      result = await activatePremiumByEmail(email, paymentMethod);
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Premium activado exitosamente',
        userId: result.userId
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error en endpoint de activación premium:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para verificar estado premium de un usuario
 * GET /api/admin/activate-premium?userId=uuid&email=user@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Se requiere userId o email' },
        { status: 400 }
      );
    }

    // Importar supabase
    const { supabase } = await import('@/lib/supabase');

    let userProfile;

    if (userId) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, is_premium, premium_activated_at, premium_payment_method')
        .eq('user_id', userId)
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      userProfile = data;
    } else {
      // Buscar por email
      const { data: authUser, error: authError } = await supabase.rpc('get_user_by_email', {
        email_param: email.toLowerCase()
      });

      if (authError || !authUser) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, is_premium, premium_activated_at, premium_payment_method')
        .eq('user_id', authUser.id)
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Perfil de usuario no encontrado' },
          { status: 404 }
        );
      }

      userProfile = data;
    }

    return NextResponse.json({
      userId: userProfile.user_id,
      isPremium: userProfile.is_premium,
      activatedAt: userProfile.premium_activated_at,
      paymentMethod: userProfile.premium_payment_method
    });

  } catch (error) {
    console.error('Error en endpoint de verificación premium:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}