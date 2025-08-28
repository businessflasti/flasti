import { NextResponse } from 'next/server';

// Función para generar un incremento aleatorio realista
function getRandomIncrement(min: number, max: number): number {
  // Generar un número aleatorio entre min y max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para verificar si es hora de actualizar (aproximadamente 2 veces al día)
function shouldUpdate(): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  // Actualizar alrededor de las 10 AM y 6 PM, con un poco de variación
  // para que no sea exactamente a la misma hora todos los días
  return (
    (hour >= 9 && hour <= 11) || // Mañana (9-11 AM)
    (hour >= 17 && hour <= 19)   // Tarde (5-7 PM)
  );
}

export async function GET() {
  try {
    // Verificar si es hora de actualizar
    if (!shouldUpdate()) {
      return NextResponse.json({ 
        success: true, 
        updated: false, 
        message: 'No es hora de actualizar las estadísticas' 
      });
    }
    
    // Generar incrementos aleatorios realistas
    // Para "generados por usuarios", incrementar entre $500 y $2000
    const generatedIncrement = getRandomIncrement(500, 2000);
    
    // Para "microtareas completadas", incrementar entre 10 y 50
    const microtasksIncrement = getRandomIncrement(10, 50);
    
    // Llamar a nuestra API para actualizar los contadores
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        generated_increment: generatedIncrement,
        microtasks_increment: microtasksIncrement
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar estadísticas');
    }
    
    return NextResponse.json({ 
      success: true, 
      updated: true,
      increments: {
        generated_amount: generatedIncrement,
        microtasks_completed: microtasksIncrement
      },
      stats: data.current
    });
  } catch (error) {
    console.error('Error en el cron de actualización de estadísticas:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al actualizar estadísticas' 
    }, { status: 500 });
  }
}
