'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BackButton from "@/components/ui/back-button";

const AppsPage = () => {
  const { t } = useLanguage();
  const [copiedLinks, setCopiedLinks] = useState<{[key: number]: boolean}>({});

  const apps = [
    {
      id: 1,
      name: "Flasti Imágenes",
      icon: <Image className="text-[#ec4899]" size={24} />,
      description: "Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.",
      bgGradient: "from-[#ec4899]/20 to-[#f97316]/20",
      iconBg: "bg-[#ec4899]/10",
      iconColor: "text-[#ec4899]"
    },
    {
      id: 2,
      name: "Flasti AI",
      icon: <Sparkles className="text-[#9333ea]" size={24} />,
      description: "Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.",
      bgGradient: "from-[#9333ea]/20 to-[#ec4899]/20",
      iconBg: "bg-[#9333ea]/10",
      iconColor: "text-[#9333ea]"
    },
    {
      id: 3,
      name: "Coming soon...",
      icon: <Sparkles className="text-[#facc15] animate-[pulse_1.5s_ease-in-out_infinite]" size={24} />,
      description: "Una nueva herramienta revolucionaria está en desarrollo. Mantente atento para más información.",
      bgGradient: "from-[#facc15]/20 to-[#f97316]/20",
      iconBg: "bg-[#facc15]/10",
      iconColor: "text-[#facc15]",
      comingSoon: true
    },
  ];

  const handleCopyLink = (id: number) => {
    // En un caso real, aquí se generaría o copiaría el enlace real
    navigator.clipboard.writeText(`https://flasti.com/app/${id}/referral`);
    setCopiedLinks({...copiedLinks, [id]: true});
    
    // Resetear el estado después de 2 segundos
    setTimeout(() => {
      setCopiedLinks({...copiedLinks, [id]: false});
    }, 2000);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8">
      <BackButton />
      {/* Elementos decorativos futuristas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl"></div>
        <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
        <div className="absolute bottom-40 left-[15%] w-2 h-2 rounded-full bg-[#f97316] animate-ping"></div>
      </div>

      <div className="relative z-10 mt-20 sm:mt-24 md:mt-16">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Apps y Herramientas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {apps.map((app) => (
            <Card
              key={app.id}
              className={`glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${app.comingSoon ? 'opacity-70' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${app.iconBg}`}>
                    {app.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{app.name}</h3>
                </div>
                <p className="text-sm text-foreground/70 mb-6">{app.description}</p>
                <div className="flex justify-between items-center">
                  {!app.comingSoon ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open(`/app/${app.id}`, '_blank')}
                      >
                        <ExternalLink size={14} />
                        Abrir App
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 ${app.iconColor}`}
                        onClick={() => handleCopyLink(app.id)}
                      >
                        {copiedLinks[app.id] ? <Check size={14} /> : <Copy size={14} />}
                        {copiedLinks[app.id] ? 'Copiado' : 'Copiar Link'}
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-foreground/60">Próximamente disponible</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppsPage;