"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Database, Globe, LineChart, Lock, Pencil, Scale, Tv, Users, Cpu, Brain, Zap, Network } from "lucide-react";

// Schools data
const schools = [
  {
    id: 1,
    name: "Data Science & IA Avanzada",
    icon: <Brain className="text-[#d4386c]" size={24} />,
    href: "/escuela/datos",
  },
  {
    id: 2,
    name: "Ciberseguridad Cuántica",
    icon: <Lock className="text-[#3359b6]" size={24} />,
    href: "/escuela/ciberseguridad",
  },
  {
    id: 3,
    name: "Liderazgo Digital",
    icon: <Users className="text-[#d4386c]" size={24} />,
    href: "/escuela/liderazgo-management",
  },
  {
    id: 4,
    name: "Comunicación Global",
    icon: <Globe className="text-[#3359b6]" size={24} />,
    href: "/escuela/ingles",
  },
  {
    id: 5,
    name: "Desarrollo Web 3.0",
    icon: <Code className="text-[#d4386c]" size={24} />,
    href: "/escuela/web",
  },
  {
    id: 6,
    name: "Marketing Inmersivo",
    icon: <LineChart className="text-[#3359b6]" size={24} />,
    href: "/escuela/marketing",
  },
  {
    id: 7,
    name: "Diseño de Productos",
    icon: <Pencil className="text-[#9333ea]" size={24} />,
    href: "/escuela/producto",
  },
  {
    id: 8,
    name: "Transformación Digital",
    icon: <Zap className="text-[#d4386c]" size={24} />,
    href: "/escuela/transformacion-digital-business",
  },
];
//
const SchoolsGrid = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-px top-24 bg-gradient-to-r from-transparent via-[#ec4899]/30 to-transparent"></div>
        <div className="absolute right-0 top-1/4 h-40 w-px bg-gradient-to-b from-transparent via-[#facc15]/30 to-transparent"></div>
        <div className="absolute left-0 bottom-1/4 h-40 w-px bg-gradient-to-b from-transparent via-[#d4386c]/30 to-transparent"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-10">
          <span className="text-xs text-[#ec4899] uppercase tracking-wider font-medium mb-2 inline-block">Especialidades</span>
          <h2 className="text-2xl font-bold text-gradient">Escuelas de Flow State</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schools.map((school) => (
            <Link href={school.href} key={school.id}>
              <Card className="glass-card hover:neon-border transition-all duration-300 group overflow-hidden">
                <div className="p-5 flex items-center gap-4 hardware-accelerated">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#d4386c]/10 group-hover:bg-[#d4386c]/20 transition-colors">
                    {school.icon}
                  </div>
                  <span className="flex-1 font-medium text-sm group-hover:text-gradient transition-all duration-300">{school.name}</span>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#9333ea]/30 to-transparent group-hover:via-[#f97316]/60 transition-colors"></div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/escuelas"
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full border border-[#ec4899]/20 hover:border-[#ec4899]/50 transition-colors bg-card/30 text-[#ec4899]"
          >
            Ver todas las escuelas <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SchoolsGrid;
