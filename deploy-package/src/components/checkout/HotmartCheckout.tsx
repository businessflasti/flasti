'use client';

import { useEffect, useRef, useState } from 'react';
import { getCurrentAffiliateRef } from '@/lib/affiliate-tracking';

interface HotmartCheckoutProps {
  productId: string;
  hotmartUrl: string;
}

/**
 * Componente que muestra el formulario de checkout de Hotmart
 * y preserva la información del afiliado
 */
export default function HotmartCheckout({ productId, hotmartUrl }: HotmartCheckoutProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [affiliateRef, setAffiliateRef] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Obtener el ID del afiliado
    const ref = getCurrentAffiliateRef();
    setAffiliateRef(ref);
    
    // Registrar la visita a la página de checkout
    if (ref) {
      fetch(`/api/affiliate/checkout-visit?ref=${ref}&product=${productId}`, {
        method: 'GET',
        credentials: 'include',
      }).catch(error => {
        console.error('Error al registrar visita de checkout:', error);
      });
    }
  }, [productId]);
  
  // Construir la URL de Hotmart con el parámetro de afiliado
  const finalHotmartUrl = affiliateRef 
    ? `${hotmartUrl}${hotmartUrl.includes('?') ? '&' : '?'}aff=${affiliateRef}&src=flasti`
    : hotmartUrl;
  
  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Cargando formulario de pago...</p>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={finalHotmartUrl}
        width="100%"
        height="700px"
        frameBorder="0"
        scrolling="yes"
        onLoad={() => setIsLoading(false)}
        className={isLoading ? 'hidden' : 'block'}
      ></iframe>
      
      {/* Campo oculto para almacenar la información del afiliado */}
      {affiliateRef && (
        <input type="hidden" id="affiliate_ref" name="affiliate_ref" value={affiliateRef} />
      )}
    </div>
  );
}
