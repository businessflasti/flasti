'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Copy, ExternalLink, DollarSign, TrendingUp, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

export default function AffiliateApps() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);


  useEffect(() => {
    fetchAffiliateApps();
  }, []);

  const fetchAffiliateApps = async () => {
    try {
      setLoading(true);
      console.log('Obteniendo apps de afiliado...');

      // Primero, intentar obtener información de diagnóstico
      try {
        const debugResponse = await fetch('/api/affiliate/debug');
        const debugData = await debugResponse.json();
        console.log('Información de diagnóstico:', debugData);
      } catch (debugError) {
        console.error('Error al obtener diagnóstico:', debugError);
      }

      // Luego, obtener las apps
      const response = await fetch('/api/affiliate/apps');
      console.log('Respuesta de la API:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta:', errorText);
        throw new Error(`Error al obtener apps: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      setApps(data.apps || []);


      // Verificar si hay apps
      if (!data.apps || data.apps.length === 0) {
        console.warn('No se encontraron apps en la respuesta');
      }
    } catch (error) {
      console.error('Error al cargar apps de afiliado:', error);
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
          <Button onClick={fetchAffiliateApps}>Reintentar</Button>
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
