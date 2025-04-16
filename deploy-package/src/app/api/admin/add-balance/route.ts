import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, amount } = await request.json();

    if (!email || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json({
        success: false,
        message: 'Se requiere un correo electrónico y un monto válido'
      }, { status: 400 });
    }

    // Buscar el usuario por correo electrónico en la tabla auth.users
    console.log('Buscando usuario con correo:', email);

    // Primero intentamos buscar en la tabla auth.users
    let { data: userData, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      console.error('Error al listar usuarios:', userError);

      // Si falla, intentamos buscar directamente en la tabla users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (usersError) {
        console.error('Error al buscar en tabla users:', usersError);

        // Último intento: buscar en profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (profilesError) {
          console.error('Error al buscar en tabla profiles:', profilesError);
          return NextResponse.json({
            success: false,
            message: 'Usuario no encontrado después de buscar en todas las tablas posibles'
          }, { status: 404 });
        }

        userData = profilesData;
      } else {
        userData = usersData;
      }
    } else {
      // Si encontramos usuarios, buscamos el que coincide con el email
      const user = userData.users.find(u => u.email === email);
      if (!user) {
        console.error('Usuario no encontrado en la lista de usuarios');
        return NextResponse.json({
          success: false,
          message: 'Usuario no encontrado en la lista de usuarios'
        }, { status: 404 });
      }
      userData = { id: user.id };
    }

    // Ya hemos manejado los errores en el bloque anterior, así que si llegamos aquí, tenemos userData

    const userId = userData.id;

    // Verificar si el usuario tiene un perfil en user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error al verificar perfil:', profileError);
      return NextResponse.json({
        success: false,
        message: 'Error al verificar perfil de usuario'
      }, { status: 500 });
    }

    const amountToAdd = parseFloat(amount);

    if (profileData) {
      // Actualizar balance en user_profiles
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          balance: (profileData.balance || 0) + amountToAdd
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error al actualizar balance:', updateError);
        return NextResponse.json({
          success: false,
          message: 'Error al actualizar balance'
        }, { status: 500 });
      }
    } else {
      // Crear perfil en user_profiles
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          balance: amountToAdd,
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
      message: `Se han agregado $${amountToAdd} al balance del usuario ${email}`
    });
  } catch (error: any) {
    console.error('Error al agregar balance:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}
