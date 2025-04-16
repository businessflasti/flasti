"use client";

import { Card } from "@/components/ui/card";
import { CreditCard, DollarSign, Shield, Clock, CheckCircle, Lightbulb, Lock, Target, Rocket, TrendingUp, Wallet } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    iconColor: "text-blue-500",
    gradientFrom: "from-[#9333ea]/20",
    gradientTo: "to-[#ec4899]/20",
    title: "Sin mínimo de retiro",
    description: "Retira tus ganancias sin importar la cantidad acumulada"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    iconColor: "text-orange-500",
    gradientFrom: "from-[#ec4899]/20",
    gradientTo: "to-[#f97316]/20",
    title: "Retiros todos los días",
    description: "Accede a tus ganancias cuando lo necesites, sin esperas"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    iconColor: "text-purple-500",
    gradientFrom: "from-[#facc15]/20",
    gradientTo: "to-[#9333ea]/20",
    title: "Transferencias seguras",
    description: "Tus pagos están protegidos con los más altos estándares de seguridad"
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    iconColor: "text-[#22c55e]",
    gradientFrom: "from-[#06b6d4]/20",
    gradientTo: "to-[#22c55e]/20",
    title: "Proceso sencillo",
    description: "Retira tus ganancias en pocos clics, sin complicaciones"
  }
];

const PaymentInfoSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-xl border border-white/10 overflow-hidden relative h-full flex flex-col justify-between">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#ec4899]/10 blur-3xl"></div>

            <div className="relative z-10">
              <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl p-8 text-center mb-6">
                <div className="text-4xl font-bold font-outfit mb-6 text-white dark:text-white light:text-black">Conoce a <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ec4899] to-[#9333ea]">Flasti</span></div>
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                  Nacidos de la pasión por empoderar a las personas, diseñamos un ecosistema inteligente que
                  simplifica procesos, potencia oportunidades y optimiza la generación de ingresos.
                </p>
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mt-4">
                  Nuestra visión va más allá de la tecnología: construimos relaciones sostenibles basadas en
                  la confianza, la seguridad y la innovación constante, generando resultados tangibles para
                  nuestros usuarios.
                </p>
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mt-4">
                  Flasti no es solo una empresa, es una plataforma global en crecimiento
                  que impulsa a miles de personas hacia un futuro próspero, conectado y lleno de oportunidades.
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mt-4">
                <div className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 md:mb-3 border border-white/10">
                    <Shield className="text-red-500 h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold font-outfit mb-1 text-white dark:text-white light:text-black">Confianza</h3>
                  <p className="text-foreground/70 text-xs">Relaciones basadas en transparencia</p>
                </div>
                <div className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 md:mb-3 border border-white/10">
                    <Lightbulb className="text-yellow-500 h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold font-outfit mb-1 text-white dark:text-white light:text-black">Innovación</h3>
                  <p className="text-foreground/70 text-xs">Mejora constante de la plataforma</p>
                </div>
                <div className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 md:mb-3 border border-white/10">
                    <Lock className="text-green-500 h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold font-outfit mb-1 text-white dark:text-white light:text-black">Seguridad</h3>
                  <p className="text-foreground/70 text-xs">Protección de datos e ingresos</p>
                </div>
                <div className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 md:mb-3 border border-white/10">
                    <TrendingUp className="text-blue-500 h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold font-outfit mb-1 text-white dark:text-white light:text-black">Crecimiento</h3>
                  <p className="text-foreground/70 text-xs">Plataforma global en expansión</p>
                </div>
                <div className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 md:mb-3 border border-white/10">
                    <Target className="text-purple-500 h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold font-outfit mb-1 text-white dark:text-white light:text-black">Resultados</h3>
                  <p className="text-foreground/70 text-xs">Beneficios tangibles para usuarios</p>
                </div>
                <div className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 md:mb-3 border border-white/10">
                    <Rocket className="text-orange-500 h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold font-outfit mb-1 text-white dark:text-white light:text-black">Oportunidad</h3>
                  <p className="text-foreground/70 text-xs">Futuro próspero y conectado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentInfoSection;
