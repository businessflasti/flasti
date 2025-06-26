"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Teachers data
const teachers = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "IA Researcher & Lead Developer",
    image: "https://ext.same-assets.com/1330808718/2380069110.png",
    course: "Neural Networks & Deep Learning",
    courseUrl: "/cursos/python",
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "Quantum Computing Specialist",
    image: "https://ext.same-assets.com/1330808718/3975420034.png",
    course: "Quantum AI for Enterprise Solutions",
    courseUrl: "/cursos/chatgpt-empresas",
  },
  {
    id: 3,
    name: "Maya Patel",
    role: "Data Science Director",
    image: "https://ext.same-assets.com/1330808718/1593445754.png",
    course: "Advanced Predictive Analytics",
    courseUrl: "/cursos/db-sql",
  },
  {
    id: 4,
    name: "Julian Mercer",
    role: "Blockchain Architect",
    image: "https://ext.same-assets.com/1330808718/173221268.png",
    course: "Secure Distributed Systems",
    courseUrl: "/cursos/django",
  },
];

const TeachersSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Elementos decorativos futuristas */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-0"></div>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>

        {/* Cuadrícula sutil de puntos */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMC41IiBmaWxsPSJyZ2JhKDE2MSwgMTAyLCAyNTUsIDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs text-primary uppercase tracking-wider font-medium mb-2 inline-block">Expertos en tecnología</span>
          <h2 className="text-3xl font-bold text-gradient mb-4 hardware-accelerated">
            Instructores de <span className="relative inline-block px-1">
              Flow State
              <div className="absolute bottom-1 left-0 w-full h-px bg-gradient-to-r from-primary to-accent opacity-50"></div>
            </span>
          </h2>
          <p className="text-foreground/70 max-w-lg mx-auto">
            Aprende de profesionales que están definiendo el futuro tecnológico y trabajan en las empresas más innovadoras
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <Link href={teacher.courseUrl} key={teacher.id}>
              <Card className="glass-card group overflow-hidden h-full">
                <div className="aspect-square w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4386c]/20 to-[#3359b6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Elementos futuristas decorativos */}
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-card to-transparent z-20"></div>
                  <div className="absolute bottom-3 right-3 z-30">
                    <div className="w-6 h-6 rounded-full bg-[#d4386c]/20 backdrop-blur-sm border border-[#d4386c]/40 flex items-center justify-center">
                      <Sparkles className="text-[#d4386c]" size={12} />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg group-hover:text-gradient transition-all duration-300">{teacher.name}</h3>
                  <p className="text-sm text-foreground/70 mb-4">{teacher.role}</p>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center text-primary gap-2 text-sm">
                    <div className="w-8 h-1 bg-gradient-to-r from-primary/80 to-accent/80 rounded-full"></div>
                    <span className="font-medium flex-1 group-hover:text-accent transition-colors">{teacher.course}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
