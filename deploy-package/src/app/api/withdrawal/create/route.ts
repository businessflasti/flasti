import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { userId, amount, paymentMethod, paymentDetails } = await request.json();

    if (!userId || !amount || !paymentMethod || !paymentDetails) {
      return NextResponse.json({
        success: false,
        message: 'Faltan datos requeridos'
      }, { status: 400 });
    }

    // Verificar que el monto sea válido
    if (amount <= 0) {
      return NextResponse.json({
        success: false,
        message: 'El monto debe ser mayor a cero'
      }, { status: 400 });
    }

    // Verificar el balance del usuario
    let currentBalance = 0;
    let profileFound = false;

    console.log('Procesando retiro para usuario con ID:', userId);

    // Primero buscar en user_profiles
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('user_profiles')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (!userProfileError && userProfileData) {
      console.log('Perfil encontrado en user_profiles con balance:', userProfileData.balance);
      currentBalance = userProfileData.balance || 0;
      profileFound = true;
    } else {
      console.log('Perfil no encontrado en user_profiles, error:', userProfileError?.message);

      // Si no se encuentra, buscar en profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single();

      if (!profileError && profileData) {
        console.log('Perfil encontrado en profiles con balance:', profileData.balance);
        currentBalance = profileData.balance || 0;
        profileFound = true;
      } else {
        console.log('Perfil no encontrado en profiles, error:', profileError?.message);
      }
    }

    // Si no se encontró el perfil en ninguna tabla, crear uno
    if (!profileFound) {
      console.log('Perfil no encontrado en ninguna tabla, creando uno nuevo en user_profiles');

      // Crear un perfil en user_profiles con balance 0
      const { error: createProfileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          balance: 0,
          level: 1
        });

      if (createProfileError) {
        console.error('Error al crear perfil:', createProfileError);
        return NextResponse.json({
          success: false,
          message: `Error al crear perfil: ${createProfileError.message}`
        }, { status: 500 });
      }

      // El balance sigue siendo 0
      currentBalance = 0;
    }

    // Verificar que tenga suficiente balance
    if (currentBalance < amount) {
      return NextResponse.json({
        success: false,
        message: 'Balance insuficiente'
      }, { status: 400 });
    }

    // Generar ID para la solicitud
    const requestId = uuidv4();

    // Crear la solicitud de retiro
    const { error: insertError } = await supabase
      .from('withdrawal_requests')
      .insert({
        id: requestId,
        user_id: userId,
        amount: amount,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error al crear solicitud de retiro:', insertError);
      return NextResponse.json({
        success: false,
        message: `Error al crear solicitud: ${insertError.message}`
      }, { status: 500 });
    }

    // Actualizar el balance del usuario
    const newBalance = currentBalance - amount;
    let updateSuccess = false;

    // Primero intentar actualizar en user_profiles
    const { error: updateUserProfileError } = await supabase
      .from('user_profiles')
      .update({ balance: newBalance })
      .eq('user_id', userId);

    if (!updateUserProfileError) {
      updateSuccess = true;
    } else {
      // Si falla, intentar actualizar en profiles
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (!updateProfileError) {
        updateSuccess = true;
      }
    }

    if (!updateSuccess) {
      // Si no se pudo actualizar el balance, eliminar la solicitud
      await supabase
        .from('withdrawal_requests')
        .delete()
        .eq('id', requestId);

      return NextResponse.json({
        success: false,
        message: 'Error al actualizar el balance'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud de retiro creada correctamente',
      requestId: requestId,
      newBalance: newBalance
    });
  } catch (error: any) {
    console.error('Error al procesar solicitud de retiro:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Error interno al procesar la solicitud'
    }, { status: 500 });
  }
}
