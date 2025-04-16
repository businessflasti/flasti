'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BackButton from '@/components/ui/back-button';

const CoursesPage = () => {
  return (
    <main className="pt-28 pb-24 gradient-background relative overflow-hidden min-h-screen">
      <div className="container-custom relative z-10">
        <div className="absolute top-0 left-0 z-50 mt-4 ml-4">
          <BackButton className="bg-card/60 backdrop-blur-md border border-white/10 rounded-lg shadow-lg hover:bg-card/80 transition-colors px-4 py-2" />
        </div>
        <div className="text-center mb-8 relative z-10 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explora nuestros <span className="text-gradient">cursos</span>
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Desarrolla habilidades de tecnología con nuestros cursos interactivos y prácticos
          </p>
        </div>

        <div className="relative w-full max-w-xl mx-auto mb-12">
          <Input
            placeholder="Buscar cursos..."
            className="pl-10 py-6 h-auto bg-card/60 backdrop-blur-md border-white/10 rounded-lg shadow-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ec4899]" size={20} />
        </div>

        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl"></div>
          <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
          <div className="absolute bottom-40 left-[15%] w-2 h-2 rounded-full bg-[#f97316] animate-ping"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Curso Card 1 */}
          <Card className="glass-card p-6 group hover:scale-[1.02] transition-transform duration-200">
            <div className="relative w-full aspect-video rounded-lg mb-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea] to-[#ec4899] opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <code className="text-white text-xl font-mono">{'</>'}</code>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Desarrollo Web Full Stack</h3>
            <p className="text-foreground/70 text-sm mb-4">Aprende a crear aplicaciones web completas desde cero</p>
            <div className="flex items-center justify-between">
              <span className="text-accent font-medium">36 horas</span>
              <Button className="glow-effect bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white">
                Ver curso
              </Button>
            </div>
          </Card>

          {/* Curso Card 2 */}
          <Card className="glass-card p-6 group hover:scale-[1.02] transition-transform duration-200">
            <div className="relative w-full aspect-video rounded-lg mb-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f97316] to-[#facc15] opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <code className="text-white text-xl font-mono">{'{ }'}</code>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">JavaScript Avanzado</h3>
            <p className="text-foreground/70 text-sm mb-4">Domina los conceptos avanzados de JavaScript</p>
            <div className="flex items-center justify-between">
              <span className="text-accent font-medium">24 horas</span>
              <Button className="glow-effect bg-gradient-to-r from-[#f97316] to-[#facc15] text-white">
                Ver curso
              </Button>
            </div>
          </Card>

          {/* Curso Card 3 */}
          <Card className="glass-card p-6 group hover:scale-[1.02] transition-transform duration-200">
            <div className="relative w-full aspect-video rounded-lg mb-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ec4899] to-[#f97316] opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <code className="text-white text-xl font-mono">{'</ >'}</code>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">React y Next.js</h3>
            <p className="text-foreground/70 text-sm mb-4">Construye aplicaciones modernas con React</p>
            <div className="flex items-center justify-between">
              <span className="text-accent font-medium">30 horas</span>
              <Button className="glow-effect bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white">
                Ver curso
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CoursesPage;