"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CasinoDashboardPage from './casino-page';

// Importar estilos de animaciones
import "./animations.css";

export default function DashboardPage() {
  // Simplemente renderizamos el nuevo dashboard con estilo casino
  return <CasinoDashboardPage />;
}
