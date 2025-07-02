"use client";

import { DollarSign, Wallet, Zap, HeadphonesIcon, ArrowUpRight, Landmark } from "lucide-react";
import PayPalIcon from "@/components/icons/PayPalIcon";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const DashboardPreviewSection = () => {
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
          <div className="rounded-xl">
            <div className="p-0 rounded-xl">
              <div className="bg-[#0a0a0a] backdrop-blur-md shadow-xl p-6 rounded-xl border border-white/10 overflow-hidden relative">
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
                          className="absolute top-4 right-4 sm:top-8 sm:right-8 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-xl z-30 animate-float scale-75 sm:scale-100"
                          style={{ animationDelay: '0.3s', animationDuration: '4s' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="bg-[#3C66CE] border border-white/10 p-2 sm:p-3 rounded-xl">
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
                          className="absolute bottom-4 right-4 sm:bottom-8 sm:right-1/4 sm:translate-y-1/4 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-xl z-30 animate-float scale-75 sm:scale-100"
                          style={{ animationDelay: '1s', animationDuration: '4.5s' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="bg-[#3C8841] border border-white/10 p-2 sm:p-3 rounded-xl">
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
                    <div className="inline-flex items-center gap-2 mb-4 bg-card/30 backdrop-blur-md shadow-xl border border-white/5 rounded-full px-4 py-2 dark:shadow-black/30 light:shadow-gray-400/30 hover:shadow-lg transition-shadow">
                      <span className="text-sm dark:text-foreground/80 text-foreground/90 font-medium">{t('metodosRetiroDisponibles')}</span>
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="bg-card/30 backdrop-blur-md shadow-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 hover:border-[#ec4899]/30 transition-all dark:shadow-black/30 light:shadow-gray-400/30 hover:shadow-lg hover:shadow-[#ec4899]/5">
                        <div className="w-6 h-6 rounded-full dark:bg-black/30 bg-gray-200 flex items-center justify-center">
                          <PayPalIcon className="h-4 w-4 dark:text-white text-gray-700 pl-0.5" />
                        </div>
                        <span className="text-sm font-medium">PayPal</span>
                      </div>

                      <div className="bg-card/30 backdrop-blur-md shadow-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 hover:border-[#ec4899]/30 transition-all dark:shadow-black/30 light:shadow-gray-400/30 hover:shadow-lg hover:shadow-[#ec4899]/5">
                        <div className="w-6 h-6 rounded-full dark:bg-black/30 bg-gray-200 flex items-center justify-center">
                          <Landmark className="h-3.5 w-3.5 dark:text-white text-gray-700" />
                        </div>
                        <span className="text-sm font-medium">{t('cuentaBancaria')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bloques de características */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card/30 backdrop-blur-md shadow-xl group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4386c]/5 to-transparent"></div>

                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-3">
                          <div className="text-white"><Wallet className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
                          {t('sinMinimoRetiro')}
                        </h3>
                      </div>

                      <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                        {t('retiraGananciasSegura')}
                      </p>

                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    </div>

                    <div className="bg-card/30 backdrop-blur-md shadow-xl group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4386c]/5 to-transparent"></div>

                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-3">
                          <div className="text-white"><Zap className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
                          {t('aprovechaFlastiAI')}
                        </h3>
                      </div>

                      <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                        {t('trabajaRapido')}
                      </p>

                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    </div>

                    <div className="bg-card/30 backdrop-blur-md shadow-xl group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4386c]/5 to-transparent"></div>

                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-3">
                          <div className="text-white"><DollarSign className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
                          {t('microtrabajosEnLinea')}
                        </h3>
                      </div>

                      <p className="text-foreground/70 text-sm sm:text-xs pl-11">
                        {t('generaIngresosTareas')}
                      </p>

                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    </div>

                    <div className="bg-card/30 backdrop-blur-md shadow-xl group overflow-hidden relative p-5 sm:p-4 rounded-lg">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4386c]/5 to-transparent"></div>

                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-3">
                          <div className="text-white"><HeadphonesIcon className="h-5 w-5" /></div>
                        </div>
                        <h3 className="text-base sm:text-sm font-bold text-white">
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
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
