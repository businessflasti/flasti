"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function FlastiBentoGrid() {
  const { t } = useLanguage();

  const items = [
    {
      title: "Explora tu área de trabajo",
      description: (
        <span className="text-sm">
          Tecnología al servicio del crecimiento
        </span>
      ),
      header: <SkeletonDashboard />,
      className: "md:col-span-4 lg:col-span-4",
    },
    {
      title: t('metodosRetiroDisponibles'),
      description: (
        <span className="text-sm">
          {t('retiraGananciasSegura')}
        </span>
      ),
      header: <SkeletonWallet />,
      className: "md:col-span-2 lg:col-span-2",
    },
    {
      title: t('aprovechaFlastiAI'),
      description: (
        <span className="text-sm">
          {t('trabajaRapido')}
        </span>
      ),
      header: <SkeletonAI />,
      className: "md:col-span-1 lg:col-span-2",
    },
    {
      title: t('microtrabajosEnLinea'),
      description: (
        <span className="text-sm">
          {t('generaIngresosTareas')}
        </span>
      ),
      header: <SkeletonEarnings />,
      className: "md:col-span-2 lg:col-span-2",
    },
    {
      title: t('soporte24_7'),
      description: (
        <span className="text-sm">
          {t('equipoListoAyudarte')}
        </span>
      ),
      header: <SkeletonSupport />,
      className: "md:col-span-1 lg:col-span-2",
    },
  ];

  return (
    <BentoGrid className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("p-4 md:p-6", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const SkeletonDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] relative">
                    <div className="relative w-full rounded-xl overflow-hidden">
        <img
          src="/images/dashboard/dash33.jpg"
          alt="Vista previa del Dashboard de Flasti"
          className="w-full h-auto max-w-full mx-auto rounded-xl"
        />
        {/* Notificaciones flotantes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bloque flotante 1 - Estadísticas */}
          <motion.div
            className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-lg sm:rounded-xl z-30 scale-75 sm:scale-100 border border-gray-200/80 bg-white"
            style={{
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <div className="p-2 sm:p-3 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0 border border-gray-200">
                  <span className="text-[#101010] text-sm sm:text-base font-bold">$</span>
                </div>
                <div>
                  <div className="text-xs text-[#101010]/70">{t('gananciasTotal')}</div>
                  <div className="text-base sm:text-lg font-bold text-[#101010]">$874.00</div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Bloque flotante 2 - Retiro */}
          <motion.div
            className="absolute top-16 right-4 sm:top-24 sm:right-8 rounded-lg sm:rounded-xl z-30 scale-75 sm:scale-100 border border-gray-200/80 bg-white"
            style={{
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <div className="p-2 sm:p-3 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0 border border-gray-200">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#101010]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[#101010]/70">{t('ultimoRetiro')}</div>
                  <div className="text-base sm:text-lg font-bold text-[#101010]">$162.00</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SkeletonWallet = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <div className="flex flex-row rounded-full border border-gray-200 p-2 items-center space-x-2 bg-white">
        <div className="w-6 h-6 rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
          <img src="/images/paypal.webp" alt="PayPal" className="h-4 w-4 object-contain" />
        </div>
        <span className="text-xs font-medium text-[#101010]">PayPal</span>
      </div>
      <div className="flex flex-row rounded-3xl border border-gray-200 p-2 items-center space-x-2 bg-white">
        <div className="w-6 h-6 rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
          <img src="/images/banco.webp" alt="Banco" className="h-4 w-4 object-contain" />
        </div>
        <span className="text-xs font-medium text-[#101010]">Transferencia bancaria</span>
      </div>
    </div>
  );
};

const SkeletonAI = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] relative overflow-hidden rounded-3xl">
      <img
        src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/flastiai.webp"
        alt="Flasti AI"
        className="w-full h-full object-cover rounded-3xl"
      />
    </div>
  );
};

const SkeletonEarnings = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2">
      <div className="h-full w-1/3 rounded-3xl bg-white px-2 py-4 border border-gray-200 flex flex-col items-center justify-center min-h-[8rem]">
        <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#101010]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <p className="text-xs text-center font-semibold text-[#101010] mt-4">
          Descargar<br />aplicación
        </p>
        <div className="mt-4 min-h-[24px] flex items-center">
          <p className="border border-green-500 bg-green-100 text-green-600 text-xs rounded-full px-2 py-0.5">
            Completado
          </p>
        </div>
      </div>
      <div className="h-full w-1/3 rounded-3xl bg-white px-2 py-4 border border-gray-200 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#101010]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xs text-center font-semibold text-[#101010] mt-4">
          Mirar video<br />(12 min)
        </p>
        <div className="mt-4 min-h-[24px] flex items-center">
          <p className="border border-green-500 bg-green-100 text-green-600 text-xs rounded-full px-2 py-0.5">
            Completado
          </p>
        </div>
      </div>
      <div className="h-full w-1/3 rounded-3xl bg-white px-2 py-4 border border-gray-200 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#101010]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 2C5.4 2 2 5.4 2 9.5V14c0 4.1 3.4 7.5 7.5 7.5H14c4.1 0 7.5-3.4 7.5-7.5V9.5C21.5 5.4 18.1 2 14 2H9.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10.8v1.5M16.5 10.8v1.5M12 7v1.5M9.8 15h3.7" />
          </svg>
        </div>
        <p className="text-xs text-center font-semibold text-[#101010] mt-4">
          Probar juego<br />(30 min)
        </p>
        <div className="mt-4 min-h-[24px] flex items-center">
          <p className="border border-orange-500 bg-orange-100 text-orange-600 text-xs rounded-full px-2 py-0.5 min-w-[85px] text-center">
            Iniciar
          </p>
        </div>
      </div>
    </div>
  );
};

const SkeletonSupport = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <div className="flex flex-row rounded-3xl border border-gray-200 p-2 items-center space-x-2 bg-white">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3C66CD] to-[#ed4066] flex items-center justify-center">
          <span className="text-white text-xs font-bold">24</span>
        </div>
        <p className="text-xs text-[#101010]">
          Estamos a tu lado...
        </p>
      </div>
      <div className="flex flex-row rounded-full border border-gray-200 p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white">
        <p className="text-xs text-[#101010]">¡Siempre aquí para ti!</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shrink-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">7</span>
        </div>
      </div>
    </div>
  );
};

const SkeletonRanking = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <div className="flex flex-row rounded-3xl border border-neutral-100 dark:border-white/[0.2] p-2 items-start space-x-2 bg-white dark:bg-black">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">#49</span>
        </div>
        <p className="text-xs text-neutral-500">
          Tu posición actual en el ranking global de creadores...
        </p>
      </div>
      <div className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-black">
        <p className="text-xs text-neutral-500">¡Sigue subiendo!</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shrink-0" />
      </div>
    </div>
  );
};