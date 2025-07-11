"use client";

import React from "react";
import { DollarSign, Wallet, Zap, HeadphonesIcon, ArrowUpRight, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const DashboardPreviewSection = React.memo(() => {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black">
            {t('ingresaMundo')}
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('accedeArea')}
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl">
            <div className="p-0 rounded-2xl">
              <div className="bg-[#232323] p-6 rounded-2xl border border-white/10 overflow-hidden relative">
                <div className="relative z-10">
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <div className="relative w-full rounded-xl overflow-hidden">
                      <div className="w-full relative">
                        <img
                          src="/images/dashboard/dash33.jpg"
                          alt="Vista previa del Dashboard de Flasti"
                          className="w-full h-auto max-w-full mx-auto rounded-xl"
                        />
                        {/* Notificaciones flotantes restauradas */}
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Bloque flotante 1 - Estadísticas */}
                          <motion.div
                            className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-lg sm:rounded-xl z-30 scale-75 sm:scale-100 border border-white/10 bg-[#101010]"
                            style={{
                              borderRadius: '1rem',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="p-2 sm:p-3 rounded-xl transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#232323] flex items-center justify-center flex-shrink-0 border border-white/10">
                                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div>
                                  <div className="text-xs text-white/70">{t('gananciasTotal')}</div>
                                  <div className="text-base sm:text-lg font-bold text-white">$874.00</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          {/* Bloque flotante 2 - Retiro */}
                          <motion.div
                            className="absolute bottom-4 right-4 sm:bottom-8 sm:right-1/4 sm:translate-y-1/4 rounded-lg sm:rounded-xl z-30 scale-75 sm:scale-100 border border-white/10 bg-[#101010]"
                            style={{
                              borderRadius: '1rem',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, -8, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="p-2 sm:p-3 rounded-xl transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#232323] flex items-center justify-center flex-shrink-0 border border-white/10">
                                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div>
                                  <div className="text-xs text-white/70">{t('ultimoRetiro')}</div>
                                  <div className="text-base sm:text-lg font-bold text-white">$162.00</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Métodos de retiro disponibles */}
                  <div className="mb-8 flex flex-col items-center mt-8">
                    <div className="inline-flex items-center gap-2 mb-4 bg-[#101010] rounded-full px-4 py-2 border border-white/10">
                      <span className="text-sm dark:text-foreground/80 text-foreground/90 font-medium relative z-10">{t('metodosRetiroDisponibles')}</span>
                      <ArrowUpRight className="h-4 w-4 text-white relative z-10" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="bg-[#101010] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <img src="/images/paypal.webp" alt="PayPal" className="h-5 w-5 object-contain" />
                        </div>
                        <span className="text-sm font-medium">PayPal</span>
                      </div>

                      <div className="bg-[#101010] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <img src="/images/banco.webp" alt="Banco" className="h-5 w-5 object-contain" />
                        </div>
                        <span className="text-sm font-medium">{t('cuentaBancaria')}</span>
                      </div>
                    </div>
                  </div> {/* cierre de .mb-8.flex.flex-col.items-center.mt-8 */}

                  {/* Bloques de características */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#101010] border border-white/10 p-5 sm:p-4 rounded-xl flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mr-3">
                          <div className="text-white"><Wallet className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
                          {t('sinMinimoRetiro')}
                        </h3>
                      </div>
                      <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                        {t('retiraGananciasSegura')}
                      </p>
                    </div>

                    <div className="bg-[#101010] border border-white/10 p-5 sm:p-4 rounded-xl flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mr-3">
                          <div className="text-white"><Zap className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
                          {t('aprovechaFlastiAI')}
                        </h3>
                      </div>
                      <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                        {t('trabajaRapido')}
                      </p>
                    </div>

                    <div className="bg-[#101010] border border-white/10 p-5 sm:p-4 rounded-xl flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mr-3">
                          <div className="text-white"><DollarSign className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
                          {t('microtrabajosEnLinea')}
                        </h3>
                      </div>
                      <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                        {t('generaIngresosTareas')}
                      </p>
                    </div>

                    <div className="bg-[#101010] border border-white/10 p-5 sm:p-4 rounded-xl flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mr-3">
                          <div className="text-white"><HeadphonesIcon className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
                          {t('soporte24_7')}
                        </h3>
                      </div>
                      <p className="text-foreground/70 text-xs pl-11">
                        {t('equipoListoAyudarte')}
                      </p>
                    </div>
                  </div> {/* cierre de grid de bloques internos */}
                </div> {/* cierre de .relative.z-10 */}
              </div> {/* cierre de .bg-[#232323]... */}
            </div> {/* cierre de .p-0.rounded-2xl */}
          </div> {/* cierre de .rounded-2xl */}
        </div> {/* cierre de .max-w-5xl.mx-auto */}
      </div> {/* cierre de .container-custom.relative.z-10 */}
    </section>
  );
});

export default DashboardPreviewSection;
