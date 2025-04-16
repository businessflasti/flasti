'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, ExternalLink, Trash2, AlertCircle } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserLevel } from "@/contexts/UserLevelContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import BackButton from "@/components/ui/back-button";

interface AffiliateLink {
  id: string;
  app_id: number;
  url: string;
  clicks: number;
  created_at: string;
  apps: {
    name: string;
    icon: string;
    price: number;
    url: string;
  };
}

export default function MyLinksPage() {
  const { t } = useLanguage();
  const { level, commission } = useUserLevel();
  const { user } = useAuth();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingClicks, setUpdatingClicks] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState<{[key: string]: boolean}>({});
  const [stats, setStats] = useState<{
    totalLinks: number;
    totalClicks: number;
    potentialEarnings: number;
  }>({
    totalLinks: 0,
    totalClicks: 0,
    potentialEarnings: 0
  });

  // Forzar la actualización de los contadores de clics
  const forceUpdateClicks = async () => {
    if (!user) return;

    setUpdatingClicks(true);
    try {
      // Llamar a la función RPC para forzar la actualización
      const { data, error } = await supabase.rpc('force_update_clicks', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Error al actualizar contadores de clics:', error);
        toast.error('Error al actualizar contadores de clics');
      } else {
        console.log('Contadores actualizados:', data);
        toast.success('Contadores de clics actualizados correctamente');
        // Recargar los enlaces
        await loadUserLinks(user.id);
      }
    } catch (error) {
      console.error('Error al actualizar contadores:', error);
      toast.error('Error al actualizar contadores');
    } finally {
      setUpdatingClicks(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserLinks(user.id);
    }

    // Escuchar el evento de generación de enlaces
    const handleLinkGenerated = () => {
      console.log('Evento affiliate-link-generated recibido');
      if (user) {
        // Forzar una recarga inmediata
        setTimeout(() => {
          loadUserLinks(user.id);
        }, 500); // Pequeño retraso para asegurar que la BD se haya actualizado
      }
    };

    // Usar el canal de eventos de Supabase para actualizaciones en tiempo real
    const channel = supabase
      .channel('affiliate_links_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'affiliate_links' },
        (payload) => {
          console.log('Nuevo enlace detectado:', payload);
          if (user && payload.new && payload.new.user_id === user.id) {
            loadUserLinks(user.id);
          }
        }
      )
      .subscribe();

    // Escuchar el evento personalizado para compatibilidad
    window.addEventListener('affiliate-link-generated', handleLinkGenerated);

    return () => {
      window.removeEventListener('affiliate-link-generated', handleLinkGenerated);
      // Limpiar la suscripción al canal
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Cargar enlaces del usuario
  const loadUserLinks = async (userId: string) => {
    setLoading(true);
    try {
      console.log('Cargando enlaces para usuario:', userId);

      // Obtener enlaces del usuario directamente con una consulta SQL para asegurar datos actualizados
      const { data: linksData, error: linksError } = await supabase
        .from('affiliate_links')
        .select(`
          id,
          app_id,
          url,
          clicks,
          created_at,
          apps (id, name, icon, price, url, commission_rates)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (linksError) {
        console.error('Error al obtener enlaces:', linksError);
        throw linksError;
      }

      console.log('Enlaces obtenidos:', linksData?.length || 0);

      // Obtener comisiones del usuario
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('commissions')
        .select(`
          id,
          amount,
          status,
          created_at,
          sales (app_id)
        `)
        .eq('user_id', userId);

      if (commissionsError) {
        console.error('Error al obtener comisiones:', commissionsError);
        // No lanzamos error para que al menos se muestren los enlaces
      }

      // Siempre establecer los enlaces, incluso si están vacíos
      setLinks(linksData as unknown as AffiliateLink[] || []);

      // Agrupar comisiones por app_id
      const commissionsByApp: {[key: number]: number} = {};
      commissionsData?.forEach(commission => {
        const appId = commission.sales?.app_id;
        if (appId) {
          commissionsByApp[appId] = (commissionsByApp[appId] || 0) + commission.amount;
        }
      });

      // Calcular estadísticas
      const totalLinks = linksData?.length || 0;

      // Asegurarse de que los clics se sumen correctamente
      let totalClicks = 0;
      if (linksData && linksData.length > 0) {
        linksData.forEach(link => {
          console.log(`Enlace ID: ${link.id}, App: ${link.app_id}, Clics: ${link.clicks || 0}`);
          totalClicks += (link.clicks || 0);
        });
      }
      console.log('Total de clics calculados:', totalClicks);

      // Calcular ganancias reales y potenciales
      const realEarnings = Object.values(commissionsByApp).reduce((sum, amount) => sum + amount, 0);
      const potentialEarnings = linksData?.reduce((sum, link) => {
        // Usar los precios correctos para cada app
        const appPrice = link.app_id === 1 ? 5 : link.app_id === 2 ? 7 : link.apps?.price || 0;
        const appCommissionRate = link.apps?.commission_rates?.[level] || commission;
        return sum + ((link.clicks || 0) * appPrice * appCommissionRate / 100);
      }, 0) || 0;

      // Actualizar las estadísticas
      const newStats = {
        totalLinks,
        totalClicks,
        potentialEarnings: realEarnings > 0 ? realEarnings : potentialEarnings
      };

      setStats(newStats);
      console.log('Estadísticas actualizadas:', newStats);
    } catch (error) {
      console.error('Error al cargar enlaces:', error);
      toast.error('Error al cargar tus enlaces');
      // Asegurarse de que no quede en estado de carga infinita
      setLinks([]);
      setStats({
        totalLinks: 0,
        totalClicks: 0,
        potentialEarnings: 0
      });
    } finally {
      // Asegurarse de que siempre se termine la carga
      setLoading(false);
    }
  };

  // Copiar enlace al portapapeles
  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinks({...copiedLinks, [id]: true});

    setTimeout(() => {
      setCopiedLinks({...copiedLinks, [id]: false});
    }, 2000);

    toast.success('Enlace copiado al portapapeles');
  };

  // Eliminar enlace
  const handleDeleteLink = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este enlace?')) return;

    try {
      const { error } = await supabase
        .from('affiliate_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar la lista de enlaces
      setLinks(links.filter(link => link.id !== id));
      toast.success('Enlace eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar enlace:', error);
      toast.error('Error al eliminar el enlace');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <BackButton />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('Mis Enlaces')}</h1>
            <p className="text-foreground/70 mt-1">
              {t('Gestiona y comparte tus enlaces de afiliado para generar comisiones')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => user && loadUserLinks(user.id)}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Cargando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6"></path>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                    <path d="M3 12a9 9 0 0 0 15 6.7L21 16"></path>
                    <path d="M21 22v-6h-6"></path>
                  </svg>
                  Actualizar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={forceUpdateClicks}
              disabled={updatingClicks || loading}
              className="flex items-center gap-2"
            >
              {updatingClicks ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Actualizar Clics
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 border border-border/50 bg-card/50">
            <div className="text-sm text-foreground/70">Total de enlaces</div>
            <div className="text-2xl font-bold mt-1">{stats.totalLinks}</div>
          </Card>
          <Card className="p-4 border border-border/50 bg-card/50">
            <div className="text-sm text-foreground/70">Clics totales</div>
            <div className="text-2xl font-bold mt-1">{stats.totalClicks}</div>
          </Card>
          <Card className="p-4 border border-border/50 bg-card/50 sm:col-span-2 md:col-span-1">
            <div className="text-sm text-foreground/70">Ganancias potenciales</div>
            <div className="text-2xl font-bold mt-1 text-green-500">${stats.potentialEarnings.toFixed(2)} USD</div>
            <div className="text-xs text-foreground/60 mt-1">
              Comisión actual: {commission}% ({level === 1 ? 'Nivel 1' : level === 2 ? 'Nivel 2' : 'Nivel 3'})
            </div>
          </Card>
        </div>

        {/* Lista de enlaces */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mis enlaces de afiliado</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-primary mb-2">⟳</div>
              <p>Cargando tus enlaces...</p>
              <p className="text-xs text-foreground/50 mt-2">Si tarda demasiado, puedes intentar recargar la página</p>
            </div>
          ) : links.length === 0 ? (
            <Card className="p-6 text-center border border-border/50 bg-card/50">
              <AlertCircle className="mx-auto mb-2 text-foreground/70" size={24} />
              <h3 className="text-lg font-medium">No tienes enlaces generados</h3>
              <p className="text-foreground/70 mt-1">
                Ve a la sección de Apps y genera enlaces para empezar a ganar comisiones
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/dashboard/cursos'}>
                Ir a Apps
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {links.map(link => (
                <Card key={link.id} className="p-4 border border-border/50 bg-card/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <div className="font-medium">{link.apps?.name || `App #${link.app_id}`}</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1 flex-wrap">
                            <span>{link.apps?.commission_rates?.[level] || commission}% comisión</span>
                            <span className="font-bold">=</span>
                            <span className="font-bold">${((link.app_id === 1 ? 5 : link.app_id === 2 ? 7 : link.apps?.price || 0) * (link.apps?.commission_rates?.[level] || commission) / 100).toFixed(2)} USD</span>
                            <span>por venta</span>
                          </div>
                          <div className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                            Precio: ${link.app_id === 1 ? 5 : link.app_id === 2 ? 7 : link.apps?.price || 0} USD
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md border border-border/40 overflow-hidden mb-2">
                        <div className="truncate flex-1 text-sm">{link.url}</div>
                        <button
                          onClick={() => handleCopyLink(link.id, link.url)}
                          className="p-1.5 rounded-md hover:bg-primary/10 transition-colors"
                          aria-label="Copiar enlace"
                        >
                          {copiedLinks[link.id] ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-sm text-foreground/70">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10 17 15 12 10 7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                          </svg>
                          <span>Clics: {link.clicks || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>Creado: {new Date(link.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          <span>Ganancias potenciales: </span>
                          <span className="font-bold text-green-500">${((link.clicks || 0) * (link.app_id === 1 ? 5 : link.app_id === 2 ? 7 : link.apps?.price || 0) * (link.apps?.commission_rates?.[level] || commission) / 100).toFixed(2)} USD</span>
                        </div>
                        <div className="text-xs text-foreground/50 ml-5 pl-0">
                          ({link.clicks || 0} clics × ${((link.app_id === 1 ? 5 : link.app_id === 2 ? 7 : link.apps?.price || 0) * (link.apps?.commission_rates?.[level] || commission) / 100).toFixed(2)} USD por venta)
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 flex-1 md:flex-auto justify-center mobile-touch-friendly mobile-touch-feedback"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <ExternalLink size={14} />
                        Probar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 flex-1 md:flex-auto justify-center mobile-touch-friendly mobile-touch-feedback"
                        onClick={() => handleCopyLink(link.id, link.url)}
                      >
                        {copiedLinks[link.id] ? <Check size={14} /> : <Copy size={14} />}
                        {copiedLinks[link.id] ? 'Copiado' : 'Copiar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-destructive hover:bg-destructive/10 mobile-touch-friendly mobile-touch-feedback"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
