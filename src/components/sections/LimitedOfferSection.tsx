"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Zap, Check, Clock, Shield, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const LimitedOfferSection = () => {
  const [progress, setProgress] = useState(87);

  // Simular que el progreso aumenta lentamente para crear sensación de urgencia
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(timer);
          return 95;
        }
        return prevProgress + 0.1;
      });
    }, 10000); // Aumenta cada 10 segundos

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos del fondo */}
      <div className="absolute inset-0 z-0 hardware-accelerated">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#d4386c]/10 to-transparent opacity-30"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-[#ec4899]/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#f97316]/10 blur-3xl"></div>
        <div className="absolute top-40 left-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
        <div className="absolute bottom-40 right-[15%] w-2 h-2 rounded-full bg-[#f97316] animate-ping"></div>
      </div>

      {/* Contenedor principal */}
      <div className="container-custom relative z-10">
        {/* Encabezado de oferta - Mantener rojo para urgencia */}
        <div className="bg-gradient-to-r from-[#f43f5e] to-[#ef4444] rounded-t-xl p-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">OFERTA LIMITADA</h2>
          <p className="text-white/90">
            ¡Caro! Es ahora por 10 dólares o quedas fuera, ¿qué eliges?
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="bg-black/80 p-3 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-[#ef4444] mr-2" />
              <span className="text-white text-sm">¡Terminándose rápido! Los cupos están casi agotados. ¡Consigue el tuyo!</span>
            </div>
            <span className="text-white text-sm font-bold">{Math.floor(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-[#ef4444]/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ef4444] to-[#22c55e] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="glass-card border border-white/10 rounded-b-xl p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Columna izquierda - Detalles del plan */}
            <div>
              <div className="flex items-center mb-8">
                <div className="mr-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#d4386c] to-[#3359b6] flex items-center justify-center">
                  <span className="text-white text-xl font-bold">F</span>
                </div>
                <span className="text-2xl font-bold">flasti</span>
                <span className="mx-3 text-xl">+</span>
                <div className="bg-[#d4386c] text-white px-4 py-1 rounded-md font-bold mr-2">
                  PLUS
                </div>
                <div className="bg-[#eab308] text-white px-4 py-1 rounded-md font-bold">
                  GOLD
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-4 rounded-3xl border border-white/10 bg-gradient-to-r from-[#d4386c]/20 to-[#d4386c]/5">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#d4386c]/20 flex items-center justify-center mr-3 border border-white/10">
                      <Check className="h-4 w-4 text-[#d4386c]" />
                    </div>
                    <span>Acceso inmediato a la plataforma</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-3xl border border-white/10 bg-gradient-to-r from-[#d4386c]/20 to-[#d4386c]/5">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#d4386c]/20 flex items-center justify-center mr-3 border border-white/10">
                      <Check className="h-4 w-4 text-[#d4386c]" />
                    </div>
                    <span>Flasti Plus | Incluida sin costo adicional</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-3xl border border-white/10 bg-gradient-to-r from-[#eab308]/20 to-[#eab308]/5">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#eab308]/20 flex items-center justify-center mr-3 border border-white/10">
                      <Check className="h-4 w-4 text-[#eab308]" />
                    </div>
                    <span>Flasti Gold | Incluida sin costo adicional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Tarjeta de precio */}
            <div>
              <div className="glass-card border border-white/10 rounded-3xl p-6 bg-gradient-to-br from-[#f97316]/20 to-[#eab308]/20 backdrop-blur-md">
                <div className="bg-[#ef4444] text-white text-sm px-3 py-1 rounded-full inline-block mb-3">
                  -80% casi acaba
                </div>

                <div className="flex items-center mb-4">
                  <Zap className="h-5 w-5 text-[#eab308] mr-2" />
                  <span className="font-medium">¡Descuento Aplicado!</span>
                </div>

                <div className="mb-6">
                  <div className="text-5xl font-bold text-[#22c55e]">$10</div>
                  <div className="text-sm text-foreground/70">/o $11.704 pesos 🇦🇷</div>
                </div>

                <hr className="border-white/10 mb-6" />

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4386c]/20 to-[#3359b6]/20 flex items-center justify-center mr-3 border border-white/10">
                      <Check className="h-4 w-4 text-[#d4386c]" />
                    </div>
                    <span>Único pago</span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4386c]/20 to-[#3359b6]/20 flex items-center justify-center mr-3 border border-white/10">
                      <Clock className="h-4 w-4 text-[#d4386c]" />
                    </div>
                    <span>Acceso de por vida</span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4386c]/20 to-[#3359b6]/20 flex items-center justify-center mr-3 border border-white/10">
                      <Shield className="h-4 w-4 text-[#d4386c]" />
                    </div>
                    <span>Pago Seguro</span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4386c]/20 to-[#3359b6]/20 flex items-center justify-center mr-3 border border-white/10">
                      <Shield className="h-4 w-4 text-[#d4386c]" />
                    </div>
                    <span>Garantía asegurada</span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4386c]/20 to-[#3359b6]/20 flex items-center justify-center mr-3 border border-white/10">
                      <HeadphonesIcon className="h-4 w-4 text-[#d4386c]" />
                    </div>
                    <span>Soporte 24/7</span>
                  </div>
                </div>

                <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-[#d4386c] to-[#3359b6] hover:opacity-90 transition-opacity border-0 shadow-lg shadow-[#d4386c]/20">
                  ¡Obtener Ahora!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedOfferSection;
