'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserLevel } from '@/contexts/UserLevelContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AffiliateServiceEnhanced } from '@/lib/affiliate-service-enhanced';
import BackButton from '@/components/ui/back-button';
import { toast } from 'sonner';

// Obtener la instancia del servicio de afiliados
const affiliateService = AffiliateServiceEnhanced.getInstance();

export default function AplicacionesPage() {
  const { t } = useLanguage();
  const { level, commission } = useUserLevel();
  const { user } = useAuth();

  // Estado para las apps disponibles
  const [apps, setApps] = useState([
    {
      id: 1,
      name: "Flasti Imágenes",
      icon: <img src="/apps/active/images-logo.png" alt="Flasti Images" className="w-6 h-6 rounded-full" />,
      description: "Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.",
      bgGradient: "from-[#ec4899]/20 to-[#f97316]/20",
      iconBg: "bg-[#ec4899]/10",
      iconColor: "text-[#ec4899]",
      price: 5,
      url: "https://flasti.com/images"
    },
    {
      id: 2,
      name: "Flasti AI",
      icon: <img src="/apps/active/ia-logo.png" alt="Flasti AI" className="w-6 h-6 rounded-full" />,
      description: "Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.",
      bgGradient: "from-[#9333ea]/20 to-[#ec4899]/20",
      iconBg: "bg-[#9333ea]/10",
      iconColor: "text-[#9333ea]",
      price: 7,
      url: "https://flasti.com/ai"
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
      price: 0,
      url: ""
    },
  ]);

  // Estados para manejar los enlaces y la UI
  const [userLinks, setUserLinks] = useState<{[key: number]: string}>({});
  const [copiedLinks, setCopiedLinks] = useState<{[key: number]: boolean}>({});
  const [loading, setLoading] = useState<{[key: number]: boolean}>({});
  const [userId, setUserId] = useState<string>('');

  // Obtener el ID del usuario al cargar la página
  useEffect(() => {
    const getUserId = async () => {
      if (user) {
        setUserId(user.id);
        loadUserLinks(user.id);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
          loadUserLinks(session.user.id);
        }
      }
    };
    getUserId();
  }, [user]);

  // Cargar los enlaces existentes del usuario
  const loadUserLinks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('affiliate_links')
        .select('app_id, url')
        .eq('user_id', userId);

      if (error) throw error;

      // Convertir el array a un objeto para fácil acceso
      const linksObj: {[key: number]: string} = {};
      if (data) {
        data.forEach(link => {
          linksObj[link.app_id] = link.url;
        });
      }

      setUserLinks(linksObj);
    } catch (error) {
      console.error('Error al cargar enlaces:', error);
    }
  };

  // Generar un enlace de afiliado para una app
  const generateAffiliateLink = async (appId: number) => {
    if (!userId) {
      toast.error("Debes iniciar sesión para generar enlaces");
      return;
    }

    // Marcar como cargando
    setLoading(prev => ({ ...prev, [appId]: true }));

    try {
      // Verificar si ya existe un enlace para esta app
      if (userLinks[appId]) {
        // Si ya existe, solo copiarlo al portapapeles
        navigator.clipboard.writeText(userLinks[appId]);
        setCopiedLinks(prev => ({ ...prev, [appId]: true }));
        setTimeout(() => setCopiedLinks(prev => ({ ...prev, [appId]: false })), 2000);
        toast.success("Enlace copiado al portapapeles");
        setLoading(prev => ({ ...prev, [appId]: false }));
        return;
      }

      // Generar un nuevo enlace
      const result = await affiliateService.generateAffiliateLink(userId, appId);

      if (result.success && result.link) {
        // Guardar el nuevo enlace
        setUserLinks(prev => ({
          ...prev,
          [appId]: result.link.url
        }));

        // Copiar al portapapeles
        navigator.clipboard.writeText(result.link.url);
        setCopiedLinks(prev => ({ ...prev, [appId]: true }));
        setTimeout(() => setCopiedLinks(prev => ({ ...prev, [appId]: false })), 2000);

        toast.success("Enlace generado y copiado al portapapeles");

        // Actualizar la lista de enlaces en la página de enlaces
        window.dispatchEvent(new CustomEvent('affiliate-link-generated'));
      } else {
        toast.error("Error al generar enlace. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error('Error al generar enlace de afiliado:', error);
      toast.error("Error al generar enlace. Inténtalo de nuevo.");
    } finally {
      setLoading(prev => ({ ...prev, [appId]: false }));
    }
  };

  // Abrir la app en una nueva ventana
  const openApp = (url: string) => {
    if (!url) {
      toast.error("Esta app no está disponible todavía");
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <BackButton />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('Apps Disponibles')}</h1>
          <p className="text-foreground/70 mt-1">
            {t('Explora nuestra selección de apps y comienza a generar ingresos.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map(app => (
            <Card key={app.id} className={`overflow-hidden border border-border/50 bg-card/50 hover:bg-card/70 transition-colors`}>
              <div className={`p-6 bg-gradient-to-br ${app.bgGradient}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${app.iconBg} flex items-center justify-center`}>
                    {app.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{app.name}</h3>
                </div>

                <p className="text-sm text-foreground/70 mb-6 min-h-[60px]">
                  {app.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs text-foreground/60">Precio:</div>
                    <div className="text-lg font-bold">
                      {app.comingSoon ? 'Próximamente' : `$${app.price} USD`}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-foreground/60">Tu comisión ({commission}%):</div>
                    <div className="text-lg font-bold text-green-500">
                      {app.comingSoon ? '-' : `$${(app.price * commission / 100).toFixed(2)} USD`}
                    </div>
                    <div className="text-xs text-foreground/60 mt-1">
                      por cada venta
                    </div>
                  </div>
                </div>

                {!app.comingSoon ? (
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity py-3 mobile-touch-friendly"
                      onClick={() => generateAffiliateLink(app.id)}
                      disabled={loading[app.id]}
                    >
                      {loading[app.id] ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Generando...
                        </>
                      ) : userLinks[app.id] ? (
                        <>
                          {copiedLinks[app.id] ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                          {copiedLinks[app.id] ? "Copiado" : "Copiar Enlace"}
                        </>
                      ) : (
                        "Generar Enlace"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 py-3 mobile-touch-friendly"
                      onClick={() => openApp(app.url)}
                    >
                      <ExternalLink size={16} />
                      Ver app
                    </Button>
                  </div>
                ) : (
                  <Button disabled className="w-full opacity-50 cursor-not-allowed py-3">
                    Próximamente
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
