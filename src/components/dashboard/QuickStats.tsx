"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AffiliateServiceEnhanced } from '@/lib/affiliate-service-enhanced';
import { toast } from 'sonner';

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
  const [userLocale, setUserLocale] = useState<string>('default');

  // Detectar la configuración regional del usuario
  useEffect(() => {
    // Intentar obtener la configuración regional del navegador
    try {
      const detectedLocale = navigator.language || 'default';
      setUserLocale(detectedLocale);
    } catch (error) {
      console.warn('No se pudo detectar la configuración regional:', error);
      setUserLocale('default');
    }
  }, []);

  // Cargar datos reales del usuario
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      setLoading(true);

      try {
        // Usar valores predeterminados en cero para evitar errores
        setStats({
          totalClicks: 0,
          totalSales: 0,
          conversionRate: 0,
          lastActivity: '---'
        });

        // Intentar cargar datos reales solo si están disponibles
        try {
          // Verificar si las tablas existen antes de consultar
          const { data: tableInfo, error: tableError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .in('table_name', ['affiliate_visits', 'sales'])
            .limit(2);

          // Si hay un error o no existen las tablas, mantener valores en cero
          if (tableError || !tableInfo || tableInfo.length < 2) {
            console.warn('Las tablas de estadísticas no existen o no están disponibles');
            setLastUpdate(new Date());
            return;
          }

          // Obtener datos de clics
          const { data: clicksData, error: clicksError } = await supabase
            .from('affiliate_visits')
            .select('count')
            .eq('affiliate_id', user.id);

          // Obtener datos de ventas
          const { data: salesData, error: salesError } = await supabase
            .from('sales')
            .select('*')
            .eq('affiliate_id', user.id);

          // Obtener última actividad
          const { data: activityData, error: activityError } = await supabase
            .from('affiliate_visits')
            .select('created_at')
            .eq('affiliate_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          // Calcular estadísticas solo si no hay errores
          if (!clicksError && !salesError && !activityError) {
            const totalClicks = clicksData && Array.isArray(clicksData) ? clicksData.length : 0;
            const totalSales = salesData && Array.isArray(salesData) ? salesData.length : 0;
            const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;
            const lastActivity = activityData && Array.isArray(activityData) && activityData.length > 0
              ? new Date(activityData[0].created_at).toLocaleTimeString(userLocale, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })
              : '---';

            setStats({
              totalClicks,
              totalSales,
              conversionRate,
              lastActivity
            });
          }
        } catch (innerError) {
          console.error('Error al cargar datos específicos:', innerError);
          // Mantener los valores predeterminados en cero
        }

        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        // No mostrar toast para evitar spam de errores al usuario
        // En caso de error, mantener valores en cero
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Configurar actualización periódica de datos reales
    // Usar un intervalo más largo para reducir el consumo de recursos
    const interval = setInterval(loadStats, 300000); // Actualizar cada 5 minutos

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 hardware-accelerated">
      {/* Total de Clics */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Total de Clics</h3>
          <div className="w-8 h-8 rounded-full bg-[#9333ea]/10 flex items-center justify-center hardware-accelerated animate-scale">
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
          Última actualización: {lastUpdate.toLocaleTimeString(userLocale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}
        </div>
      </Card>

      {/* Comisiones Totales */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Comisiones Totales</h3>
          <div className="w-8 h-8 rounded-full bg-[#ec4899]/10 flex items-center justify-center hardware-accelerated animate-scale">
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
          Última actualización: {lastUpdate.toLocaleTimeString(userLocale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}
        </div>
      </Card>

      {/* Tasa de Conversión */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Tasa de Conversión</h3>
          <div className="w-8 h-8 rounded-full bg-[#facc15]/10 flex items-center justify-center hardware-accelerated animate-scale">
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
          Última actualización: {lastUpdate.toLocaleTimeString(userLocale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}
        </div>
      </Card>

      {/* Última Actividad */}
      <Card className="glass-effect p-4 hover-lift animate-fadeInUp delay-400">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground/60 font-medium">Última Actividad</h3>
          <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hardware-accelerated animate-scale">
            <Clock size={16} className="text-[#3b82f6] animate-rotate-slow" />
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
          Última actividad: {stats.lastActivity !== '---' ? stats.lastActivity : 'Sin actividad'}
        </div>
      </Card>
    </div>
  );
}
