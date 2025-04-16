"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Activity, DollarSign, MousePointer, User, Clock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  type: 'click' | 'sale' | 'commission' | 'level_up';
  description: string;
  amount?: number;
  timestamp: Date;
}

export default function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales de actividad
  useEffect(() => {
    if (!user) return;

    const loadActivities = async () => {
      setLoading(true);

      try {
        // Obtener clics recientes
        const { data: clicksData, error: clicksError } = await supabase
          .from('affiliate_visits')
          .select('id, created_at, app_id')
          .eq('affiliate_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (clicksError) throw clicksError;

        // Obtener ventas recientes
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('id, created_at, app_id, amount, commission')
          .eq('affiliate_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (salesError) throw salesError;

        // Obtener información de las apps
        const appIds = [...new Set([
          ...(clicksData?.map(c => c.app_id) || []),
          ...(salesData?.map(s => s.app_id) || [])
        ])];

        const { data: appsData, error: appsError } = await supabase
          .from('apps')
          .select('id, name')
          .in('id', appIds.length > 0 ? appIds : [0]);

        if (appsError) throw appsError;

        // Crear un mapa de apps para referencia rápida
        const appsMap = (appsData || []).reduce((map, app) => {
          map[app.id] = app.name;
          return map;
        }, {} as Record<number, string>);

        // Convertir clics a items de actividad
        const clickActivities: ActivityItem[] = (clicksData || []).map(click => ({
          id: `click-${click.id}`,
          type: 'click',
          description: `Nuevo clic en tu enlace de ${appsMap[click.app_id] || `App ${click.app_id}`}`,
          timestamp: new Date(click.created_at)
        }));

        // Convertir ventas a items de actividad
        const saleActivities: ActivityItem[] = (salesData || []).map(sale => ({
          id: `sale-${sale.id}`,
          type: 'sale',
          description: `Nueva venta de ${appsMap[sale.app_id] || `App ${sale.app_id}`}`,
          amount: sale.amount,
          timestamp: new Date(sale.created_at)
        }));

        // Convertir comisiones a items de actividad
        const commissionActivities: ActivityItem[] = (salesData || []).map(sale => ({
          id: `commission-${sale.id}`,
          type: 'commission',
          description: `Comisión recibida por venta de ${appsMap[sale.app_id] || `App ${sale.app_id}`}`,
          amount: sale.commission,
          timestamp: new Date(sale.created_at)
        }));

        // Combinar todas las actividades y ordenar por fecha
        const allActivities = [
          ...clickActivities,
          ...saleActivities,
          ...commissionActivities
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10); // Limitar a 10 actividades

        setActivities(allActivities);
      } catch (error) {
        console.error('Error al cargar actividades:', error);
        toast.error('Error al cargar actividades recientes');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();

    // Configurar actualización periódica
    const interval = setInterval(loadActivities, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [user]);

  // Función para formatear tiempo relativo
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seg`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
    return `${Math.floor(diffInSeconds / 86400)} d`;
  };

  // Función para obtener icono según tipo de actividad
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'click':
        return <MousePointer size={16} className="text-[#9333ea]" />;
      case 'sale':
        return <DollarSign size={16} className="text-[#ec4899]" />;
      case 'commission':
        return <DollarSign size={16} className="text-[#facc15]" />;
      case 'level_up':
        return <User size={16} className="text-[#3b82f6]" />;
      default:
        return <Activity size={16} className="text-primary" />;
    }
  };

  return (
    <Card className="glass-effect p-6 animate-fadeInUp delay-500 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Actividad Reciente</h3>
        <div className="flex items-center gap-1 text-xs text-foreground/60">
          <Clock size={14} />
          <span>Tiempo real</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-foreground/10 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-1/4 bg-foreground/10 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className={`flex gap-3 items-start animate-fadeInUp delay-${index * 100}`}>
              <div className={`w-8 h-8 rounded-full bg-${activity.type === 'click' ? '[#9333ea]' : activity.type === 'sale' ? '[#ec4899]' : activity.type === 'commission' ? '[#facc15]' : '[#3b82f6]'}/10 flex items-center justify-center mt-0.5`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                {activity.amount && (
                  <p className="text-sm font-semibold text-green-400">+${activity.amount.toFixed(2)} USD</p>
                )}
                <p className="text-xs text-foreground/60 mt-1">{formatRelativeTime(activity.timestamp)} atrás</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border/20">
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          Ver todo el historial →
        </button>
      </div>
    </Card>
  );
}
