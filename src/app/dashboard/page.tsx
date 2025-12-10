"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import OffersListNew from '@/components/cpalead/OffersListNew';
import UserBalanceDisplay from '@/components/cpalead/UserBalanceDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Target, Gift, Globe, CheckCircle2, Wallet } from 'lucide-react';
import CountryFlag from '@/components/ui/CountryFlag';
import { toast } from 'sonner';
import OnboardingSlider from '@/components/dashboard/OnboardingSlider';
import AdBlock from '@/components/ui/AdBlock';
import { useElementVisibility } from '@/hooks/useElementVisibility';
import PremiumServicesSlider from '@/components/premium/PremiumServicesSlider';

// Importar estilos de optimizaciones de rendimiento
import "./performance.css";

interface UserStats {
  balance: number;
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  totalTransactions: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Hook de visibilidad para elementos del dashboard
  const { isVisible, elements, isLoading } = useElementVisibility('dashboard');
  

  
  // Estado para controlar si se muestra el reproductor completo
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  
  // Estado para el video tutorial
  const [tutorialVideo, setTutorialVideo] = useState({
    sliderUrl: '/video/tutorial-bienvenida.mp4',
    playerUrl: '/video/tutorial-bienvenida.mp4',
    title: 'Bienvenido a flasti',
    description: '',
    isClickable: true
  });
  
  const [offers, setOffers] = useState<CPALeadOffer[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    balance: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    totalTransactions: 0
  });
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [cpaLeadData, setCpaLeadData] = useState<{
    userCountry: string;
    refreshing: boolean;
    handleRefresh: () => void;
  } | null>(null);

  // Redirección automática para cuenta admin
  // Redirección automática a admin removida - todas las cuentas van a dashboard
  const [detectedCountry, setDetectedCountry] = useState<string>('--');
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

  // Detectar y guardar país del usuario en la base de datos
  useEffect(() => {
    const detectAndSaveCountry = async () => {
      if (!user) return;

      try {
        // 1. Primero intentar desde localStorage (más rápido)
        const savedCountry = localStorage.getItem('userCountry');
        if (savedCountry && savedCountry !== 'GLOBAL' && savedCountry !== '--') {
          setDetectedCountry(savedCountry);
        }

        // 2. Verificar en paralelo si el usuario ya tiene país en BD
        const profilePromise = supabase
          .from('user_profiles')
          .select('country')
          .eq('user_id', user.id)
          .single();

        // 3. Si no hay en localStorage, detectar vía API inmediatamente
        let countryCode = savedCountry && savedCountry !== 'GLOBAL' && savedCountry !== '--' ? savedCountry : null;
        
        if (!countryCode) {
          // Detectar país con timeout para no bloquear
          const detectCountry = async () => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
              
              const response = await fetch('https://ipapi.co/json/', {
                signal: controller.signal
              });
              clearTimeout(timeoutId);
              
              if (response.ok) {
                const data = await response.json();
                return data.country_code;
              }
            } catch (error) {
              console.warn('Error detectando país vía API:', error);
            }
            return null;
          };

          countryCode = await detectCountry();
          
          if (countryCode) {
            setDetectedCountry(countryCode);
            localStorage.setItem('userCountry', countryCode);
          }
        }

        // 4. Verificar resultado de BD
        const { data: profile } = await profilePromise;
        
        // Si BD tiene país y es diferente al detectado, usar el de BD
        if (profile?.country && profile.country !== countryCode) {
          setDetectedCountry(profile.country);
          localStorage.setItem('userCountry', profile.country);
          countryCode = profile.country;
        }

        // 5. Guardar en BD si es necesario (en background)
        if (countryCode && (!profile?.country || profile.country !== countryCode)) {
          const deviceType = /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) 
            ? 'Mobile' 
            : /Tablet|iPad/i.test(navigator.userAgent)
            ? 'Tablet'
            : 'Desktop';

          // No esperar esta operación
          supabase
            .from('user_profiles')
            .update({ 
              country: countryCode,
              device_type: deviceType
            })
            .eq('user_id', user.id)
            .then(() => {})
            .catch(err => console.error('Error guardando país:', err));
        }
      } catch (error) {
        console.error('Error detectando/guardando país:', error);
        // Fallback: mantener el valor actual o usar '--'
        if (!detectedCountry || detectedCountry === '--') {
          const fallback = localStorage.getItem('userCountry');
          if (fallback && fallback !== 'GLOBAL') {
            setDetectedCountry(fallback);
          }
        }
      }
    };

    detectAndSaveCountry();
  }, [user]);

  // Actualizar fecha y hora cada minuto
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Formatear fecha con día completo
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];
      
      // Formatear hora
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      setCurrentDateTime({
        date: `${dayName} ${day} ${monthName}`,
        time: `${hours}:${minutes}`
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Función para obtener el nombre completo del país
  const getCountryName = (code: string) => {
    if (!code || code === '--' || code === 'GLOBAL') return '';
    try {
      const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
      return regionNames.of(code);
    } catch (e) {
      return '';
    }
  };

  // Obtener ofertas de CPALead con filtrado por país
  const fetchOffers = async (forceRefresh = false) => {
    try {
      setIsLoadingOffers(true);
      
      // Obtener país del usuario desde localStorage
      const userCountry = localStorage.getItem('userCountry');
      
      // Construir URL con parámetros
      const params = new URLSearchParams();
      if (userCountry && userCountry !== 'GLOBAL') {
        params.append('country', userCountry);
      }
      if (forceRefresh) {
        params.append('refresh', 'true');
      }
      
      const url = `/api/cpalead/offers${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setOffers(result.data);
      } else {
        console.error('❌ Error fetching CPALead offers:', result.message);
        toast.error('Error al cargar las ofertas');
        setOffers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching CPALead offers:', error);
      toast.error('Error al cargar las ofertas');
      setOffers([]);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  // Obtener estadísticas del usuario
  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingStats(true);

      // Obtener el token de sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No hay sesión activa');
        return;
      }

      // Usar el endpoint de perfil de usuario con autorización
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error('Error fetching user profile:', data.error);
        return;
      }

      const { profile, cpalead_stats } = data;

      const stats: UserStats = {
        balance: profile.balance || 0,
        totalEarnings: cpalead_stats.total_earnings || 0,
        todayEarnings: cpalead_stats.today_earnings || 0,
        weekEarnings: cpalead_stats.week_earnings || 0,
        totalTransactions: cpalead_stats.total_transactions || 0
      };

      setUserStats(stats);

    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Cargar video tutorial desde Supabase en tiempo real
  useEffect(() => {
    const loadTutorialVideo = async () => {
      try {
        const { data, error } = await supabase
          .from('tutorial_video')
          .select('*')
          .eq('is_active', true)
          .single();

        if (!error && data) {
          setTutorialVideo({
            sliderUrl: data.slider_video_url,
            playerUrl: data.player_video_url,
            title: 'Bienvenido a flasti',
            description: '',
            isClickable: data.is_clickable
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadTutorialVideo();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('tutorial_video_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tutorial_video'
        },
        () => {
          loadTutorialVideo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchOffers();
    fetchUserStats();
  }, [user?.id]);

  // Recargar ofertas cuando se detecte o cambie el país del usuario
  useEffect(() => {
    const handleCountryChange = () => {
      const currentCountry = localStorage.getItem('userCountry');
      if (currentCountry && currentCountry !== 'GLOBAL') {
        fetchOffers(true);
      }
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleCountryChange);
    
    // También verificar periódicamente si se detectó el país
    const countryCheckInterval = setInterval(() => {
      const currentCountry = localStorage.getItem('userCountry');
      if (currentCountry && currentCountry !== 'GLOBAL' && offers.length === 0) {
        fetchOffers();
      }
    }, 5000); // Verificar cada 5 segundos

    return () => {
      window.removeEventListener('storage', handleCountryChange);
      clearInterval(countryCheckInterval);
    };
  }, [offers.length]);

  // Configurar actualización en tiempo real del saldo
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchUserStats();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'cpalead_transactions',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchUserStats();
        toast.success('¡Nueva ganancia registrada!');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Actualizar el país detectado cuando cambien los datos de CPA Lead
  useEffect(() => {
    if (cpaLeadData) {
      setDetectedCountry(cpaLeadData.userCountry);
    }
  }, [cpaLeadData]);

  return (
    <div className="min-h-screen overscroll-none relative overflow-x-hidden bg-[#0A0A0A]">
      
      {/* Container principal con mejor padding y max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 pb-16 md:pb-8 relative z-10">
        


        {/* Contenedor móvil con imagen de fondo - Balance y Asesora */}
        {user?.id && (
          <div className="md:hidden mb-4 rounded-2xl overflow-hidden p-4 pb-6 relative">
            {/* Imagen de fondo optimizada con Next.js Image */}
            <Image
              src="/images/fondo.webp"
              alt=""
              fill
              priority
              className="object-cover -z-10"
              sizes="100vw"
            />
            
            {/* Balance móvil - DENTRO del contenedor con imagen de fondo */}
            {isVisible('balance_display') && (
              <div className="w-full mb-4">
                <UserBalanceDisplay
                  initialBalance={userStats.balance}
                  userId={user.id}
                  currency="USD"
                  showControls={true}
                />
              </div>
            )}
            
          </div>
        )}

        {/* Tutorial móvil - FUERA del contenedor con imagen de fondo */}
        {user?.id && isVisible('video_tutorial') && (
          <div className="md:hidden mb-4">
            <div className="relative h-[200px] bg-black rounded-3xl overflow-hidden">
              <Card 
                className="relative bg-[#121212] h-full overflow-hidden rounded-3xl"
                style={{ contain: 'layout style paint' }}
              >
                {/* Imagen de fondo */}
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                  <img
                    src="/images/tutorial.webp"
                    alt="Tutorial"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-[#000000]/75 z-[1]"></div>

                {/* Contenido */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {tutorialVideo.title}
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      Aprende cómo funciona la plataforma
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {tutorialVideo.isClickable && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setShowFullPlayer(true)}
                          className="rounded-full border-[3px] border-[#3A3A3A] overflow-hidden flex items-stretch gap-0"
                        >
                          <span className="pl-5 pr-3 py-2.5 bg-[#E5E5E5] text-[#121212] font-bold flex items-center">
                            Ver video
                          </span>
                          <div className="pr-5 pl-3 bg-[#121212] flex items-center justify-center">
                            <svg className="w-5 h-5" fill="#FACD48" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal de video */}
                {showFullPlayer && (
                  <div className="absolute inset-0 z-20 bg-black">
                    <video
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      preload="metadata"
                      controlsList="nodownload noplaybackrate nofullscreen"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={tutorialVideo.playerUrl} type="video/mp4" />
                    </video>
                    
                    <button
                      onClick={() => setShowFullPlayer(false)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center z-10"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Layout Desktop: Columna izquierda (Balance + Bono) y Columna derecha (Video) */}
        {user?.id && (
          <div className="hidden md:block mb-4 lg:mb-6 rounded-2xl overflow-hidden py-6 px-4 relative">
            {/* Imagen de fondo optimizada con Next.js Image */}
            <Image
              src="/images/fondo.webp"
              alt=""
              fill
              priority
              className="object-cover -z-10"
              sizes="100vw"
            />
            <div className="grid md:grid-cols-[4fr_13fr] gap-4">
            {/* Columna izquierda: Balance */}
            <div className="h-[380px]">
              <UserBalanceDisplay
                initialBalance={userStats.balance}
                userId={user.id}
                currency="USD"
                showControls={true}
              />
            </div>

            {/* Columna derecha: Video Tutorial */}
            <div className="flex flex-col gap-4 h-[380px]">
              {/* Tutorial */}
              <div className="flex-1 min-h-0">
              <Card 
                className="relative bg-[#121212] h-full overflow-hidden rounded-3xl"
                style={{ contain: 'layout style paint' }}
              >
                {/* Imagen de fondo */}
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                  <img
                    src="/images/tutorial.webp"
                    alt="Tutorial"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-[#000000]/75 z-[1]"></div>

                {/* Contenido */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {tutorialVideo.title}
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      Aprende cómo funciona la plataforma
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {tutorialVideo.isClickable && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setShowFullPlayer(true)}
                          className="rounded-full border-[3px] border-[#3A3A3A] overflow-hidden flex items-stretch gap-0"
                        >
                          <span className="pl-5 pr-3 py-2.5 bg-[#E5E5E5] text-[#121212] font-bold flex items-center">
                            Ver video
                          </span>
                          <div className="pr-5 pl-3 bg-[#121212] flex items-center justify-center">
                            <svg className="w-5 h-5" fill="#FACD48" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal de video */}
                {showFullPlayer && (
                  <div className="absolute inset-0 z-20 bg-black">
                    <video
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      preload="metadata"
                      controlsList="nodownload noplaybackrate nofullscreen"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={tutorialVideo.playerUrl} type="video/mp4" />
                    </video>
                    
                    <button
                      onClick={() => setShowFullPlayer(false)}
                      className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center z-10"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </Card>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6" style={{ contain: 'layout style' }}>
          {isVisible('stat_today') && (
            <div className="rounded-3xl p-4 lg:p-6 bg-[#121212]" style={{ contain: 'layout style paint' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Hoy
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    ${userStats.todayEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white">
                  <TrendingUp className="w-6 h-6 text-[#121212]" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_week') && (
            <div className="rounded-3xl p-4 lg:p-6 bg-[#121212]" style={{ contain: 'layout style paint' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Semana</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    ${userStats.weekEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white">
                  <Calendar className="w-6 h-6 text-[#121212]" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_total') && (
            <div className="rounded-3xl p-4 lg:p-6 bg-[#121212]" style={{ contain: 'layout style paint' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Total</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    ${userStats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white">
                  <Wallet className="w-6 h-6 text-[#121212]" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_completed') && (
            <div className="rounded-3xl p-4 lg:p-6 bg-[#121212]" style={{ contain: 'layout style paint' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Completas
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    {userStats.totalTransactions}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white">
                  <CheckCircle2 className="w-6 h-6 text-[#121212]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenido principal - Ofertas */}
        {isVisible('offers_section') && (
          <Tabs defaultValue="offers" className="space-y-4">

            <TabsContent value="offers" className="space-y-4">
              <Card 
                className="rounded-3xl bg-[#121212]"
                style={{ contain: 'layout style' }}
              >
              <CardHeader className="pb-4">
                {/* Título */}
                <div className="mb-3">
                  <CardTitle className="font-bold text-white">
                    <span className="text-lg md:text-2xl">Microtareas disponibles hoy</span>
                  </CardTitle>
                </div>
                
                {/* Badge de ubicación */}
                <div className="flex">
                  {detectedCountry && detectedCountry !== '--' && detectedCountry !== 'GLOBAL' ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#1A1A1A] whitespace-nowrap">
                      <CountryFlag countryCode={detectedCountry} size="sm" />
                      <span className="text-white font-semibold text-[10px] md:text-xs">
                        {detectedCountry}
                      </span>
                      <span className="text-white/40 text-[10px] md:text-xs">•</span>
                      <span className="text-white/70 text-[10px] md:text-xs">
                        {currentDateTime.date}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#1A1A1A]">
                      <span className="text-white/50 text-[10px] md:text-xs">Detectando...</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoadingOffers ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">Cargando microtareas...</p>
                  </div>
                ) : (
                  <OffersListNew onDataUpdate={setCpaLeadData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}
