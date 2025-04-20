'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, BarChart3, Calendar, RefreshCw, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface App {
  id: number;
  name: string;
  price: number;
  commission_rate: number;
}

interface SimulationResult {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export default function EarningsSimulator() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [conversionRate, setConversionRate] = useState<number>(3); // 3%
  const [dailyVisitors, setDailyVisitors] = useState<number>(100);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [customCommissionRate, setCustomCommissionRate] = useState<number>(50); // 50%
  const [simulationMode, setSimulationMode] = useState<'app' | 'custom'>('app');
  const [results, setResults] = useState<SimulationResult>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0
  });

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    calculateEarnings();
  }, [selectedApp, conversionRate, dailyVisitors, customPrice, customCommissionRate, simulationMode]);

  const loadApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('id, name, price, commission_rate')
        .order('name');

      if (error) {
        console.error('Error al cargar aplicaciones:', error);
      } else if (data && data.length > 0) {
        setApps(data);
        setSelectedApp(data[0]);
      }
    } catch (error) {
      console.error('Error general al cargar aplicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEarnings = () => {
    let price = 0;
    let commissionRate = 0;

    if (simulationMode === 'app' && selectedApp) {
      price = selectedApp.price;
      commissionRate = selectedApp.commission_rate;
    } else if (simulationMode === 'custom') {
      price = customPrice;
      commissionRate = customCommissionRate;
    }

    // Calcular ventas diarias basadas en visitantes y tasa de conversión
    const dailySales = Math.round(dailyVisitors * (conversionRate / 100));
    
    // Calcular ganancias diarias
    const dailyEarnings = dailySales * price * (commissionRate / 100);
    
    setResults({
      daily: dailyEarnings,
      weekly: dailyEarnings * 7,
      monthly: dailyEarnings * 30,
      yearly: dailyEarnings * 365
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleReset = () => {
    setConversionRate(3);
    setDailyVisitors(100);
    setCustomPrice(0);
    setCustomCommissionRate(50);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Simulador de Ganancias</h2>
        <p className="text-foreground/70">
          Calcula tus potenciales ganancias como afiliado basado en diferentes escenarios
        </p>
      </div>

      <Tabs defaultValue="app" value={simulationMode} onValueChange={(value: any) => setSimulationMode(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="app">Aplicaciones Flasti</TabsTrigger>
          <TabsTrigger value="custom">Personalizado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="app" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selecciona una Aplicación</CardTitle>
              <CardDescription>
                Elige la aplicación que deseas promocionar como afiliado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app">Aplicación</Label>
                <Select 
                  value={selectedApp?.id.toString()} 
                  onValueChange={(value) => {
                    const app = apps.find(a => a.id === parseInt(value));
                    if (app) setSelectedApp(app);
                  }}
                  disabled={loading || apps.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una aplicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {apps.map((app) => (
                      <SelectItem key={app.id} value={app.id.toString()}>
                        {app.name} - {formatCurrency(app.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedApp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border">
                      <DollarSign className="h-4 w-4 text-foreground/70 mr-1" />
                      <span>{selectedApp.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Comisión</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border">
                      <span>{selectedApp.commission_rate}%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Parámetros de Simulación</CardTitle>
              <CardDescription>
                Ajusta los parámetros para calcular tus potenciales ganancias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="visitors">Visitantes Diarios</Label>
                  <Badge variant="outline">{dailyVisitors}</Badge>
                </div>
                <Slider
                  id="visitors"
                  min={10}
                  max={1000}
                  step={10}
                  value={[dailyVisitors]}
                  onValueChange={(value) => setDailyVisitors(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="conversion">Tasa de Conversión</Label>
                  <Badge variant="outline">{conversionRate}%</Badge>
                </div>
                <Slider
                  id="conversion"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="ml-auto gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Reiniciar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Personalizada</CardTitle>
              <CardDescription>
                Define tus propios parámetros para la simulación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-price">Precio del Producto ($)</Label>
                  <div className="flex">
                    <span className="flex items-center justify-center h-10 px-3 rounded-l-md border border-r-0 bg-muted">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <Input
                      id="custom-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-commission">Tasa de Comisión (%)</Label>
                  <div className="flex">
                    <Input
                      id="custom-commission"
                      type="number"
                      min="0"
                      max="100"
                      value={customCommissionRate}
                      onChange={(e) => setCustomCommissionRate(parseFloat(e.target.value) || 0)}
                      className="rounded-r-none"
                    />
                    <span className="flex items-center justify-center h-10 px-3 rounded-r-md border border-l-0 bg-muted">
                      %
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="custom-visitors">Visitantes Diarios</Label>
                  <Badge variant="outline">{dailyVisitors}</Badge>
                </div>
                <Slider
                  id="custom-visitors"
                  min={10}
                  max={1000}
                  step={10}
                  value={[dailyVisitors]}
                  onValueChange={(value) => setDailyVisitors(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="custom-conversion">Tasa de Conversión</Label>
                  <Badge variant="outline">{conversionRate}%</Badge>
                </div>
                <Slider
                  id="custom-conversion"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="ml-auto gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Reiniciar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-[#ec4899]/10 to-[#9333ea]/10 border-none">
        <CardHeader>
          <CardTitle>Resultados de la Simulación</CardTitle>
          <CardDescription>
            Estimación de ganancias basada en los parámetros seleccionados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-background">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Diario</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{formatCurrency(results.daily)}</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <Calculator className="h-3 w-3 mr-1" />
                  {Math.round(dailyVisitors * (conversionRate / 100))} ventas/día
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Semanal</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{formatCurrency(results.weekly)}</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  7 días
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Mensual</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{formatCurrency(results.monthly)}</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  30 días
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Anual</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{formatCurrency(results.yearly)}</div>
                <div className="text-xs text-foreground/70 mt-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  365 días
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-foreground/70">
            <p>
              <strong>Nota:</strong> Esta simulación es una estimación basada en los parámetros proporcionados.
              Los resultados reales pueden variar dependiendo de múltiples factores como la calidad del tráfico,
              la efectividad de tus estrategias de marketing, y las tendencias del mercado.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
