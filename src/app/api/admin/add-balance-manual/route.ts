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
    
    // Agregar saldo manualmente para el usuario específico
    if (email === 'fagibor419@provko.com') {
      // Buscar el usuario en la tabla users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      let userId;
      
      if (usersError) {
        console.log('Usuario no encontrado en tabla users, creando nuevo usuario');
        
        // Crear un nuevo usuario
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email: email,
            name: 'Usuario de Prueba',
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (createError) {
          console.error('Error al crear usuario:', createError);
          return NextResponse.json({ 
            success: false, 
            message: 'Error al crear usuario' 
          }, { status: 500 });
        }
        
        userId = newUser.id;
      } else {
        userId = usersData.id;
      }
      
      // Verificar si el usuario tiene un perfil
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('balance')
        .eq('user_id', userId)
        .single();
      
      if (profileError) {
        console.log('Perfil no encontrado, creando nuevo perfil');
        
        // Crear un nuevo perfil
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
      } else {
        // Actualizar el balance existente
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            balance: (profileData.balance || 0) + parseFloat(amount) 
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error al actualizar balance:', updateError);
          return NextResponse.json({ 
            success: false, 
            message: 'Error al actualizar balance' 
          }, { status: 500 });
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Se han agregado $${amount} al balance del usuario ${email}` 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Usuario no autorizado para esta operación' 
    }, { status: 403 });
  } catch (error: any) {
    console.error('Error al agregar balance:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Error interno del servidor' 
    }, { status: 500 });
  }
}
