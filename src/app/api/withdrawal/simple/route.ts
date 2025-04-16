import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { userId, amount, email } = await request.json();

    if (!userId || !amount || !email) {
      return NextResponse.json({
        success: false,
        message: 'Faltan datos requeridos'
      }, { status: 400 });
    }

    // Verificar que el monto sea válido
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return NextResponse.json({
        success: false,
        message: 'El monto debe ser mayor a cero'
      }, { status: 400 });
    }

    console.log('Procesando retiro para usuario:', userId, 'Monto:', amountValue, 'Email:', email);

    // Verificar el balance del usuario - Intentar obtener directamente
    let currentBalance = 0;

    // Intentar obtener el balance directamente
    const { data: directData, error: directError } = await supabase
      .from('user_profiles')
      .select('balance')
      .eq('user_id', userId);

    if (directError || !directData || directData.length === 0) {
      console.error('Error al obtener perfil directamente:', directError);

      // Crear un perfil para el usuario si no existe
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          balance: 100, // Asignar un balance inicial de 100
          level: 1
        });

      if (insertError) {
        console.error('Error al crear perfil:', insertError);
        return NextResponse.json({
          success: false,
          message: 'No se pudo crear un perfil para el usuario'
        }, { status: 500 });
      }

      // Perfil creado exitosamente, asignar balance inicial
      console.log('Perfil creado exitosamente con balance inicial de 100');
      currentBalance = 100;
    } else {
      // Si encontramos el perfil directamente
      currentBalance = directData[0]?.balance || 0;
      console.log('Balance obtenido directamente:', currentBalance);
    }

    // Verificar que tenga suficiente balance
    if (currentBalance < amountValue) {
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
        amount: amountValue,
        payment_method: 'paypal',
        payment_details: { email },
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error al crear solicitud de retiro:', insertError);
      return NextResponse.json({
        success: false,
        message: 'Error al crear solicitud de retiro'
      }, { status: 500 });
    }

    // Actualizar el balance del usuario
    const newBalance = currentBalance - amountValue;
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ balance: newBalance })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error al actualizar balance:', updateError);

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
