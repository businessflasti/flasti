import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, amount } = await request.json();
    
    if (!email || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Se requiere un correo electrónico y un monto válido' 
      }, { status: 400 });
    }
    
    console.log('Agregando saldo a:', email, 'Monto:', amount);
    
    // Buscar el usuario por correo electrónico en la tabla auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !userData?.user) {
      console.error('Error al buscar usuario:', userError);
      
      // Intentar buscar en la tabla users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (usersError) {
        console.error('Error al buscar en tabla users:', usersError);
        return NextResponse.json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        }, { status: 404 });
      }
      
      // Actualizar el balance en user_profiles
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          balance: supabase.rpc('increment_balance', { 
            user_id_param: usersData.id, 
            amount_param: parseFloat(amount) 
          })
        })
        .eq('user_id', usersData.id);
      
      if (updateError) {
        console.error('Error al actualizar balance:', updateError);
        
        // Intentar insertar un nuevo perfil
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: usersData.id,
            balance: parseFloat(amount),
            level: 1
          });
        
        if (insertError) {
          console.error('Error al crear perfil:', insertError);
          return NextResponse.json({ 
            success: false, 
            message: 'Error al crear perfil de usuario' 
          }, { status: 500 });
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Se han agregado $${amount} al balance del usuario ${email}` 
      });
    }
    
    const userId = userData.user.id;
    
    // Actualizar directamente la tabla user_profiles con SQL
    const { data, error } = await supabase.rpc('add_balance_to_user_simple', {
      email_param: email,
      amount_param: parseFloat(amount)
    });
    
    if (error) {
      console.error('Error al ejecutar función:', error);
      
      // Intentar actualizar directamente
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          balance: supabase.rpc('increment_balance', { 
            user_id_param: userId, 
            amount_param: parseFloat(amount) 
          })
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error al actualizar balance:', updateError);
        
        // Intentar insertar un nuevo perfil
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            balance: parseFloat(amount),
            level: 1
          });
        
        if (insertError) {
          console.error('Error al crear perfil:', insertError);
          return NextResponse.json({ 
            success: false, 
            message: 'Error al crear perfil de usuario' 
          }, { status: 500 });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Se han agregado $${amount} al balance del usuario ${email}` 
    });
  } catch (error: any) {
    console.error('Error al agregar balance:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Error interno del servidor' 
    }, { status: 500 });
  }
}
