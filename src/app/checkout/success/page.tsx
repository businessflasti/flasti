"use client";

import { useEffect, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import unifiedTrackingService from '@/lib/unified-tracking-service';

function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Obtener parámetros de la URL
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const paymentType = searchParams.get('payment_type');
    const merchantOrderId = searchParams.get('merchant_order_id');

    console.log('Página de éxito cargada:', {
      paymentId,
      status,
      paymentType,
      merchantOrderId
    });

    // Si el pago fue aprobado, hacer tracking
    if (status === 'approved' && paymentId) {
      // Obtener información del precio desde localStorage
      const finalDiscountApplied = localStorage.getItem('flastiFinalDiscountApplied') === 'true';
      const discountApplied = localStorage.getItem('flastiDiscountApplied') === 'true';

      let priceUSD = 10;
      let priceARS = 11500;

      if (finalDiscountApplied) {
        priceUSD = 5;
        priceARS = 5750;
      } else if (discountApplied) {
        priceUSD = 8;
        priceARS = 9200;
      }

      // Compra completada - El tracking se hace en payment-success
      console.log('Compra completada, redirigiendo a payment-success');
    }

    // Redirigir a la página de éxito de pago después de un breve delay
    const timer = setTimeout(() => {
      window.location.href = "/payment-success";
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a2e] rounded-2xl border border-[#2a2a4a] p-8 text-center">
        {/* Icono de éxito */}
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-white mb-4">
          ¡Pago Exitoso!
        </h1>

        {/* Descripción */}
        <p className="text-white/70 mb-6">
          Tu pago ha sido procesado correctamente. En unos segundos serás redirigido para completar tu registro.
        </p>

        {/* Indicador de carga */}
        <div className="flex items-center justify-center gap-2 text-blue-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Redirigiendo...</span>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
