import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import hotmartTrackingService from '@/lib/hotmart-tracking-service';

// Configuración de Mercado Pago desde variables de entorno
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-1617533183479702-120313-16aa8293896b850ec41b7f267dac332e-224528502';
const WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;

/**
 * Webhook de Mercado Pago para procesar notificaciones de pago
 * URL: https://flasti.com/api/mercadopago/webhook
 * Eventos: payment
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook de Mercado Pago recibido');
    console.log('📅 Timestamp:', new Date().toISOString());

    // Obtener headers importantes para validación
    const signature = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');

    console.log('📋 Headers del webhook:', {
      signature: signature ? 'presente' : 'ausente',
      requestId,
      userAgent: request.headers.get('user-agent'),
      contentType: request.headers.get('content-type')
    });

    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    console.log('📦 Payload del webhook:', JSON.stringify(body, null, 2));

    // Validar la firma del webhook si está configurada
    if (signature && WEBHOOK_SECRET) {
      const isValid = validateWebhookSignature(
        JSON.stringify(body),
        signature,
        WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error('❌ Firma del webhook inválida');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }

      console.log('✅ Firma del webhook validada');
    } else {
      console.log('⚠️ Webhook sin validación de firma');
    }

    // Verificar si es una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      console.log('💳 ID del pago:', paymentId);

      // Obtener detalles del pago desde la API de Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al obtener detalles del pago:', response.status, errorText);
        return NextResponse.json({ error: 'Error al obtener detalles del pago' }, { status: 500 });
      }

      const paymentData = await response.json();
      console.log('💰 Detalles del pago:', {
        id: paymentData.id,
        status: paymentData.status,
        amount: paymentData.transaction_amount,
        currency: paymentData.currency_id,
        email: paymentData.payer?.email,
        payment_method: paymentData.payment_method_id
      });

      // Verificar el estado del pago
      if (paymentData.status === 'approved') {
        console.log('✅ Pago aprobado, procesando...');

        try {
          // Buscar el lead en Supabase usando el external_reference o payment_id
          const { data: leads, error: searchError } = await supabase
            .from('checkout_leads')
            .select('*')
            .eq('payment_method', 'mercadopago')
            .eq('status', 'form_submitted')
            .order('created_at', { ascending: false })
            .limit(10);

          if (searchError) {
            console.error('Error al buscar leads:', searchError);
            return NextResponse.json({ error: 'Error al buscar leads' }, { status: 500 });
          }

          // Buscar el lead más reciente que coincida con el monto del pago
          const paymentAmount = paymentData.transaction_amount;
          const matchingLead = leads?.find(lead =>
            Math.abs(lead.amount - paymentAmount) < 100 // Tolerancia de 100 ARS
          );

          if (matchingLead) {
            console.log('Lead encontrado:', matchingLead);

            // Actualizar el lead con el transaction_id y status
            const { error: updateError } = await supabase
              .from('checkout_leads')
              .update({
                transaction_id: paymentData.id.toString(),
                status: 'completed',
                metadata: {
                  ...matchingLead.metadata,
                  payment_data: {
                    payment_id: paymentData.id,
                    status: paymentData.status,
                    payment_method_id: paymentData.payment_method_id,
                    payment_type_id: paymentData.payment_type_id,
                    transaction_amount: paymentData.transaction_amount,
                    date_approved: paymentData.date_approved
                  }
                }
              })
              .eq('id', matchingLead.id);

            if (updateError) {
              console.error('Error al actualizar lead:', updateError);
            } else {
              console.log('Lead actualizado exitosamente');
            }

            // Enviar email de bienvenida
            try {
              console.log('Enviando email de bienvenida para Mercado Pago...');
              const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-welcome-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: matchingLead.email,
                  fullName: matchingLead.full_name,
                  transactionId: paymentData.id.toString()
                }),
              });

              const emailResult = await emailResponse.json();

              if (emailResult.success) {
                console.log('Email de bienvenida enviado exitosamente para Mercado Pago');
              } else {
                console.error('Error al enviar email de bienvenida:', emailResult.error);
              }
            } catch (emailError) {
              console.error('Error inesperado al enviar email:', emailError);
            }
          } else {
            console.log('No se encontró un lead matching para el pago:', {
              paymentAmount,
              availableLeads: leads?.map(l => ({ id: l.id, amount: l.amount, email: l.email }))
            });
          }
        } catch (error) {
          console.error('Error al procesar pago aprobado:', error);
        }

        // Enviar evento a la API de conversiones de Meta
        try {
          const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
          const pixelEventData = {
            value: paymentData.transaction_amount,
            currency: paymentData.currency_id,
            content_ids: ['flasti-access'],
            content_name: 'Flasti Access',
            content_type: 'product',
            num_items: 1
          };
          const userData = {
            email: paymentData.payer?.email || '',
            firstName: paymentData.payer?.first_name || '',
            lastName: paymentData.payer?.last_name || ''
          };
          await hotmartTrackingService['sendServerSidePixelEvent']('Purchase', pixelEventData, userData, ip);
          console.log('Evento Purchase enviado a Meta Conversions API');
        } catch (err) {
          console.error('Error enviando evento Purchase a Meta:', err);
        }
      }
    }

    // Responder con éxito
    return NextResponse.json({ success: true, message: 'Webhook procesado correctamente' });
  } catch (error) {
    console.error('💥 Error al procesar webhook de Mercado Pago:', error);
    return NextResponse.json({
      error: 'Error al procesar webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Valida la firma del webhook de Mercado Pago
 */
function validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Error al validar firma del webhook:', error);
    return false;
  }
}
