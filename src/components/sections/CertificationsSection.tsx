"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Award, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const CertificationsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhMDQ1ZTkiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djNjMCAxLjEtLjkgMi0yIDJoLTR2MWg0YTIgMiAwIDAgMCAxLjktMS4zbDEuMS0zLjdBMyAzIDAgMCAwIDM0IDMyaC02djVoMXYtNGg1YTIgMiAwIDAgMSAyIDJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="absolute top-20 left-1/3 w-60 h-60 rounded-full bg-[#d4386c]/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-60 h-60 rounded-full bg-[#3359b6]/5 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16 relative">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/10 rounded-full blur-3xl"></span>
          <span className="text-xs uppercase tracking-wider text-primary font-medium">Soluciones de IA</span>
          <h2 className="text-3xl font-bold mt-2 text-gradient relative z-10 hardware-accelerated">Aplicaciones Especializadas</h2>
          <p className="text-foreground/70 mt-4 max-w-md mx-auto">
            Descubre cómo nuestra IA se adapta a diferentes sectores y necesidades empresariales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Certification Card 1 */}
          <Card className="glass-card overflow-hidden group relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4386c]/10 to-[#3359b6]/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4386c]/50 to-transparent"></div>

            <div className="p-8 relative z-10">
              <div className="w-10 h-10 rounded-3xl bg-[#d4386c]/10 flex items-center justify-center mb-5">
                <Award className="text-primary" size={20} />
              </div>

              <h3 className="font-bold text-lg mb-4">
                IA para Análisis de Datos y Predicciones
              </h3>

              <div className="flex justify-between items-center mt-8">
                <div className="w-24 h-12 relative">
                  <div className="w-full h-full relative">
                    <Image
                      src="https://ext.same-assets.com/1330808718/3568979742.png"
                      alt="Certificación Internacional"
                      fill
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>

                <Link
                  href="/escuela/ingles"
                  className="text-primary inline-flex items-center text-sm gap-1 font-medium group-hover:text-[#3359b6] transition-colors"
                >
                  Ver programa <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Certification Card 2 */}
          <Card className="glass-card overflow-hidden group relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4386c]/10 to-[#3359b6]/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4386c]/50 to-transparent"></div>

            <div className="p-8 relative z-10">
              <div className="w-10 h-10 rounded-3xl bg-[#d4386c]/10 flex items-center justify-center mb-5">
                <Sparkles className="text-primary" size={20} />
              </div>

              <h3 className="font-bold text-lg mb-4">
                Automatización de Procesos Empresariales
              </h3>

              <div className="flex justify-between items-center mt-8">
                <div className="w-24 h-12 relative">
                  <div className="w-full h-full relative">
                    <Image
                      src="https://ext.same-assets.com/1330808718/2153885248.png"
                      alt="Certificación Cloud"
                      fill
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>

                <Link
                  href="/ruta/google-cloud"
                  className="text-primary inline-flex items-center text-sm gap-1 font-medium group-hover:text-[#3359b6] transition-colors"
                >
                  Ver programa <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Certification Card 3 */}
          <Card className="glass-card overflow-hidden group relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4386c]/10 to-[#3359b6]/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4386c]/50 to-transparent"></div>

            <div className="p-8 relative z-10">
              <div className="w-10 h-10 rounded-3xl bg-[#d4386c]/10 flex items-center justify-center mb-5">
                <ShieldCheck className="text-primary" size={20} />
              </div>

              <h3 className="font-bold text-lg mb-4">
                IA para Atención al Cliente y Chatbots
              </h3>

              <div className="flex justify-between items-center mt-8">
                <div className="w-24 h-12 relative">
                  <div className="w-full h-full relative">
                    <Image
                      src="https://ext.same-assets.com/1330808718/3768643606.png"
                      alt="Certificación Seguridad"
                      fill
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>

                <Link
                  href="/escuela/ciberseguridad"
                  className="text-primary inline-flex items-center text-sm gap-1 font-medium group-hover:text-[#3359b6] transition-colors"
                >
                  Ver programa <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
