'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserLevel } from '@/contexts/UserLevelContext';
import { supabase } from '@/lib/supabase';
import { affiliateService } from '@/lib/affiliate-service';
import BackButton from '@/components/ui/back-button';

export default function CursosPage() {
  const { t } = useLanguage();
  const { level, commission } = useUserLevel();
  const [apps, setApps] = useState([
    {
      id: 1,
      name: "Flasti Imágenes",
      icon: <Image className="text-[#ec4899]" size={24} />,
      description: "Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.",
      bgGradient: "from-[#ec4899]/20 to-[#f97316]/20",
      iconBg: "bg-[#ec4899]/10",
      iconColor: "text-[#ec4899]",
      price: 5
    },
    {
      id: 2,
      name: "Flasti AI",
      icon: <Sparkles className="text-[#9333ea]" size={24} />,
      description: "Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.",
      bgGradient: "from-[#9333ea]/20 to-[#ec4899]/20",
      iconBg: "bg-[#9333ea]/10",
      iconColor: "text-[#9333ea]",
      price: 10
    },
    {
      id: 3,
      name: "Coming soon...",
      icon: <Sparkles className="text-[#facc15] animate-[pulse_1.5s_ease-in-out_infinite]" size={24} />,
      description: "Una nueva herramienta revolucionaria está en desarrollo. Mantente atento para más información.",
      bgGradient: "from-[#facc15]/20 to-[#f97316]/20",
      iconBg: "bg-[#facc15]/10",
      iconColor: "text-[#facc15]",
      comingSoon: true,
      price: 0
    },
  ]);
  const [userLinks, setUserLinks] = useState<{[key: number]: string}>({});
  const [copiedLinks, setCopiedLinks] = useState<{[key: number]: boolean}>({});
  const [userId, setUserId] = useState<string>('user-123'); // En un caso real, esto vendría de la sesión
  
  // En una implementación real, obtendríamos las apps y los enlaces del usuario desde Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener enlaces del usuario
        const links = await affiliateService.getUserAffiliateLinks(userId);
        const linksMap: {[key: number]: string} = {};
        
        links.forEach(link => {
          linksMap[link.app_id] = link.url;
        });
        
        setUserLinks(linksMap);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };
    
    fetchUserData();
  }, [userId]);

  // Generar un enlace de afiliado para una app
  const generateAffiliateLink = async (appId: number) => {
    try {
      const result = await affiliateService.generateAffiliateLink(userId, appId);
      
      if (result.success && result.link) {
        setUserLinks(prev => ({
          ...prev,
          [appId]: result.link.url
        }));
      }
    } catch (error) {
      console.error('Error al generar enlace de afiliado:', error);
    }
  };

  // Copiar enlace al portapapeles
  const handleCopyLink = (id: number) => {
    if (userLinks[id]) {
      navigator.clipboard.writeText(userLinks[id]);
      setCopiedLinks({...copiedLinks, [id]: true});
      
      setTimeout(() => {
        setCopiedLinks({...copiedLinks, [id]: false});
      }, 2000);
    }
  };

  // Calcular comisión para una app según el nivel del usuario
  const calculateCommission = (price: number) => {
    return (price * commission) / 100;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-2">Aplicaciones Disponibles</h1>
      <p className="text-foreground/70 mb-6">Promociona estas aplicaciones y gana comisiones como afiliado.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <Card 
            key={app.id} 
            className={`glass-card p-6 relative overflow-hidden group ${app.comingSoon ? 'animate-[appear_3s_ease-in-out_infinite]' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-30`}></div>
            
            {/* Efectos decorativos */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${app.iconBg}`}>
                {app.icon}
              </div>
              <h2 className="text-xl font-bold">{app.name}</h2>
            </div>

            <div className="mb-6">
              <p className="text-foreground/80">{app.description}</p>
            </div>

            {/* Información de ganancias */}
            {!app.comingSoon && (
              <div className="bg-card/30 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Precio:</span>
                  <span className="font-medium">${app.price} USD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Tu comisión ({commission}%):</span>
                  <span className="font-medium text-primary">${calculateCommission(app.price).toFixed(2)} USD</span>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            {!app.comingSoon ? (
              userLinks[app.id] ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 bg-card/50 rounded-md border border-border/40 overflow-hidden">
                    <div className="truncate flex-1 text-sm">{userLinks[app.id]}</div>
                    <button 
                      onClick={() => handleCopyLink(app.id)}
                      className="p-1.5 rounded-md hover:bg-primary/10 transition-colors"
                      aria-label="Copiar enlace"
                    >
                      {copiedLinks[app.id] ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center gap-1"
                      onClick={() => window.open(userLinks[app.id], '_blank')}
                    >
                      <ExternalLink size={14} />
                      <span>Visitar</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCopyLink(app.id)}
                    >
                      {copiedLinks[app.id] ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity"
                  onClick={() => generateAffiliateLink(app.id)}
                >
                  Generar Enlace
                </Button>
              )
            ) : (
              <Button disabled className="w-full opacity-50 cursor-not-allowed">
                Próximamente
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}