'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppWindow, Link2, Copy, Check, ExternalLink } from 'lucide-react';
import { affiliateServiceEnhanced } from '@/lib/affiliate-service-enhanced';
import { App } from '@/lib/supabase';

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [userLinks, setUserLinks] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [generatingLink, setGeneratingLink] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Obtener todas las aplicaciones disponibles
        const availableApps = await affiliateServiceEnhanced.getAvailableApps();
        setApps(availableApps);
        
        // Obtener enlaces del usuario
        const { links } = await affiliateServiceEnhanced.getUserAffiliateLinks('user123'); // En un caso real, obtendríamos el ID del usuario autenticado
        
        // Crear un mapa de appId -> url
        const linkMap: Record<number, string> = {};
        links.forEach(link => {
          linkMap[link.app_id] = link.url;
        });
        
        setUserLinks(linkMap);
      } catch (error) {
        console.error('Error al cargar aplicaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const generateLink = async (appId: number) => {
    try {
      setGeneratingLink(appId);
      // En un caso real, obtendríamos el ID del usuario autenticado
      const result = await affiliateServiceEnhanced.generateAffiliateLink('user123', appId);
      
      if (result.success && result.link) {
        setUserLinks(prev => ({
          ...prev,
          [appId]: result.link.url
        }));
      }
    } catch (error) {
      console.error('Error al generar enlace:', error);
    } finally {
      setGeneratingLink(null);
    }
  };

  const copyToClipboard = (appId: number, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(appId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Elementos decorativos futuristas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-8">Aplicaciones Disponibles</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <Card key={app.id} className="glass-card overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mr-3"
                        style={{
                          backgroundColor: app.icon_bg || '#9333ea20',
                          color: app.icon_color || '#9333ea'
                        }}
                      >
                        <AppWindow size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{app.name}</h3>
                        <p className="text-sm text-foreground/60">${app.price.toFixed(2)} USD</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-6 line-clamp-2">{app.description}</p>
                  
                  {userLinks[app.id] ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Link2 size={16} className="text-primary mr-2" />
                        <span className="text-sm font-medium">Tu enlace de afiliado:</span>
                      </div>
                      <div className="flex items-center bg-muted/30 rounded-md p-2 text-sm">
                        <input 
                          type="text" 
                          value={userLinks[app.id]} 
                          readOnly 
                          className="bg-transparent flex-1 outline-none overflow-hidden text-ellipsis"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 h-8 w-8 p-0" 
                          onClick={() => copyToClipboard(app.id, userLinks[app.id])}
                        >
                          {copiedLink === app.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs" 
                          onClick={() => window.open(userLinks[app.id], '_blank')}
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Probar enlace
                        </Button>
                        <div className="text-xs text-foreground/60 flex items-center">
                          <span>Comisión: 50-70%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => generateLink(app.id)}
                      disabled={generatingLink === app.id}
                    >
                      {generatingLink === app.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                          Generando...
                        </>
                      ) : (
                        <>
                          <Link2 size={16} className="mr-2" />
                          Generar enlace de afiliado
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}