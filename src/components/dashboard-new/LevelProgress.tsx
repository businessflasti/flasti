"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, Star, Crown, ArrowRight, Check } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export default function LevelProgress() {
  const { profile } = useAuth();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);

      // Si no hay perfil, mantener el estado de carga
      if (!profile) {
        return;
      }

      // Calcular progreso usando datos reales del usuario
      const currentLevel = profile.level || 1;
      const currentBalance = profile.balance || 0;
      
      // Determinar el siguiente umbral basado en el nivel actual
      let nextThreshold = 0;
      if (currentLevel === 1) {
        nextThreshold = 20;
      } else if (currentLevel === 2) {
        nextThreshold = 30;
      } else {
        // Ya está en el nivel máximo
        setProgress(100);
        setLoading(false);
        return;
      }

      // Calcular el umbral anterior basado en el nivel actual
      const prevThreshold = currentLevel === 1 ? 0 : 20;

      // Calcular el progreso como porcentaje entre el umbral anterior y el siguiente
      const levelProgress = Math.min(100, Math.max(0,
        ((currentBalance - prevThreshold) / (nextThreshold - prevThreshold)) * 100
      ));

      // Establecer el progreso
      setProgress(levelProgress);
    } catch (error) {
      console.error('Error al calcular el progreso de nivel:', error);
      // En caso de error, establecer un valor predeterminado
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Datos de niveles
  const levels = [
    {
      name: "Nivel Inicial",
      level: 1,
      icon: <Trophy className="text-[#facc15]" size={24} />,
      color: "#facc15",
      commission: "50%",
      threshold: "$0 USD",
      benefits: ["Comisión del 50%", "Acceso a todas las aplicaciones", "Soporte básico"]
    },
    {
      name: "Nivel Intermedio",
      level: 2,
      icon: <Star className="text-[#9333ea]" size={24} />,
      color: "#9333ea",
      commission: "60%",
      threshold: "$20 USD",
      benefits: ["Comisión del 60%", "Prioridad en soporte", "Materiales promocionales exclusivos"]
    },
    {
      name: "Nivel Experto",
      level: 3,
      icon: <Crown className="text-[#ec4899]" size={24} />,
      color: "#ec4899",
      commission: "70%",
      threshold: "$30 USD",
      benefits: ["Comisión del 70%", "Soporte prioritario 24/7", "Acceso anticipado a nuevos productos"]
    }
  ];

  // Obtener nivel actual
  const currentLevel = levels.find(l => l.level === (profile?.level || 1)) || levels[0];
  const nextLevel = levels.find(l => l.level === (profile?.level || 1) + 1);

  return (
    <Card className="glass-effect p-6 relative overflow-hidden hardware-accelerated">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Tu Progreso de Nivel</h3>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hardware-accelerated">
            <span>Nivel {profile?.level || 1}</span>
            {currentLevel.icon}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-16 bg-foreground/10 rounded mb-4"></div>
            <div className="h-4 w-full bg-foreground/10 rounded mb-2"></div>
            <div className="h-20 bg-foreground/10 rounded"></div>
          </div>
        ) : (
          <>
            {/* Tarjeta de nivel actual */}
            <div className="mb-6 gradient-border hardware-accelerated">
              <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl hardware-accelerated">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[${currentLevel.color}]/10 hardware-accelerated`}>
                    {currentLevel.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentLevel.name}</h3>
                    <p className="text-sm text-foreground/70">Nivel {currentLevel.level}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentLevel.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            {profile?.level !== 3 && nextLevel && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">Progreso hacia Nivel {nextLevel.level}</span>
                  <span className="text-sm font-medium">{Math.min(100, Math.round(progress))}%</span>
                </div>
                <div className="h-3 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] hardware-accelerated"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-foreground/60">
                  <span>Balance actual: ${profile?.balance || '0.00'} USD</span>
                  <span>Objetivo: {nextLevel.threshold}</span>
                </div>
              </div>
            )}

            {/* Próximo nivel */}
            {profile?.level !== 3 && nextLevel && (
              <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 hover-lift hardware-accelerated">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[${nextLevel.color}]/10 hardware-accelerated`}>
                    {nextLevel.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{nextLevel.name}</h3>
                    <p className="text-sm text-foreground/70">Próximo nivel</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm mb-2">
                  <ArrowRight size={16} />
                  <span>Comisión del {nextLevel.commission}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight size={16} />
                  <span>Alcanza {nextLevel.threshold} en balance</span>
                </div>
              </div>
            )}

            {/* Mensaje para nivel máximo */}
            {profile?.level === 3 && (
              <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 text-center hardware-accelerated">
                <Crown size={40} className="text-[#ec4899] mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">¡Nivel Máximo Alcanzado!</h3>
                <p className="text-foreground/70">
                  Felicidades, has alcanzado el nivel más alto. Disfruta de todos los beneficios exclusivos.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
