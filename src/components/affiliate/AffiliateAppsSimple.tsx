'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, ExternalLink, DollarSign, TrendingUp, Star } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Función para formatear moneda
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export default function AffiliateAppsSimple() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApps();
    }
  }, [user]);

  const fetchApps = async () => {
    if (!user) {
      console.warn('No hay usuario autenticado');
      return;
    }

    try {
      setLoading(true);
      console.log('Obteniendo apps directamente...');

      // Datos de apps de ejemplo (fallback si no hay conexión a la base de datos)
      const fallbackApps = [
        {
          id: 1,
          name: "Flasti Imágenes",
          description: "Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.",
          base_price: 5,
          image_url: "/images/apps/flasti-images.jpg"
        },
        {
          id: 2,
          name: "Flasti AI",
          description: "Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.",
          base_price: 7,
          image_url: "/images/apps/flasti-ai.jpg"
        }
      ];

      // Obtener apps directamente de Supabase
      const { data: appsData, error: appsError } = await supabase
        .from('affiliate_apps')
        .select('*')
        .order('name');

      console.log('Resultado de apps:', appsData, appsError);

      // Si hay error, usar datos de fallback
      const finalAppsData = (!appsError && appsData && appsData.length > 0) ? appsData : fallbackApps;

      // Obtener el nivel del usuario
      let level = 1;
      try {
        // Intentar obtener el nivel de user_profiles
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('level')
          .eq('user_id', user.id)
          .single();

        if (!userError && userData) {
          level = userData.level;
        } else {
          // Si no se encuentra en user_profiles, buscar en profiles
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('level')
            .eq('id', user.id)
            .single();

          if (!profileError && profileData) {
            level = profileData.level;
          }
        }
      } catch (error) {
        console.error('Error al obtener nivel del usuario:', error);
      }

      setUserLevel(level);
      console.log('Nivel del usuario:', level);

      // Tabla de comisiones por nivel (fallback)
      const commissionRates = {
        1: 0.50, // 50% para nivel 1
        2: 0.60, // 60% para nivel 2
        3: 0.70  // 70% para nivel 3
      };

      // Procesar las apps con comisiones
      const processedApps = finalAppsData.map((app) => {
        // Usar la tasa de comisión según el nivel del usuario
        const commissionRate = commissionRates[level as keyof typeof commissionRates] || 0.50;

        // Calcular la comisión en dinero
        const commissionAmount = app.base_price * commissionRate;

        // Generar URL de afiliado
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://flasti.com';
        const affiliateUrl = `${baseUrl}?ref=${user.id}`;

        return {
          ...app,
          commission_rate: commissionRate,
          commission_percentage: `${(commissionRate * 100).toFixed(0)}%`,
          commission_amount: commissionAmount,
          affiliate_url: affiliateUrl
        };
      });

      console.log('Apps procesadas:', processedApps);
      setApps(processedApps);
    } catch (error) {
      console.error('Error al cargar apps:', error);
      toast.error('No se pudieron cargar las apps disponibles');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, message: string = 'Copiado al portapapeles') => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Error al copiar'));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Apps Disponibles</CardTitle>
          <CardDescription>Cargando apps...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (apps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Apps Disponibles</CardTitle>
          <CardDescription>No hay apps disponibles para promocionar</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchApps}>Reintentar</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Apps Disponibles</CardTitle>
            <CardDescription>
              Promociona estas apps y gana comisiones por cada venta
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            Nivel {userLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Card key={app.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
              <div className="relative h-40 w-full bg-muted/30">
                {app.image_url ? (
                  <Image
                    src={app.image_url}
                    alt={app.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                    <span className="text-2xl font-bold text-primary/70">{app.name}</span>
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{app.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {app.description || 'Sin descripción'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{formatCurrency(app.base_price)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-medium">{app.commission_percentage} comisión</span>
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Tu comisión por venta:</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(app.commission_amount)}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={() => copyToClipboard(app.affiliate_url, `Enlace de ${app.name} copiado`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Enlace
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(app.affiliate_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visitar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
