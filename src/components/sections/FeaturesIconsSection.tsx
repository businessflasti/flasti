"use client";

import { DollarSign, Clock, Laptop, Sparkles } from "lucide-react";

const features = [
  {
    icon: <DollarSign className="h-6 w-6 text-white" />,
    title: "Gana dinero real",
    description: "Genera ingresos todos los días completando tareas sencillas"
  },
  {
    icon: <Clock className="h-6 w-6 text-white" />,
    title: "Horario flexible",
    description: "Trabaja en el momento que prefieras, sin horarios fijos"
  },
  {
    icon: <Laptop className="h-6 w-6 text-white" />,
    title: "Desde tu casa",
    description: "Completa microtrabajos desde la comodidad de tu hogar"
  },
  {
    icon: <Sparkles className="h-6 w-6 text-white" />,
    title: "Sin experiencia previa",
    description: "No necesitas conocimientos técnicos para comenzar"
  }
];

const FeaturesIconsSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#d4386c]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#3359b6]/5 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cómo funciona Flasti</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Genera ingresos extra completando tareas sencillas con la ayuda de nuestra inteligencia artificial
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card group p-6 rounded-xl border border-white/10 hover:border-[#d4386c]/30 transition-all hover:shadow-lg hover:shadow-[#d4386c]/5"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#d4386c] to-[#3359b6] flex items-center justify-center mb-4">
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-foreground/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesIconsSection;
