import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Interfaz para los contadores globales
interface GlobalStats {
  id: string;
  generated_amount: number;
  microtasks_completed: number;
  last_updated: string;
}

// Función para obtener los contadores actuales
async function getCurrentStats(): Promise<GlobalStats | null> {
  try {
    const { data, error } = await supabase
      .from('global_stats')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error) {
      console.error('Error al obtener estadísticas globales:', error);
      return null;
    }

    return data as GlobalStats;
  } catch (error) {
    console.error('Error inesperado al obtener estadísticas:', error);
    return null;
  }
}

// Función para actualizar los contadores
async function updateStats(generated_amount: number, microtasks_completed: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('global_stats')
      .update({
        generated_amount,
        microtasks_completed,
        last_updated: new Date().toISOString()
      })
      .eq('id', 'main');

    if (error) {
      console.error('Error al actualizar estadísticas globales:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado al actualizar estadísticas:', error);
    return false;
  }
}

// Endpoint para obtener los contadores actuales
export async function GET() {
  try {
    const stats = await getCurrentStats();

    if (!stats) {
      // Si no hay estadísticas, devolver valores predeterminados
      return NextResponse.json({
        id: 'main',
        generated_amount: 24962460,
        microtasks_completed: 1290418,
        last_updated: new Date().toISOString()
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error en GET /api/stats:', error);
    // Devolver valores predeterminados en caso de error
    return NextResponse.json({
      id: 'main',
      generated_amount: 24962460,
      microtasks_completed: 1290418,
      last_updated: new Date().toISOString(),
      _error: 'Usando valores predeterminados debido a un error'
    });
  }
}

// Endpoint para incrementar los contadores
export async function POST(request: Request) {
  try {
    // Obtener los valores actuales
    const currentStats = await getCurrentStats();

    if (!currentStats) {
      // Si no existen, crear un registro inicial
      const { error } = await supabase
        .from('global_stats')
        .insert({
          id: 'main',
          generated_amount: 24962460, // Valor inicial
          microtasks_completed: 1290418, // Valor inicial
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error al crear estadísticas iniciales:', error);
        return NextResponse.json({ error: 'Error al crear estadísticas iniciales' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Estadísticas iniciales creadas' });
    }

    // Obtener los incrementos del cuerpo de la solicitud
    const { generated_increment, microtasks_increment } = await request.json();

    // Calcular los nuevos valores
    const newGeneratedAmount = currentStats.generated_amount + (generated_increment || 0);
    const newMicrotasksCompleted = currentStats.microtasks_completed + (microtasks_increment || 0);

    // Actualizar los valores
    const success = await updateStats(newGeneratedAmount, newMicrotasksCompleted);

    if (!success) {
      return NextResponse.json({ error: 'Error al actualizar estadísticas' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      previous: {
        generated_amount: currentStats.generated_amount,
        microtasks_completed: currentStats.microtasks_completed
      },
      current: {
        generated_amount: newGeneratedAmount,
        microtasks_completed: newMicrotasksCompleted
      }
    });
  } catch (error) {
    console.error('Error en la API de estadísticas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
