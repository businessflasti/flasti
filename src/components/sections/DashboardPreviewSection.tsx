"use client";

import { DollarSign, Wallet, Zap, HeadphonesIcon, ArrowUpRight, Landmark } from "lucide-react";
import PayPalIcon from "@/components/icons/PayPalIcon";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const DashboardPreviewSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#ec4899]/5 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black">
            {t('ingresaMundo')}
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('accedeArea')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-xl border border-white/10 overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#ec4899]/10 blur-3xl"></div>

            <div className="relative z-10">
              <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl">
                <div className="relative w-full rounded-lg overflow-hidden">
                  <div className="w-full relative">
                    <img
                      src="/images/dashboard/dash33.jpg"
                      alt="Vista previa del Dashboard de Flasti"
                      className="w-full h-auto max-w-full mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>

                  {/* Elementos flotantes sobre la imagen */}
                  <div className="absolute inset-0">
                    {/* Bloque flotante 1 - Estadísticas */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      className="absolute top-4 right-4 sm:top-8 sm:right-8 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-xl z-30 animate-float scale-75 sm:scale-100"
                      style={{ animationDelay: '0.3s', animationDuration: '4s' }}
                    >
                      <div className="bg-gradient-to-br from-[#9333ea]/90 to-[#9333ea]/70 border border-white/10 p-2 sm:p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
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
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                      className="absolute bottom-4 right-4 sm:bottom-8 sm:right-1/4 sm:translate-y-1/4 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-xl z-30 animate-float scale-75 sm:scale-100"
                      style={{ animationDelay: '1s', animationDuration: '4.5s' }}
                    >
                      <div className="bg-gradient-to-br from-[#facc15]/90 to-[#facc15]/70 border border-white/10 p-2 sm:p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
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

              {/* Métodos de retiro disponibles */}
              <div className="mb-8 flex flex-col items-center mt-8">
                <div className="inline-flex items-center gap-2 mb-4 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-2 shadow-md dark:shadow-black/30 light:shadow-gray-400/30 hover:shadow-lg transition-shadow">
                  <span className="text-sm dark:text-foreground/80 text-foreground/90 font-medium">{t('metodosRetiroDisponibles')}</span>
                  <ArrowUpRight className="h-4 w-4 dark:text-[#ec4899] text-[#9333ea]" />
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <div className="glass-card backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 hover:border-[#ec4899]/30 transition-all shadow-md dark:shadow-black/30 light:shadow-gray-400/30 hover:shadow-lg hover:shadow-[#ec4899]/5">
                    <div className="w-6 h-6 rounded-full dark:bg-black/30 bg-gray-200 flex items-center justify-center">
                      <PayPalIcon className="h-4 w-4 dark:text-white text-gray-700 pl-0.5" />
                    </div>
                    <span className="text-sm font-medium">PayPal</span>
                  </div>

                  <div className="glass-card backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 hover:border-[#ec4899]/30 transition-all shadow-md dark:shadow-black/30 light:shadow-gray-400/30 hover:shadow-lg hover:shadow-[#ec4899]/5">
                    <div className="w-6 h-6 rounded-full dark:bg-black/30 bg-gray-200 flex items-center justify-center">
                      <Landmark className="h-3.5 w-3.5 dark:text-white text-gray-700" />
                    </div>
                    <span className="text-sm font-medium">{t('cuentaBancaria')}</span>
                  </div>
                </div>
              </div>

              {/* Bloques de características */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#facc15]/20 to-[#9333ea]/20 flex items-center justify-center mr-3">
                      <div className="text-[#9333ea]"><Wallet className="h-5 w-5" /></div>
                    </div>
                    <h3 className="text-base sm:text-sm font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                      {t('sinMinimoRetiro')}
                    </h3>
                  </div>

                  <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                    {t('retiraGananciasSegura')}
                  </p>

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </div>

                <div className="glass-card group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ec4899]/20 to-[#f97316]/20 flex items-center justify-center mr-3">
                      <div className="text-[#f97316]"><Zap className="h-5 w-5" /></div>
                    </div>
                    <h3 className="text-base sm:text-sm font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                      {t('aprovechaFlastiAI')}
                    </h3>
                  </div>

                  <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                    {t('trabajaRapido')}
                  </p>

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </div>

                <div className="glass-card group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mr-3">
                      <div className="text-[#ec4899]"><DollarSign className="h-5 w-5" /></div>
                    </div>
                    <h3 className="text-base sm:text-sm font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                      {t('microtrabajosEnLinea')}
                    </h3>
                  </div>

                  <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                    {t('generaIngresosTareas')}
                  </p>

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </div>

                <div className="glass-card group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#06b6d4]/20 flex items-center justify-center mr-3">
                      <div className="text-[#06b6d4]"><HeadphonesIcon className="h-5 w-5" /></div>
                    </div>
                    <h3 className="text-base sm:text-sm font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                      {t('soporte24_7')}
                    </h3>
                  </div>

                  <p className="text-foreground/70 text-xs pl-11">
                    {t('equipoListoAyudarte')}
                  </p>

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
