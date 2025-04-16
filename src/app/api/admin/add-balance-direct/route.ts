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
    
    // Ejecutar SQL directamente para buscar el usuario y actualizar su saldo
    const { data, error } = await supabase.rpc('add_balance_to_user', {
      p_email: email,
      p_amount: parseFloat(amount)
    });
    
    if (error) {
      console.error('Error al ejecutar función:', error);
      
      // Intentar crear el usuario y su perfil si no existe
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: email,
        password: '12345678name', // Contraseña temporal
        email_confirm: true
      });
      
      if (userError) {
        console.error('Error al crear usuario:', userError);
        return NextResponse.json({ 
          success: false, 
          message: `Error al crear usuario: ${userError.message}` 
        }, { status: 500 });
      }
      
      // Crear perfil para el usuario
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userData.user.id,
          balance: parseFloat(amount),
          level: 1
        });
      
      if (profileError) {
        console.error('Error al crear perfil:', profileError);
        return NextResponse.json({ 
          success: false, 
          message: `Error al crear perfil: ${profileError.message}` 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Se ha creado el usuario ${email} y agregado $${amount} a su balance` 
      });
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
