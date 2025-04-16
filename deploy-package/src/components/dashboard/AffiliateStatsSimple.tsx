'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Copy, Link, TrendingUp, DollarSign, Users, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { AffiliateService } from '@/lib/affiliate-service';

export default function AffiliateStatsSimple() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalSales: 0,
    totalCommission: 0,
    conversionRate: 0
  });
  const [affiliateCode, setAffiliateCode] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [apps, setApps] = useState<any[]>([]);

  // Cargar datos cuando el usuario está disponible
  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      console.log('Obteniendo datos de afiliado...');

      // Obtener las apps disponibles
      const { data: appsData, error: appsError } = await supabase
        .from('affiliate_apps')
        .select('*')
        .order('name');

      if (appsError) {
        console.error('Error al obtener apps:', appsError);
      } else {
        setApps(appsData || []);
      }

      // Usar el servicio de afiliados para verificar/crear el registro de afiliado
      const affiliateService = AffiliateService.getInstance();
      const { success, affiliate, error, isNew, needsRLSPolicy } = await affiliateService.ensureAffiliateExists(user?.id);

      // Establecer el código de afiliado
      if (success && affiliate) {
        setAffiliateCode(affiliate.affiliate_code || '');
      }

      if (!success) {
        console.error('Error al verificar/crear afiliado:', error);
        toast.error('No se pudo crear tu cuenta de afiliado');
        setLoading(false);
        return;
      }

      // Obtener estadísticas si el afiliado existe
      if (affiliate && affiliate.status === 'active') {
        try {
          // Obtener clics
          const { count: clicksCount, error: clicksError } = await supabase
            .from('affiliate_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_id', affiliate.id);

          if (clicksError) {
            console.error('Error al obtener clics:', clicksError);
          }

          // Obtener ventas
          const { data: salesData, count: salesCount, error: salesError } = await supabase
            .from('affiliate_sales')
            .select('*', { count: 'exact' })
            .eq('affiliate_id', affiliate.id);

          if (salesError) {
            console.error('Error al obtener ventas:', salesError);
          }

          // Calcular comisión total
          const totalCommission = salesData?.reduce((sum, sale) => sum + (sale.commission_amount || 0), 0) || 0;

          // Calcular tasa de conversión
          const conversionRate = clicksCount > 0 ? (salesCount / clicksCount) * 100 : 0;

          setStats({
            totalClicks: clicksCount || 0,
            totalSales: salesCount || 0,
            totalCommission,
            conversionRate
          });
        } catch (statsError) {
          console.error('Error al obtener estadísticas:', statsError);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos de afiliado:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Ya no necesitamos esta función, ahora usamos el servicio de afiliados

  const copyToClipboard = (text: string, message: string = 'Copiado al portapapeles') => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Error al copiar'));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Programa de Afiliados</CardTitle>
          <CardDescription>Cargando estadísticas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-32 bg-muted rounded mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }



  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Programa de Afiliados</CardTitle>
        <CardDescription>
          Gana comisiones por cada venta que generes con tu enlace de afiliado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stats">
          <TabsList className="mb-4">
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clics Totales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClicks}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSales}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalCommission)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.conversionRate.toFixed(2)}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Tus Enlaces de Afiliado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Promociona estas apps y gana comisiones por cada venta que generes.
              </p>

              {apps.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p>No hay apps disponibles para promocionar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apps.map((app) => {
                    // Generar URL de afiliado para la app específica
                    // Si la app tiene un slug, usamos ese slug en la URL
                    const appUrl = app.slug
                      ? `https://flasti.com/${app.slug}?ref=${affiliateCode}`
                      : app.url && app.url.includes('flasti.com')
                        ? `${app.url}?ref=${affiliateCode}`
                        : `${window.location.origin}/app/${app.id}?ref=${affiliateCode}`;

                    // Calcular la comisión estimada por venta
                    const basePrice = app.price || 50; // Precio base por defecto: $50
                    const commissionRate = app.commission_rate || 0.3; // Tasa de comisión por defecto: 30%
                    const estimatedCommission = basePrice * commissionRate;

                    return (
                      <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {app.image_url ? (
                                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                    <img
                                      src={app.image_url}
                                      alt={app.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-bold">{app.name.charAt(0)}</span>
                                  </div>
                                )}
                                <h3 className="font-medium">{app.name}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{app.description}</p>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-primary font-medium">
                                  {formatCurrency(estimatedCommission)} por venta
                                </span>
                                <span className="text-muted-foreground">
                                  ({(commissionRate * 100).toFixed(0)}% de comisión)
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                              <div className="flex items-center gap-2">
                                <Input
                                  value={appUrl}
                                  readOnly
                                  className="font-mono text-sm w-full"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(appUrl, `Enlace de ${app.name} copiado`)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => window.open(appUrl, '_blank')}
                              >
                                Visitar página
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
