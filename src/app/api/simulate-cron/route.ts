import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Llamar a nuestro endpoint de actualización de estadísticas
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/cron/update-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al simular el cron job:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al simular el cron job' 
    }, { status: 500 });
  }
}
