'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import BackButton from '@/components/ui/back-button';
import { AffiliateServiceEnhanced, AffiliateStats } from '@/lib/affiliate-service-enhanced';

const affiliateService = AffiliateServiceEnhanced.getInstance();

// Usamos la interfaz AffiliateStats importada de affiliate-service-enhanced

export default function StatsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AffiliateStats>({
    totalClicks: 0,
    totalSales: 0,
    totalCommission: 0,
    linkStats: [],
    dailyStats: []
  });
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      loadStats(user.id);
    }
  }, [user, timeRange]);

  const loadStats = async (userId: string) => {
    setLoading(true);
    try {
      // Obtener estadísticas de afiliado usando el servicio mejorado
      const statsData = await affiliateService.getAffiliateStats(userId, timeRange);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <BackButton />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('Estadísticas')}</h1>
            <p className="text-foreground/70 mt-1">
              {t('Analiza el rendimiento de tus enlaces de afiliado')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Semana
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Mes
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Año
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin text-primary mb-2">⟳</div>
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {/* Resumen de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border border-border/50 bg-card/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-foreground/70">Total de clics</div>
                    <div className="text-2xl font-bold mt-1">{stats.totalClicks}</div>
                  </div>
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <TrendingUp className="text-blue-500" size={20} />
                  </div>
                </div>
              </Card>

              <Card className="p-4 border border-border/50 bg-card/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-foreground/70">Ventas generadas</div>
                    <div className="text-2xl font-bold mt-1">{stats.totalSales}</div>
                  </div>
                  <div className="p-2 rounded-full bg-green-500/10">
                    <Users className="text-green-500" size={20} />
                  </div>
                </div>
              </Card>

              <Card className="p-4 border border-border/50 bg-card/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-foreground/70">Comisiones ganadas</div>
                    <div className="text-2xl font-bold mt-1">${stats.totalCommission.toFixed(2)} USD</div>
                  </div>
                  <div className="p-2 rounded-full bg-purple-500/10">
                    <DollarSign className="text-purple-500" size={20} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Estadísticas por app */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Rendimiento por app</h2>

              {stats.linkStats.length === 0 ? (
                <Card className="p-4 border border-border/50 bg-card/50 text-center">
                  <p className="text-foreground/70">No hay datos disponibles para el período seleccionado</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {stats.linkStats.map((appStat, index) => (
                    <Card key={index} className="p-4 border border-border/50 bg-card/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{appStat.appName || `App #${appStat.appId}`}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-foreground/70">
                            <div className="flex items-center gap-1">
                              <TrendingUp size={14} />
                              <span>Clics: {appStat.clicks}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              <span>Ventas: {appStat.sales}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>Comisiones: ${appStat.commission.toFixed(2)} USD</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-500">
                              <span>Comisión por venta: ${appStat.sales > 0 ? (appStat.commission / appStat.sales).toFixed(2) : '0.00'} USD</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                            Tasa de conversión: {appStat.clicks > 0 ? ((appStat.sales / appStat.clicks) * 100).toFixed(1) : 0}%
                          </div>
                          <div className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                            Comisión por clic: ${appStat.clicks > 0 ? (appStat.commission / appStat.clicks).toFixed(2) : 0} USD
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Estadísticas diarias */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Actividad reciente</h2>

              {stats.dailyStats.length === 0 ? (
                <Card className="p-4 border border-border/50 bg-card/50 text-center">
                  <p className="text-foreground/70">No hay datos disponibles para el período seleccionado</p>
                </Card>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="py-2 px-4 text-left">Fecha</th>
                        <th className="py-2 px-4 text-right">Clics</th>
                        <th className="py-2 px-4 text-right">Ventas</th>
                        <th className="py-2 px-4 text-right">Comisiones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.dailyStats.map((day, index) => (
                        <tr key={index} className="border-b border-border/10 hover:bg-card/30">
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>{new Date(day.date).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-right">{day.clicks}</td>
                          <td className="py-2 px-4 text-right">{day.sales}</td>
                          <td className="py-2 px-4 text-right">${day.commission.toFixed(2)} USD</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
