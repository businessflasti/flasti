import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email-service';
import analyticsService from '@/lib/analytics-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, transactionId } = body;

    // Validar datos requeridos
    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email y nombre completo son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    console.log(`Enviando email de bienvenida a: ${email} (${fullName})`);

    // Enviar email de bienvenida
    const emailResult = await sendWelcomeEmail(email, fullName);

    if (emailResult.success) {
      console.log('Email de bienvenida enviado exitosamente');
      
      // Tracking: Email enviado exitosamente
      try {
        // Nota: analyticsService funciona en el cliente, aquí solo logueamos
        console.log('Email tracking - Success:', {
          email,
          fullName,
          transactionId,
          timestamp: new Date().toISOString()
        });
      } catch (trackingError) {
        console.warn('Error en tracking de email:', trackingError);
      }

      return NextResponse.json({
        success: true,
        message: 'Email de bienvenida enviado exitosamente'
      });
    } else {
      console.error('Error al enviar email:', emailResult.error);
      
      return NextResponse.json(
        { 
          success: false, 
          error: emailResult.error || 'Error al enviar email' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en API de envío de email:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// Método GET para verificar que la API está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'API de envío de emails funcionando correctamente',
    timestamp: new Date().toISOString()
  });
}
