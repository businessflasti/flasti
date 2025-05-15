'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Cargar el componente de notificaciones FOMO de forma diferida
const FomoNotifications = dynamic(
  () => import("@/components/notifications/FomoNotifications"),
  { ssr: false, loading: () => null }
);

interface CheckoutFomoWrapperProps {
  children: ReactNode;
}

export default function CheckoutFomoWrapper({ children }: CheckoutFomoWrapperProps) {
  return (
    <>
      {children}
      <FomoNotifications />
    </>
  );
}
