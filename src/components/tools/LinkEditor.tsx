'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Link, Copy, Check, ExternalLink, Palette, Image, RefreshCw, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface App {
  id: number;
  name: string;
  url: string;
}

interface LinkStyle {
  id: string;
  name: string;
  primaryColor: string;
  textColor: string;
  icon: string;
  buttonText: string;
}

export default function LinkEditor() {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [affiliateId, setAffiliateId] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [utmSource, setUtmSource] = useState<string>('');
  const [utmMedium, setUtmMedium] = useState<string>('affiliate');
  const [utmCampaign, setUtmCampaign] = useState<string>('');
  const [finalUrl, setFinalUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('default');
  const [customButtonText, setCustomButtonText] = useState<string>('Acceder Ahora');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const linkStyles: LinkStyle[] = [
    {
      id: 'default',
      name: 'Flasti Estándar',
      primaryColor: '#ec4899',
      textColor: '#ffffff',
      icon: 'arrow-right',
      buttonText: 'Acceder Ahora'
    },
    {
      id: 'purple',
      name: 'Púrpura Elegante',
      primaryColor: '#9333ea',
      textColor: '#ffffff',
      icon: 'arrow-right',
      buttonText: 'Descubrir'
    },
    {
      id: 'blue',
      name: 'Azul Profesional',
      primaryColor: '#0ea5e9',
      textColor: '#ffffff',
      icon: 'arrow-right',
      buttonText: 'Comenzar'
    },
    {
      id: 'green',
      name: 'Verde Éxito',
      primaryColor: '#22c55e',
      textColor: '#ffffff',
      icon: 'check',
      buttonText: '¡Obtener Ahora!'
    },
    {
      id: 'amber',
      name: 'Ámbar Llamativo',
      primaryColor: '#f59e0b',
      textColor: '#ffffff',
      icon: 'zap',
      buttonText: '¡Aprovechar Oferta!'
    }
  ];

  useEffect(() => {
    if (user) {
      loadApps();
      loadAffiliateId();
    }
  }, [user]);

  useEffect(() => {
    generateFinalUrl();
  }, [selectedApp, affiliateId, customUrl, utmSource, utmMedium, utmCampaign]);

  const loadApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('id, name, url')
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

  const loadAffiliateId = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('affiliate_id')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error al cargar ID de afiliado:', error);
      } else if (data) {
        setAffiliateId(data.affiliate_id);
      }
    } catch (error) {
      console.error('Error general al cargar ID de afiliado:', error);
    }
  };

  const generateFinalUrl = () => {
    if (!selectedApp && !customUrl) {
      setFinalUrl('');
      return;
    }

    let baseUrl = customUrl || (selectedApp ? selectedApp.url : '');
    
    // Asegurarse de que la URL tenga el formato correcto
    if (baseUrl && !baseUrl.startsWith('http')) {
      baseUrl = 'https://' + baseUrl;
    }

    if (!baseUrl) {
      setFinalUrl('');
      return;
    }

    // Construir la URL con los parámetros
    const url = new URL(baseUrl);
    
    // Añadir ID de afiliado
    if (affiliateId) {
      url.searchParams.set('ref', affiliateId);
    }
    
    // Añadir parámetros UTM si están presentes
    if (utmSource) url.searchParams.set('utm_source', utmSource);
    if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
    if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign);
    
    setFinalUrl(url.toString());
  };

  const handleCopyUrl = () => {
    if (!finalUrl) return;
    
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    toast.success('Enlace copiado al portapapeles');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCopyHtml = () => {
    if (!finalUrl) return;
    
    const style = linkStyles.find(s => s.id === selectedStyle) || linkStyles[0];
    
    const html = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: ${style.primaryColor}; color: ${style.textColor}; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">${customButtonText || style.buttonText}</a>`;
    
    navigator.clipboard.writeText(html);
    toast.success('Código HTML copiado al portapapeles');
  };

  const getSelectedStyle = () => {
    return linkStyles.find(s => s.id === selectedStyle) || linkStyles[0];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Editor de Enlaces</h2>
        <p className="text-foreground/70">
          Personaliza y genera enlaces de afiliado para promocionar aplicaciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="app">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app">Aplicación Flasti</TabsTrigger>
              <TabsTrigger value="custom">URL Personalizada</TabsTrigger>
            </TabsList>
            
            <TabsContent value="app" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona una Aplicación</CardTitle>
                  <CardDescription>
                    Elige la aplicación que deseas promocionar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="app">Aplicación</Label>
                    <Select 
                      value={selectedApp?.id.toString()} 
                      onValueChange={(value) => {
                        const app = apps.find(a => a.id === parseInt(value));
                        if (app) setSelectedApp(app);
                      }}
                      disabled={apps.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una aplicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {apps.map((app) => (
                          <SelectItem key={app.id} value={app.id.toString()}>
                            {app.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>URL Personalizada</CardTitle>
                  <CardDescription>
                    Introduce una URL externa para promocionar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="custom-url">URL</Label>
                    <Input
                      id="custom-url"
                      placeholder="https://ejemplo.com"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Parámetros de Seguimiento</CardTitle>
              <CardDescription>
                Personaliza los parámetros UTM para un mejor seguimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="utm-source">UTM Source</Label>
                <Input
                  id="utm-source"
                  placeholder="facebook, instagram, email, etc."
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="utm-medium">UTM Medium</Label>
                <Input
                  id="utm-medium"
                  placeholder="affiliate"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="utm-campaign">UTM Campaign</Label>
                <Input
                  id="utm-campaign"
                  placeholder="summer_promo, black_friday, etc."
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estilo del Botón</CardTitle>
              <CardDescription>
                Personaliza la apariencia del botón para tu enlace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="button-style">Estilo</Label>
                <Select 
                  value={selectedStyle} 
                  onValueChange={setSelectedStyle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {linkStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button-text">Texto del Botón</Label>
                <Input
                  id="button-text"
                  placeholder="Acceder Ahora"
                  value={customButtonText}
                  onChange={(e) => setCustomButtonText(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tu Enlace de Afiliado</CardTitle>
              <CardDescription>
                Copia y comparte este enlace para promocionar la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="final-url">Enlace Generado</Label>
                <div className="flex">
                  <Input
                    id="final-url"
                    value={finalUrl}
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyUrl}
                    disabled={!finalUrl}
                    className="rounded-l-none border-l-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-qr"
                  checked={showQrCode}
                  onCheckedChange={setShowQrCode}
                />
                <Label htmlFor="show-qr">Mostrar código QR</Label>
              </div>
              
              {showQrCode && finalUrl && (
                <div className="flex justify-center p-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(finalUrl)}`}
                    alt="QR Code"
                    className="border rounded-md"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Botón</CardTitle>
              <CardDescription>
                Así se verá tu botón personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    className="rounded-r-none"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    className="rounded-l-none"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    Mobile
                  </Button>
                </div>
              </div>
              
              <div className={`border rounded-lg p-6 flex justify-center ${
                previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''
              }`}>
                <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors"
                  style={{ 
                    backgroundColor: getSelectedStyle().primaryColor,
                    color: getSelectedStyle().textColor
                  }}
                >
                  <span>{customButtonText || getSelectedStyle().buttonText}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCopyHtml}
                  disabled={!finalUrl}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Código HTML
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
