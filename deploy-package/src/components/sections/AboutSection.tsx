"use client";

import { Shield, Layers, Crown, CheckCircle, BarChart3, Diamond } from "lucide-react";

const values = [
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Confianza",
    description: "Construimos relaciones basadas en la transparencia y la honestidad"
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Innovación",
    description: "Desarrollamos constantemente nuevas soluciones tecnológicas"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Seguridad",
    description: "Protegemos tus datos y transacciones con los más altos estándares"
  },
  {
    icon: <Crown className="h-6 w-6" />,
    title: "Crecimiento",
    description: "Impulsamos el desarrollo personal y profesional de nuestros usuarios"
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Resultados",
    description: "Nos enfocamos en generar beneficios reales y medibles"
  },
  {
    icon: <Diamond className="h-6 w-6" />,
    title: "Oportunidad",
    description: "Creamos posibilidades para todos, sin importar su experiencia previa"
  }
];

const AboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Elementos decorativos del fondo eliminados */}

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs text-primary uppercase tracking-wider font-medium mb-2 inline-block">Nuestra misión</span>
          <h2 className="text-3xl font-bold mb-4">
            Conoce a <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ec4899] to-[#9333ea]">Flasti</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-foreground/80 mb-6 text-center">
            En Flasti, estamos revolucionando la manera en que las personas generan ingresos en el mundo digital. Creemos que el poder de la inteligencia artificial no debería ser exclusivo de unos pocos, sino una herramienta al alcance de todos. Por eso, hemos creado una plataforma única que combina tecnología avanzada con accesibilidad, permitiendo que cualquier persona, sin importar su experiencia, pueda aprovechar el potencial ilimitado de la IA para generar ingresos desde su celular o computadora.
          </p>

          <p className="text-foreground/80 mb-6 text-center">
            Nacidos de la pasión por empoderar a las personas, hemos diseñado un ecosistema que simplifica el proceso, impulsa las oportunidades y maximiza las ganancias inteligentes. Nuestra visión no se limita a la tecnología, buscamos construir relaciones basadas en la confianza, brindar seguridad, ofrecer innovación y entregar resultados reales que impulsen el crecimiento personal y profesional de nuestros usuarios.
          </p>

          <p className="text-foreground/80 text-center">
            Flasti no es solo una empresa, es un movimiento global. Estamos comprometidos a marcar la diferencia, guiando a miles de personas en todo el mundo hacia resultados rápidos, un futuro próspero, conectado y lleno de oportunidades. El futuro está aquí. Únete a nosotros y forma parte de esta generación que está transformando la manera en que las personas generan ingresos en línea. No te quedes atrás, sé parte del cambio. ¡Te damos la bienvenida a Flasti!
          </p>
        </div>

        <div className="relative mb-16">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#9333ea]/50 via-[#ec4899]/50 to-transparent transform -translate-x-1/2"></div>

          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-md p-4 border border-white/10 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9333ea] to-[#ec4899] flex items-center justify-center">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="glass-card group overflow-hidden relative p-6 px-5 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 h-full"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mr-3 border border-white/10">
                    <div className="text-[#ec4899]">{value.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-gradient transition-all duration-300">
                    {value.title}
                  </h3>
                </div>

                <p className="text-foreground/70 text-sm pl-[52px] min-h-[40px] flex items-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
