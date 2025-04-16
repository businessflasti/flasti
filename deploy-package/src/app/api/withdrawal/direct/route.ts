import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { userId, amount, email } = await request.json();
    
    console.log('Procesando retiro directo para:', userId, 'Monto:', amount, 'Email:', email);
    
    // Crear un ID para la solicitud
    const requestId = uuidv4();
    
    // 1. Crear la solicitud de retiro directamente
    const { error: insertError } = await supabase
      .from('withdrawal_requests')
      .insert({
        id: requestId,
        user_id: userId,
        amount: parseFloat(amount),
        payment_method: 'paypal',
        payment_details: { email },
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error('Error al crear solicitud:', insertError);
      return NextResponse.json({ 
        success: false, 
        message: 'Error al crear solicitud de retiro' 
      }, { status: 500 });
    }
    
    // 2. Actualizar el balance del usuario (restar el monto)
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        balance: supabase.rpc('decrement_balance', { 
          user_id_param: userId, 
          amount_param: parseFloat(amount) 
        })
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error al actualizar balance:', updateError);
      
      // Si hay error al actualizar el balance, eliminar la solicitud
      await supabase
        .from('withdrawal_requests')
        .delete()
        .eq('id', requestId);
      
      return NextResponse.json({ 
        success: false, 
        message: 'Error al actualizar el balance' 
      }, { status: 500 });
    }
    
    // 3. Obtener el nuevo balance
    const { data: newBalanceData, error: balanceError } = await supabase
      .from('user_profiles')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    const newBalance = newBalanceData?.balance || 0;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Solicitud de retiro creada correctamente',
      requestId: requestId,
      newBalance: newBalance
    });
  } catch (error: any) {
    console.error('Error en el proceso de retiro:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Error interno del servidor' 
    }, { status: 500 });
  }
}
