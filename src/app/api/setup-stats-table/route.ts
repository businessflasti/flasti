import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar si la tabla global_stats existe y tiene datos
    const { data: checkData, error: checkError } = await supabase
      .from('global_stats')
      .select('*')
      .limit(1);

    // Informar al usuario sobre el estado actual
    if (checkError) {
      console.error('Error al verificar la tabla global_stats:', checkError);
      return NextResponse.json({
        success: false,
        error: 'Error al verificar la tabla global_stats. Por favor, crea la tabla manualmente en el panel de Supabase.',
        details: checkError.message,
        instructions: {
          step1: "Ve al panel de Supabase y crea una tabla llamada 'global_stats'",
          step2: "Añade las columnas: id (text, primary key), generated_amount (bigint), microtasks_completed (bigint), last_updated (timestamptz)",
          step3: "Inserta un registro con id='main', generated_amount=24962460, microtasks_completed=1290418"
        }
      }, { status: 500 });
    }

    // Si la tabla existe pero no tiene datos
    if (checkData && checkData.length === 0) {
      // Intentar insertar el registro principal
      const { error: insertError } = await supabase
        .from('global_stats')
        .insert({
          id: 'main',
          generated_amount: 24962460,
          microtasks_completed: 1290418,
          last_updated: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error al insertar registro principal:', insertError);
        return NextResponse.json({
          success: false,
          error: 'No se pudo insertar el registro principal',
          details: insertError.message
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Registro principal creado correctamente'
      });
    }

    // Si la tabla existe, verificar si tiene el registro principal
    const { data, error } = await supabase
      .from('global_stats')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      // Insertar el registro principal si no existe
      const { error: insertError } = await supabase
        .from('global_stats')
        .insert({
          id: 'main',
          generated_amount: 24962460,
          microtasks_completed: 1290418,
          last_updated: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error al insertar registro principal:', insertError);
        return NextResponse.json({
          success: false,
          error: 'No se pudo insertar el registro principal'
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Registro principal creado correctamente'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'La tabla global_stats ya existe y tiene el registro principal',
      data
    });
  } catch (error) {
    console.error('Error al configurar la tabla global_stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al configurar la tabla global_stats'
    }, { status: 500 });
  }
}
