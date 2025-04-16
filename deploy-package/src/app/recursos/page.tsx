"use client";

import { Card } from "@/components/ui/card";
import { Download, Image, Sparkles } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/ui/back-button";

const ResourcesPage = () => {
  const apps = [
    {
      id: 1,
      name: "Flasti Imagenes",
      icon: <Image className="text-[#ec4899]" size={24} />,
      resources: [
        { name: "Logo Kit", type: "SVG, PNG, AI", size: "2.4 MB" },
        { name: "Brand Guidelines", type: "PDF", size: "1.8 MB" },
        { name: "Marketing Assets", type: "ZIP", size: "5.2 MB" },
      ],
    },
    {
      id: 2,
      name: "Flasti AI",
      icon: <Sparkles className="text-[#9333ea]" size={24} />,
      resources: [
        { name: "Logo Package", type: "SVG, PNG, AI", size: "2.1 MB" },
        { name: "Style Guide", type: "PDF", size: "2.0 MB" },
        { name: "Promo Materials", type: "ZIP", size: "4.8 MB" },
      ],
    },
    {
      id: 3,
      name: "Coming soon...",
      icon: <Sparkles className="text-[#facc15] animate-[pulse_1.5s_ease-in-out_infinite]" size={24} />,
      resources: [
        { name: "⚡ En desarrollo", type: "...", size: "..." },
        { name: "🔨 Construyendo", type: "...", size: "..." },
        { name: "🚀 Próximamente", type: "...", size: "..." },
      ],
      className: "relative overflow-hidden animate-[appear_2s_ease-in-out_infinite]"
    },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8">
      <BackButton />
      {/* Elementos decorativos futuristas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#ec4899]/10 blur-3xl"></div>
        <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
        <div className="absolute bottom-40 left-[15%] w-2 h-2 rounded-full bg-[#9333ea] animate-ping"></div>
      </div>

      <div className="relative z-10 mt-20 sm:mt-24 md:mt-16">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Recursos y Materiales</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {apps.map((app) => (
            <Card
              key={app.id}
              className={`glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${app.className || ''}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#9333ea]/10">
                  {app.icon}
                </div>
                <h3 className="text-lg font-semibold">{app.name}</h3>
              </div>

              <div className="space-y-4">
                {app.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-sm text-foreground/60">{resource.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-foreground/60">{resource.size}</span>
                      <Download size={18} className="text-[#ec4899] hover:text-[#9333ea] transition-colors cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;