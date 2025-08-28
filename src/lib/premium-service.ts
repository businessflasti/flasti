import { supabase } from '@/lib/supabase';

export interface PremiumActivationResult {
  success: boolean;
  error?: string;
  userId?: string;
}

/**
 * Activa el estado premium para un usuario específico
 */
export async function activateUserPremium(
  userId: string,
  paymentMethod: string,
  transactionId?: string
): Promise<PremiumActivationResult> {
  try {
    console.log(`🎯 Activando premium para usuario: ${userId}`);
    console.log(`💳 Método de pago: ${paymentMethod}`);
    console.log(`🔢 Transaction ID: ${transactionId || 'N/A'}`);

    // Usar la función SQL para activar premium
    const { data, error } = await supabase.rpc('activate_user_premium', {
      user_id_param: userId,
      payment_method_param: paymentMethod
    });

    if (error) {
      console.error('❌ Error activando premium:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Verificar que el usuario fue actualizado
    const { data: userProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('is_premium, premium_activated_at, premium_payment_method')
      .eq('user_id', userId)
      .single();

    if (checkError) {
      console.error('❌ Error verificando activación premium:', checkError);
      return {
        success: false,
        error: 'Error verificando activación premium'
      };
    }

    if (!userProfile.is_premium) {
      console.error('❌ Premium no se activó correctamente');
      return {
        success: false,
        error: 'Premium no se activó correctamente'
      };
    }

    console.log('✅ Premium activado exitosamente:', {
      userId,
      isPremium: userProfile.is_premium,
      activatedAt: userProfile.premium_activated_at,
      paymentMethod: userProfile.premium_payment_method
    });

    return {
      success: true,
      userId
    };

  } catch (error) {
    console.error('💥 Error inesperado activando premium:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Busca un usuario por email en checkout_leads y activa su premium
 */
export async function activatePremiumByEmail(
  email: string,
  paymentMethod: string,
  transactionId?: string
): Promise<PremiumActivationResult> {
  try {
    console.log(`🔍 Buscando usuario por email: ${email}`);

    // Buscar el lead más reciente con este email
    const { data: leads, error: leadError } = await supabase
      .from('checkout_leads')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('payment_method', paymentMethod)
      .order('created_at', { ascending: false })
      .limit(1);

    if (leadError) {
      console.error('❌ Error buscando lead:', leadError);
      return {
        success: false,
        error: 'Error buscando información del usuario'
      };
    }

    if (!leads || leads.length === 0) {
      console.error('❌ No se encontró lead para el email:', email);
      return {
        success: false,
        error: 'No se encontró información del usuario'
      };
    }

    const lead = leads[0];
    console.log('📋 Lead encontrado:', {
      id: lead.id,
      email: lead.email,
      fullName: lead.full_name,
      paymentMethod: lead.payment_method,
      userId: lead.user_id
    });

    // Si el lead tiene user_id, usarlo directamente
    if (lead.user_id) {
      console.log(`👤 Usando user_id del lead: ${lead.user_id}`);
      return await activateUserPremium(lead.user_id, paymentMethod, transactionId);
    }

    // Si no tiene user_id, buscar por email en auth.users (fallback)
    console.log('🔍 Lead sin user_id, buscando en auth.users por email');
    
    // Usar una consulta RPC para buscar en auth.users de forma segura
    const { data: authUser, error: authError } = await supabase.rpc('get_user_by_email', {
      email_param: email.toLowerCase()
    });

    if (authError) {
      console.error('❌ Error buscando usuario en auth:', authError);
      return {
        success: false,
        error: 'Error buscando usuario'
      };
    }

    if (!authUser) {
      console.error('❌ Usuario no encontrado en auth.users:', email);
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }

    const userId = authUser.id;
    console.log(`👤 Usuario encontrado por email: ${userId}`);

    // Activar premium para el usuario
    return await activateUserPremium(userId, paymentMethod, transactionId);

  } catch (error) {
    console.error('💥 Error inesperado buscando usuario por email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Verifica si un usuario es premium
 */
export async function checkUserPremiumStatus(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_user_premium', {
      user_id_param: userId
    });

    if (error) {
      console.error('Error verificando estado premium:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error inesperado verificando estado premium:', error);
    return false;
  }
}