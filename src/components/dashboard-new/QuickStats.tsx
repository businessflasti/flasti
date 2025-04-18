"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface StatsData {
  totalClicks: number;
  totalSales: number;
  conversionRate: number;
  lastActivity: string;
}

export default function QuickStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalClicks: 0,
    totalSales: 0,
    conversionRate: 0,
    lastActivity: '---'
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Cargar datos del usuario
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      setLoading(true);

      try {
        // Simular carga de datos (en producción, esto se conectaría a Supabase)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Usar valores predeterminados en cero para nuevos usuarios
        setStats({
          totalClicks: 0,
          totalSales: 0,
          conversionRate: 0,
          lastActivity: '---'
        });

        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Configurar actualización periódica
    const interval = setInterval(loadStats, 300000); // Actualizar cada 5 minutos

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 hardware-accelerated">
      {/* Total de Clics */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Total de Clics</h3>
          <div className="w-8 h-8 rounded-full bg-[#9333ea]/10 flex items-center justify-center hardware-accelerated">
            <TrendingUp size={16} className="text-[#9333ea]" />
          </div>
        </div>

        {loading ? (
          <div className="h-6 w-24 bg-foreground/10 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-end gap-1 animate-countUp">
            <span className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</span>
          </div>
        )}

        <div className="mt-2 text-xs text-foreground/60">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
      </Card>

      {/* Comisiones Totales */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Comisiones Totales</h3>
          <div className="w-8 h-8 rounded-full bg-[#ec4899]/10 flex items-center justify-center hardware-accelerated">
            <DollarSign size={16} className="text-[#ec4899]" />
          </div>
        </div>

        {loading ? (
          <div className="h-6 w-24 bg-foreground/10 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-end gap-1 animate-countUp">
            <span className="text-2xl font-bold">{stats.totalSales}</span>
          </div>
        )}

        <div className="mt-2 text-xs text-foreground/60">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
      </Card>

      {/* Tasa de Conversión */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Tasa de Conversión</h3>
          <div className="w-8 h-8 rounded-full bg-[#facc15]/10 flex items-center justify-center hardware-accelerated">
            <Users size={16} className="text-[#facc15]" />
          </div>
        </div>

        {loading ? (
          <div className="h-6 w-24 bg-foreground/10 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-end gap-1 animate-countUp">
            <span className="text-2xl font-bold">{stats.conversionRate.toFixed(2)}%</span>
          </div>
        )}

        <div className="mt-2 text-xs text-foreground/60">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
      </Card>

      {/* Última Actividad */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-400">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Última Actividad</h3>
          <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hardware-accelerated">
            <Clock size={16} className="text-[#3b82f6]" />
          </div>
        </div>

        {loading ? (
          <div className="h-6 w-24 bg-foreground/10 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-end gap-1 animate-countUp">
            <span className="text-2xl font-bold">{stats.lastActivity}</span>
          </div>
        )}

        <div className="mt-2 text-xs text-foreground/60">
          Última actividad: {stats.lastActivity}
        </div>
      </Card>
    </div>
  );
}
