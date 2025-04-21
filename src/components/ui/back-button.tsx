"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // No mostrar el botón en la página principal del dashboard
  if (pathname === '/dashboard') return null;

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-colors group flex items-center justify-center"
      aria-label="Volver al Inicio"
    >
      <ArrowLeft
        size={20}
        className="text-primary group-hover:scale-110 transition-transform"
      />
    </button>
  );
};

export default BackButton;