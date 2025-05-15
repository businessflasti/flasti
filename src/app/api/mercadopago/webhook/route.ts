import { NextResponse } from 'next/server';

// Configuración de Mercado Pago
const ACCESS_TOKEN = 'APP_USR-1617533183479702-120313-16aa8293896b850ec41b7f267dac332e-224528502';

export async function POST(request: Request) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();

    // Registrar la notificación recibida
    console.log('Webhook de Mercado Pago recibido:', body);

    // Verificar si es una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id;

      // Obtener detalles del pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        console.error('Error al obtener detalles del pago:', await response.text());
        return NextResponse.json({ error: 'Error al obtener detalles del pago' }, { status: 500 });
      }

      const paymentData = await response.json();

      // Verificar el estado del pago
      if (paymentData.status === 'approved') {
        // Aquí puedes implementar la lógica para registrar el pago en tu sistema
        console.log('Pago aprobado:', paymentData);

        // En un sistema real, aquí activarías el acceso del usuario a la plataforma
        // Por ejemplo, actualizando una base de datos, enviando un correo, etc.
      }
    }

    // Responder con éxito
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al procesar webhook de Mercado Pago:', error);
    return NextResponse.json({ error: 'Error al procesar webhook' }, { status: 500 });
  }
}
