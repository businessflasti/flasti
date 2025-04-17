"use client";

import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Users, ShoppingCart, Clock, BarChart2 } from "lucide-react";
import BackButton from "@/components/ui/back-button";

export default function EstadisticasPage() {
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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Estadísticas de Afiliado</h1>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          {/* Ganancias Totales */}
          <Card className="glass-card p-3 sm:p-4 md:p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea]/5 to-[#ec4899]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Ganancias Totales</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">$2,845.00</h3>
                <div className="flex items-center text-[#10b981] text-xs sm:text-sm">
                  <ArrowUp size={14} className="mr-1" />
                  <span>12.5%</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#9333ea]/10 flex items-center justify-center">
                <DollarSign className="text-[#9333ea]" size={20} />
              </div>
            </div>
          </Card>

          {/* Ventas Totales */}
          <Card className="glass-card p-3 sm:p-4 md:p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#facc15]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Ventas Totales</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">156</h3>
                <div className="flex items-center text-[#10b981] text-xs sm:text-sm">
                  <ArrowUp size={14} className="mr-1" />
                  <span>8.2%</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                <ShoppingCart className="text-[#f97316]" size={20} />
              </div>
            </div>
          </Card>

          {/* Estudiantes Activos */}
          <Card className="glass-card p-3 sm:p-4 md:p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec4899]/5 to-[#f97316]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Estudiantes Activos</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">89</h3>
                <div className="flex items-center text-[#10b981] text-xs sm:text-sm">
                  <ArrowUp size={14} className="mr-1" />
                  <span>5.3%</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ec4899]/10 flex items-center justify-center">
                <Users className="text-[#ec4899]" size={20} />
              </div>
            </div>
          </Card>

          {/* Tiempo Promedio */}
          <Card className="glass-card p-3 sm:p-4 md:p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#facc15]/5 to-[#9333ea]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Tiempo Promedio</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">4.2h</h3>
                <div className="flex items-center text-[#ef4444] text-xs sm:text-sm">
                  <ArrowDown size={14} className="mr-1" />
                  <span>2.1%</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#facc15]/10 flex items-center justify-center">
                <Clock className="text-[#facc15]" size={20} />
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Tendencia de Ventas */}
          <Card className="glass-card p-3 sm:p-4 md:p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold">Tendencia de Ventas</h3>
              <TrendingUp size={18} className="text-[#9333ea]" />
            </div>
            <div className="h-[180px] sm:h-[220px] md:h-[300px] flex items-end justify-between gap-1 sm:gap-2">
              {/* Simulación de gráfico de barras */}
              {[65, 45, 75, 55, 85, 70, 90].map((height, index) => (
                <div key={index} className="relative w-full">
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full bg-gradient-to-t from-[#9333ea] to-[#ec4899] rounded-t-lg transition-all duration-300 hover:opacity-80"
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 sm:mt-3 md:mt-4 text-[10px] sm:text-xs md:text-sm text-foreground/60">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mié</span>
              <span>Jue</span>
              <span>Vie</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </Card>

          {/* Distribución de Cursos */}
          <Card className="glass-card p-3 sm:p-4 md:p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold">Distribución de Cursos</h3>
              <BarChart2 size={18} className="text-[#ec4899]" />
            </div>
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {[
                { curso: "Desarrollo Web", porcentaje: 35, color: "from-[#9333ea] to-[#ec4899]" },
                { curso: "JavaScript", porcentaje: 28, color: "from-[#f97316] to-[#facc15]" },
                { curso: "React", porcentaje: 22, color: "from-[#ec4899] to-[#f97316]" },
                { curso: "Python", porcentaje: 15, color: "from-[#facc15] to-[#9333ea]" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.curso}</span>
                    <span className="font-medium">{item.porcentaje}%</span>
                  </div>
                  <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}