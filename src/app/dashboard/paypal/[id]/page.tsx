import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

// Esta función se ejecuta en el servidor
export default function ProcessorDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header visible only in this page */}
      <header className="w-full py-4 border-b border-border/20 bg-card/70 backdrop-blur-md">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-primary font-bold text-xl">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="glow-effect">
                <path fillRule="evenodd" clipRule="evenodd" d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="url(#paint0_linear)" />
                <path d="M21.5253 15.535V10.3622H18.0229V15.535H13.9517V19.0425H18.0229V25.6486H21.5253V19.0425H25.5966V15.535H21.5253Z" fill="white" />
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9333ea" />
                    <stop offset="0.33" stopColor="#ec4899" />
                    <stop offset="0.66" stopColor="#f97316" />
                    <stop offset="1" stopColor="#facc15" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
            <h1 className="font-semibold text-xl hidden sm:block">Flow State</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white font-bold relative">
              U
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-background"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom mt-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href="/dashboard/withdrawals" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm mb-6">
            <ArrowLeft size={16} />
            <span>Volver a procesadores de pago</span>
          </Link>

          {/* Processor Detail */}
          <Card className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-4">
                {/* Logo placeholder */}
                <div className="w-full h-full bg-card/20 rounded flex items-center justify-center text-3xl font-bold">
                  {params.id.substring(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">{params.id.replace(/-/g, ' ').toUpperCase()}</h2>

                <p className="text-foreground/70 mb-6">
                  Seleccionaste el procesador de pago {params.id.replace(/-/g, ' ').toUpperCase()}. Este método de pago está disponible para redimir tus puntos en recompensas reales.
                </p>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <Button className="bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity px-8 py-6 h-auto">
                    Canjear recompensa
                  </Button>

                  <Link href="/dashboard/withdrawals">
                    <Button variant="outline" className="px-8 py-6 h-auto">
                      Elegir otro método
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-card/50 border border-border/20 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-4">Detalles del procesador</h3>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between border-b border-border/10 pb-4">
                <span className="text-foreground/60">ID del procesador</span>
                <span className="font-medium">{params.id}</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between border-b border-border/10 pb-4">
                <span className="text-foreground/60">Tarifa de procesamiento</span>
                <span className="font-medium text-[#10b981]">0%</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between border-b border-border/10 pb-4">
                <span className="text-foreground/60">Tiempo estimado de procesamiento</span>
                <span className="font-medium">1-3 días hábiles</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between">
                <span className="text-foreground/60">Puntos disponibles</span>
                <span className="font-medium text-primary">0 SB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
