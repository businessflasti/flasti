'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Componente para rastrear y gestionar códigos de afiliados
 * Se debe incluir en el layout principal para que se ejecute en todas las páginas
 */
function AffiliateTrackerContent() {
  const searchParams = useSearchParams();
  // Usar una referencia para rastrear si ya procesamos este código
  const processedRef = useRef(false);

  useEffect(() => {
    // Función para rastrear el código de afiliado
    const trackAffiliate = async () => {
      // Obtener el código de afiliado de la URL
      const ref = searchParams.get('ref');

      // Si no hay código de afiliado o ya lo procesamos, no hacer nada
      if (!ref || processedRef.current) return;

      // Marcar como procesado inmediatamente para evitar múltiples ejecuciones
      processedRef.current = true;

      try {
        console.log('Código de afiliado detectado:', ref);

        // Almacenar el código de afiliado en localStorage inmediatamente
        // sin esperar a la verificación para evitar bloqueos
        localStorage.setItem('flasti_affiliate', JSON.stringify({
          ref,
          timestamp: Date.now()
        }));

        // También almacenar en cookie para compatibilidad
        document.cookie = `flasti_affiliate=${ref}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;

        // Verificar si el código de afiliado es válido en segundo plano
        // sin bloquear la interfaz
        setTimeout(async () => {
          try {
            const { data: affiliateData, error: affiliateError } = await supabase
              .from('affiliates')
              .select('id, affiliate_code')
              .eq('affiliate_code', ref)
              .eq('status', 'active')
              .single();

            // Si hay un error o no se encuentra el afiliado
            if (affiliateError || !affiliateData) {
              console.error('Código de afiliado inválido:', affiliateError || 'No encontrado');
              return;
            }

            // Actualizar localStorage con el ID del afiliado
            const storedData = localStorage.getItem('flasti_affiliate');
            if (storedData) {
              const parsedData = JSON.parse(storedData);
              localStorage.setItem('flasti_affiliate', JSON.stringify({
                ...parsedData,
                affiliateId: affiliateData.id
              }));
            }

            // Registrar el clic en la base de datos en segundo plano
            // usando un endpoint separado o directamente en la base de datos
            const { error: clickError } = await supabase
              .from('affiliate_clicks')
              .insert({
                affiliate_id: affiliateData.id,
                ip_address: null,
                user_agent: navigator.userAgent,
                referrer: document.referrer || window.location.origin,
                url: window.location.href
              });

            if (clickError) {
              console.error('Error al registrar clic (no crítico):', clickError.message);
            } else {
              console.log('Clic de afiliado registrado correctamente');
            }
          } catch (error) {
            console.error('Error en el procesamiento en segundo plano:', error);
          }
        }, 100); // Retrasar ligeramente para no bloquear la carga inicial
      } catch (error) {
        console.error('Error en el seguimiento de afiliado:', error);
      }
    };

    // Ejecutar el seguimiento inmediatamente
    trackAffiliate();

    // Limpiar al desmontar
    return () => {
      processedRef.current = false;
    };
  }, [searchParams]);

  // Este componente no renderiza nada visible
  return null;
}

export default function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <AffiliateTrackerContent />
    </Suspense>
  );
}
