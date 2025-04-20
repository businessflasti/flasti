'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Users, 
  MousePointer, 
  DollarSign, 
  Lightbulb 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PerformanceData {
  totalClicks: number;
  totalSales: number;
  conversionRate: number;
  averageOrderValue: number;
  topReferrers: {
    source: string;
    clicks: number;
    percentage: number;
  }[];
  clicksByDay: {
    day: string;
    clicks: number;
  }[];
  salesByDay: {
    day: string;
    sales: number;
  }[];
  performanceByApp: {
    app: string;
    clicks: number;
    sales: number;
    conversionRate: number;
  }[];
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'improvement' | 'warning' | 'success';
  icon: React.ReactNode;
}

export default function PerformanceAnalyzer() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (user) {
      loadPerformanceData();
    }
  }, [user, period]);

  const loadPerformanceData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // En una implementación real, aquí se cargarían datos reales desde la API
      // Por ahora, simulamos datos para la demostración
      
      // Simular tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Datos simulados
      const data: PerformanceData = {
        totalClicks: Math.floor(Math.random() * 1000) + 100,
        totalSales: Math.floor(Math.random() * 50) + 1,
        conversionRate: Math.random() * 5 + 1, // 1-6%
        averageOrderValue: Math.random() * 50 + 20, // $20-$70
        topReferrers: [
          {
            source: 'facebook.com',
            clicks: Math.floor(Math.random() * 300) + 50,
            percentage: Math.random() * 40 + 10
          },
          {
            source: 'instagram.com',
            clicks: Math.floor(Math.random() * 200) + 30,
            percentage: Math.random() * 30 + 5
          },
          {
            source: 'twitter.com',
            clicks: Math.floor(Math.random() * 150) + 20,
            percentage: Math.random() * 20 + 5
          },
          {
            source: 'linkedin.com',
            clicks: Math.floor(Math.random() * 100) + 10,
            percentage: Math.random() * 15 + 3
          },
          {
            source: 'email',
            clicks: Math.floor(Math.random() * 80) + 5,
            percentage: Math.random() * 10 + 2
          }
        ],
        clicksByDay: Array.from({ length: 7 }, (_, i) => ({
          day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { weekday: 'short' }),
          clicks: Math.floor(Math.random() * 50) + 5
        })),
        salesByDay: Array.from({ length: 7 }, (_, i) => ({
          day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { weekday: 'short' }),
          sales: Math.floor(Math.random() * 5) + 0
        })),
        performanceByApp: [
          {
            app: 'Flasti Imágenes',
            clicks: Math.floor(Math.random() * 500) + 50,
            sales: Math.floor(Math.random() * 25) + 1,
            conversionRate: Math.random() * 5 + 1
          },
          {
            app: 'Flasti AI',
            clicks: Math.floor(Math.random() * 400) + 40,
            sales: Math.floor(Math.random() * 20) + 1,
            conversionRate: Math.random() * 5 + 1
          }
        ]
      };
      
      setPerformanceData(data);
      generateSuggestions(data);
    } catch (error) {
      console.error('Error al cargar datos de rendimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPerformanceData();
    setRefreshing(false);
  };

  const generateSuggestions = (data: PerformanceData) => {
    const newSuggestions: Suggestion[] = [];
    
    // Sugerencia basada en tasa de conversión
    if (data.conversionRate < 2) {
      newSuggestions.push({
        id: 'low-conversion',
        title: 'Tasa de conversión baja',
        description: 'Tu tasa de conversión está por debajo del promedio. Considera mejorar la calidad de tu tráfico o revisar tus textos promocionales para aumentar la efectividad.',
        type: 'warning',
        icon: <TrendingDown className="h-5 w-5 text-amber-500" />
      });
    } else if (data.conversionRate > 4) {
      newSuggestions.push({
        id: 'high-conversion',
        title: 'Excelente tasa de conversión',
        description: 'Tu tasa de conversión es superior al promedio. Sigue utilizando las estrategias actuales y considera expandirlas a otras plataformas.',
        type: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
      });
    }
    
    // Sugerencia basada en fuentes de tráfico
    const topReferrer = data.topReferrers[0];
    if (topReferrer && topReferrer.percentage > 50) {
      newSuggestions.push({
        id: 'traffic-diversity',
        title: 'Diversifica tus fuentes de tráfico',
        description: `Más del 50% de tu tráfico proviene de ${topReferrer.source}. Considera diversificar tus canales de promoción para reducir la dependencia de una sola fuente.`,
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
      });
    }
    
    // Sugerencia basada en rendimiento por aplicación
    const appPerformance = data.performanceByApp.sort((a, b) => b.conversionRate - a.conversionRate);
    if (appPerformance.length > 1) {
      const bestApp = appPerformance[0];
      const worstApp = appPerformance[appPerformance.length - 1];
      
      if (bestApp.conversionRate > worstApp.conversionRate * 2) {
        newSuggestions.push({
          id: 'app-focus',
          title: `Enfócate en promocionar ${bestApp.app}`,
          description: `${bestApp.app} tiene una tasa de conversión ${(bestApp.conversionRate / worstApp.conversionRate).toFixed(1)}x mayor que ${worstApp.app}. Considera enfocar más esfuerzos en promocionar esta aplicación.`,
          type: 'improvement',
          icon: <Lightbulb className="h-5 w-5 text-blue-500" />
        });
      }
    }
    
    // Sugerencia basada en tendencia de clics
    const clickTrend = data.clicksByDay.slice(-3).reduce((sum, day) => sum + day.clicks, 0) - 
                       data.clicksByDay.slice(0, 3).reduce((sum, day) => sum + day.clicks, 0);
    
    if (clickTrend < 0) {
      newSuggestions.push({
        id: 'declining-traffic',
        title: 'Tráfico en descenso',
        description: 'Tus clics han disminuido en los últimos días. Considera aumentar tu actividad promocional o probar nuevos canales.',
        type: 'warning',
        icon: <TrendingDown className="h-5 w-5 text-amber-500" />
      });
    } else if (clickTrend > 20) {
      newSuggestions.push({
        id: 'increasing-traffic',
        title: 'Tráfico en aumento',
        description: 'Tus clics están aumentando. Aprovecha este impulso para maximizar tus conversiones.',
        type: 'success',
        icon: <TrendingUp className="h-5 w-5 text-green-500" />
      });
    }
    
    // Añadir sugerencias generales si hay pocas específicas
    if (newSuggestions.length < 3) {
      newSuggestions.push({
        id: 'content-quality',
        title: 'Mejora la calidad de tu contenido',
        description: 'Contenido de alta calidad y específico para cada plataforma puede aumentar significativamente tus tasas de conversión.',
        type: 'improvement',
        icon: <Lightbulb className="h-5 w-5 text-blue-500" />
      });
      
      newSuggestions.push({
        id: 'testing',
        title: 'Prueba diferentes enfoques',
        description: 'Experimenta con diferentes textos, imágenes y llamadas a la acción para identificar qué funciona mejor con tu audiencia.',
        type: 'improvement',
        icon: <Lightbulb className="h-5 w-5 text-blue-500" />
      });
    }
    
    setSuggestions(newSuggestions);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getMaxValue = (data: { clicks: number }[] | { sales: number }[], key: 'clicks' | 'sales') => {
    return Math.max(...data.map(item => item[key]), 10);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analizador de Rendimiento</h2>
          <p className="text-foreground/70">
            Analiza el rendimiento de tus enlaces de afiliado y recibe sugerencias para mejorar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={period} onValueChange={(value: any) => setPeriod(value)}>
            <TabsList>
              <TabsTrigger value="7d">7 días</TabsTrigger>
              <TabsTrigger value="30d">30 días</TabsTrigger>
              <TabsTrigger value="90d">90 días</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {performanceData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Clics Totales</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{performanceData.totalClicks.toLocaleString()}</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <MousePointer className="h-3 w-3 mr-1" />
                  Período: {period === '7d' ? '7 días' : period === '30d' ? '30 días' : '90 días'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Ventas</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{performanceData.totalSales.toLocaleString()}</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Valor: {formatCurrency(performanceData.totalSales * performanceData.averageOrderValue)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Tasa de Conversión</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{performanceData.conversionRate.toFixed(2)}%</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {performanceData.conversionRate > 3 ? 'Por encima del promedio' : 'Promedio del sector: 3%'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Valor Promedio</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{formatCurrency(performanceData.averageOrderValue)}</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Por venta
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Día</CardTitle>
                <CardDescription>
                  Clics y ventas durante los últimos 7 días
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Clics por Día</span>
                      <span className="text-foreground/70">Máximo: {getMaxValue(performanceData.clicksByDay, 'clicks')}</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {performanceData.clicksByDay.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="h-24 w-full flex items-end">
                            <div 
                              className="w-full bg-primary/20 rounded-t-sm"
                              style={{ 
                                height: `${(day.clicks / getMaxValue(performanceData.clicksByDay, 'clicks')) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-xs mt-1">{day.day}</span>
                          <span className="text-xs font-medium">{day.clicks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Ventas por Día</span>
                      <span className="text-foreground/70">Máximo: {getMaxValue(performanceData.salesByDay, 'sales')}</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {performanceData.salesByDay.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="h-16 w-full flex items-end">
                            <div 
                              className="w-full bg-green-500/20 rounded-t-sm"
                              style={{ 
                                height: `${(day.sales / getMaxValue(performanceData.salesByDay, 'sales')) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-xs mt-1">{day.day}</span>
                          <span className="text-xs font-medium">{day.sales}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Principales Fuentes de Tráfico</CardTitle>
                <CardDescription>
                  De dónde provienen tus clics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.topReferrers.map((referrer, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{referrer.source}</span>
                        <span className="text-foreground/70">{referrer.clicks} clics ({referrer.percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={referrer.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Aplicación</CardTitle>
              <CardDescription>
                Comparativa de clics, ventas y tasa de conversión por aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Aplicación</th>
                      <th className="text-right py-2 font-medium">Clics</th>
                      <th className="text-right py-2 font-medium">Ventas</th>
                      <th className="text-right py-2 font-medium">Tasa de Conversión</th>
                      <th className="text-right py-2 font-medium">Ingresos Estimados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {performanceData.performanceByApp.map((app, index) => (
                      <tr key={index}>
                        <td className="py-3">{app.app}</td>
                        <td className="text-right py-3">{app.clicks.toLocaleString()}</td>
                        <td className="text-right py-3">{app.sales.toLocaleString()}</td>
                        <td className="text-right py-3">
                          <Badge 
                            variant={app.conversionRate > 3 ? 'default' : 'outline'}
                            className={app.conversionRate > 3 ? 'bg-green-500' : ''}
                          >
                            {app.conversionRate.toFixed(2)}%
                          </Badge>
                        </td>
                        <td className="text-right py-3">
                          {formatCurrency(app.sales * performanceData.averageOrderValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sugerencias de Mejora</CardTitle>
              <CardDescription>
                Recomendaciones personalizadas basadas en tu rendimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="border-l-4 p-4" style={{
                    borderLeftColor: suggestion.type === 'warning' 
                      ? 'rgb(245, 158, 11)' 
                      : suggestion.type === 'success' 
                        ? 'rgb(34, 197, 94)' 
                        : 'rgb(14, 165, 233)'
                  }}>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {suggestion.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <p className="text-sm text-foreground/70 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
