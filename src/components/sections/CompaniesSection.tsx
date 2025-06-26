"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const CompaniesSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/50 backdrop-blur-md z-0"></div>

      {/* Elementos decorativos futuristas */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3359b6]/40 to-transparent"></div>
      <div className="absolute -right-20 top-1/4 w-40 h-40 rounded-full bg-[#d4386c]/5 blur-3xl"></div>
      <div className="absolute -left-20 bottom-1/4 w-40 h-40 rounded-full bg-accent/5 blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {/* Logos de empresa con efectos de resplandor */}
          <div className="h-8 w-32 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-sm -z-10 rounded-lg"></div>
            <Image 
              src="https://ext.same-assets.com/1330808718/2761605665.svg"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-8 w-32 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-sm -z-10 rounded-lg"></div>
            <Image 
              src="https://ext.same-assets.com/1330808718/616339271.svg"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-8 w-32 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-sm -z-10 rounded-lg"></div>
            <Image 
              src="https://ext.same-assets.com/1330808718/1617786510.svg"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-8 w-32 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-sm -z-10 rounded-lg"></div>
            <Image 
              src="https://ext.same-assets.com/1330808718/1416560932.svg"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-8 w-32 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-sm -z-10 rounded-lg"></div>
            <Image 
              src="https://ext.same-assets.com/1330808718/997317226.svg"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          <span className="text-gradient">Más de 3000</span> empresas transforman sus equipos con Flow State
        </h2>

        <div className="flex justify-center mb-16">
          <Button className="bg-transparent border border-primary text-primary hover:bg-primary/5 glow-effect">
            Agenda una demo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="glass-card p-8 rounded-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-6">
              Somos la <span className="text-gradient">autoridad</span> en innovación digital en América Latina
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <span className="text-foreground/90 font-medium">Aprendizaje acelerado</span>
                  <p className="text-sm text-foreground/70 mt-1">Adquiere nuevas habilidades en sesiones breves e intensivas</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <span className="text-foreground/90 font-medium">Rutas personalizadas</span>
                  <p className="text-sm text-foreground/70 mt-1">Avanza desde principiante hasta experto con itinerarios adaptativos</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <span className="text-foreground/90 font-medium">IA Asistencial</span>
                  <p className="text-sm text-foreground/70 mt-1">Asistente de inteligencia artificial que resuelve tus dudas al instante</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="md:justify-self-end">
            <div className="relative aspect-[9/16] w-full max-w-[280px] md:max-w-[320px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-accent/20 rounded-3xl -z-10 blur-xl"></div>
              <Image
                src="https://ext.same-assets.com/1330808718/1983974153.png"
                alt="Flow State Mobile App"
                fill
                className="object-contain z-10"
              />

              {/* Elementos decorativos alrededor de la imagen del móvil */}
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent/80 blur-sm"></div>
              <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-primary/80 blur-sm"></div>
              <div className="absolute top-1/3 right-0 transform translate-x-1/2 w-2 h-10 bg-gradient-to-b from-primary/80 to-accent/80 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
