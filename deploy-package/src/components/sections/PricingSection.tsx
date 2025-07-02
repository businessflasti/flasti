"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckIcon, Sparkles, Zap, Shield, Clock, HeadphonesIcon, Infinity, AlertTriangle, ChevronDown, ChevronUp, Lock, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoginAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="glass-card overflow-hidden relative rounded-xl border border-white/10 hover:border-[#3c66ce]/30 transition-all">
      <button
        className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center mr-3 border border-white/10">
            <div className="text-[#3c66ce]">
              <Lock className="h-4 w-4" />
            </div>
          </div>
          <span className="font-medium">{t('comoInicioSesion')}</span>
        </div>
        <div className="text-primary">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <div
        className={`px-6 pb-6 pt-0 text-foreground/70 text-sm transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="pt-2 border-t border-white/10 pl-8">
          {t('instruccionesInicioSesion')}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 59, seconds: 59 });
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 6, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <AlertTriangle className="text-[#ef4444] mr-2 h-5 w-5 animate-pulse" />
        <span className="text-sm font-medium">{t('ofertaTermina')}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-md border border-white/10 shadow-inner">
          <span className="text-xl font-mono font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-xl font-bold text-white">:</span>
        <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-md border border-white/10 shadow-inner">
          <span className="text-xl font-mono font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-xl font-bold text-white">:</span>
        <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-md border border-white/10 shadow-inner">
          <span className="text-xl font-mono font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Elementos decorativos del fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5ZDRlZGQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djNjMCAxLjEtLjkgMi0yIDJoLTJ2MWgyYTMgMyAwIDAgMCAzLTN2LTNoLTF6bS04LTRoMXYyaC0xVjMwem0tNCAxOGg0djFoLTR6TTQ2IDQyaDJ2MWgtMnYxaC0xdi0yaDF6bS0yIDRoM3YxaC0zeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/5 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs dark:text-primary text-black uppercase tracking-wider font-medium mb-2 inline-block">{t('registrateAhoraBtn')}</span>
          <h2 className="text-3xl font-bold text-gradient mb-3">{t('unicoPago')}</h2>
          <p className="text-foreground/70 max-w-lg mx-auto">
            {t('accedeComienza')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Single Plan */}
          <Card className="glass-card overflow-hidden relative group h-full border-primary/30 hover:border-primary/50 transition-colors">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 to-transparent"></div>

            <div className="absolute right-5 top-5">
              <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-xs font-medium py-1 px-3 rounded-full flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('pagoSeguroLabel')}
              </div>
            </div>

            <div className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center mr-4 border border-white/10">
                  <Sparkles className="text-[#3c66ce]" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-gradient transition-all duration-300">Flasti</h3>
                  <p className="text-foreground/70">
                    {t('accesoExclusivoPlataforma')}
                  </p>
                </div>
              </div>

              <div className="mb-8 bg-gradient-to-br from-[#9333ea]/10 to-[#3c66ce]/10 p-6 rounded-xl border border-white/10">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold">$10</span>
                  <span className="text-foreground/70 text-sm ml-2">USD</span>
                  <span className="ml-2 text-sm line-through text-foreground/50">$100</span>
                  <span className="ml-2 text-xs text-[#22c55e] font-medium bg-[#22c55e]/10 px-2 py-0.5 rounded-full">{t('descuento')}</span>
                </div>
                <p className="text-sm text-foreground/70">
                  {t('pagoUnico')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Zap className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('accesoInmediato')}</h4>
                      <p className="text-xs text-foreground/70">{t('comienzaGenerarIngresos')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Infinity className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('accesoPorVida')}</h4>
                      <p className="text-xs text-foreground/70">{t('sinLimitesRenovaciones')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Shield className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('garantia7Dias')}</h4>
                      <p className="text-xs text-foreground/70">{t('devolucion100')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <HeadphonesIcon className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('soporte24_7')}</h4>
                      <p className="text-xs text-foreground/70">{t('asistenciaPersonalizada')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Sparkles className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('suiteCompleta')}</h4>
                      <p className="text-xs text-foreground/70">{t('accesoFuncionesPremium')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Gift className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('actualizacionesGratuitas')}</h4>
                      <p className="text-xs text-foreground/70">{t('nuevasFuncionesSinCosto')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-medium">{t('loQueObtienes')}</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckIcon className="text-[#22c55e] flex-shrink-0 mt-1" size={16} />
                    <span>{t('accesoCompletoPlataforma')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckIcon className="text-[#22c55e] flex-shrink-0 mt-1" size={16} />
                    <span>{t('herramientasAutomatizacion')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckIcon className="text-[#22c55e] flex-shrink-0 mt-1" size={16} />
                    <span>{t('tutorialesGuias')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckIcon className="text-[#22c55e] flex-shrink-0 mt-1" size={16} />
                    <span>{t('accesoComunidad')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckIcon className="text-[#22c55e] flex-shrink-0 mt-1" size={16} />
                    <span>{t('actualizacionesSinCosto')}</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-[#ef4444]/20 to-[#f97316]/20 backdrop-blur-sm rounded-xl border border-[#ef4444]/30 shadow-lg shadow-[#ef4444]/5 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#ef4444]/10 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#f97316]/10 blur-2xl"></div>
                <div className="relative z-10">
                  <CountdownTimer />
                </div>
              </div>

              <div className="mb-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="p-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-[#ef4444] mr-2" />
                      <span className="text-white text-sm">{t('terminandoseRapidoDisponibles')}</span>
                    </div>
                    <span className="text-white text-sm font-bold">87%</span>
                  </div>
                  <div className="h-2 w-full bg-[#ef4444]/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ef4444] to-[#22c55e] rounded-full"
                      style={{
                        width: '87%',
                        maxWidth: '87%',
                        transition: 'none'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] border-0 shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2">
                {t('empiezaGanarMayus')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </Button>

              <div className="mt-4 mb-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="px-3 py-1.5 bg-[#22c55e]/20 rounded-full">
                    <span className="text-xs font-medium text-[#22c55e]">{t('pagoSeguroLabel2')}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {/* Versión escritorio */}
                  <div className="hidden sm:flex items-center justify-center gap-3 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-3.5 h-3.5" fill="#0070BA">
                          <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                    <span className="text-foreground/40">|</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        {[
                          "🇦🇷", // Argentina
                          "🇨🇴", // Colombia
                          "🇲🇽", // México
                          "🇪🇸", // España
                          "🇨🇱", // Chile
                        ].map((flag, index) => (
                          <span key={index} className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm">
                            <span className="text-[10px] font-bold">{flag}</span>
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium">{t('monedaLocal2')}</span>
                    </div>
                  </div>

                  {/* Versión móvil más elegante con iconos arriba y texto abajo */}
                  <div className="flex sm:hidden flex-col items-center gap-4 mb-2">
                    <div className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" fill="#0070BA">
                          <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">PayPal</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                      <div className="flex justify-center space-x-1 mb-1">
                        {[
                          "🇦🇷", // Argentina
                          "🇨🇴", // Colombia
                          "🇲🇽", // México
                          "🇪🇸", // España
                          "🇨🇱", // Chile
                        ].map((flag, index) => (
                            <span key={index} className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm">
                              <span className="text-[11px] font-bold">{flag}</span>
                            </span>
                          ))
                        }
                      </div>
                      <span className="text-sm font-medium">{t('monedaLocal2')}</span>
                    </div>
                  </div>

                  <p className="text-center text-xs text-foreground/70">
                    {t('pagoSeguroTarjeta')}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <LoginAccordion />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
