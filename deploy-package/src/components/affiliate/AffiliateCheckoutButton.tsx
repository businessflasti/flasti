'use client';

import { Button } from '@/components/ui/button';
import { addAffiliateRefToUrl } from '@/lib/affiliate-tracking';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AffiliateCheckoutButtonProps {
  baseUrl: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Botón de checkout que preserva el parámetro ref de afiliado
 */
export default function AffiliateCheckoutButton({
  baseUrl,
  className,
  children
}: AffiliateCheckoutButtonProps) {
  const [checkoutUrl, setCheckoutUrl] = useState(baseUrl);
  
  useEffect(() => {
    // Agregar el parámetro ref a la URL de checkout
    const urlWithRef = addAffiliateRefToUrl(baseUrl);
    setCheckoutUrl(urlWithRef);
  }, [baseUrl]);
  
  return (
    <Button asChild className={className}>
      <Link href={checkoutUrl}>
        {children}
      </Link>
    </Button>
  );
}
