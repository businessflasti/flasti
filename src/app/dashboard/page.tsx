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
  const { isVisible, elements, isLoading } = useElementVisibility('dashboard');
  
  const [showFullPlayer, setShowFullPlayer] = useState(false);
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

  const [detectedCountry, setDetectedCountry] = useState<string>('--');
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

  // Detectar y guardar país del usuario
  useEffect(() => {
    const detectAndSaveCountry = async () => {
      if (!user) return;

      try {
        const savedCountry = localStorage.getItem('userCountry');
        if (savedCountry && savedCountry !== 'GLOBAL' && savedCountry !== '--') {
          setDetectedCountry(savedCountry);
        }

        const profilePromise = supabase
          .from('user_profiles')
          .select('country')
          .eq('user_id', user.id)
          .single();

        let countryCode = savedCountry && savedCountry !== 'GLOBAL' && savedCountry !== '--' ? savedCountry : null;
        
        if (!countryCode) {
          const detectCountry = async () => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000);
              
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

        const { data: profile } = await profilePromise;
        
        if (profile?.country && profile.country !== countryCode) {
          setDetectedCountry(profile.country);
          localStorage.setItem('userCountry', profile.country);
          countryCode = profile.country;
        }

        if (countryCode && (!profile?.country || profile.country !== countryCode)) {
          const deviceType = /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) 
            ? 'Mobile' 
            : /Tablet|iPad/i.test(navigator.userAgent)
            ? 'Tablet'
            : 'Desktop';

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

  // Actualizar fecha y hora
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];
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

  const getCountryName = (code: string) => {
    if (!code || code === '--' || code === 'GLOBAL') return '';
    try {
      const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
      return regionNames.of(code);
    } catch (e) {
      return '';
    }
  };

  const fetchOffers = async (forceRefresh = false) => {
    try {
      setIsLoadingOffers(true);
      const userCountry = localStorage.getItem('userCountry');
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

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingStats(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No hay sesión activa');
        return;
      }

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

    const channel = supabase
      .channel('tutorial_video_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tutorial_video' }, () => {
        loadTutorialVideo();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    fetchOffers();
    fetchUserStats();
  }, [user?.id]);

  useEffect(() => {
    const handleCountryChange = () => {
      const currentCountry = localStorage.getItem('userCountry');
      if (currentCountry && currentCountry !== 'GLOBAL') {
        fetchOffers(true);
      }
    };

    window.addEventListener('storage', handleCountryChange);
    const countryCheckInterval = setInterval(() => {
      const currentCountry = localStorage.getItem('userCountry');
      if (currentCountry && currentCountry !== 'GLOBAL' && offers.length === 0) {
        fetchOffers();
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleCountryChange);
      clearInterval(countryCheckInterval);
    };
  }, [offers.length]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${user.id}`
      }, () => { fetchUserStats(); })
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

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  useEffect(() => {
    if (cpaLeadData) {
      setDetectedCountry(cpaLeadData.userCountry);
    }
  }, [cpaLeadData]);


  return (
    <div 
      className="min-h-screen overscroll-none relative overflow-x-hidden"
      style={{ 
        background: '#F5F3F3'
      }}
    >
      {/* Container principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 pb-16 md:pb-8 relative z-10">

        {/* Balance móvil */}
        {user?.id && isVisible('balance_display') && (
          <div className="md:hidden mb-4">
            <UserBalanceDisplay
              initialBalance={userStats.balance}
              userId={user.id}
              currency="USD"
              showControls={true}
              variant="light"
            />
          </div>
        )}

        {/* Tutorial móvil */}
        {user?.id && isVisible('video_tutorial') && (
          <div className="md:hidden mb-4">
            <div 
              className="relative h-[200px] rounded-3xl overflow-hidden shadow-lg"
              style={{
                background: '#FFFFFF'
              }}
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
              
              {/* Filtro claro */}
              <div className="absolute inset-0 bg-white/60 z-[1]"></div>

              {/* Contenido */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#111827' }}>
                    {tutorialVideo.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    Aprende cómo funciona la plataforma
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {tutorialVideo.isClickable && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowFullPlayer(true)}
                        className="rounded-full overflow-hidden flex items-stretch gap-0 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <span className="pl-5 pr-3 py-2.5 bg-white text-gray-900 font-bold flex items-center">
                          Ver video
                        </span>
                        <div className="pr-5 pl-3 flex items-center justify-center" style={{ backgroundColor: '#111827' }}>
                          <svg className="w-5 h-5" fill="#FFFFFF" viewBox="0 0 24 24">
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
                <div className="absolute inset-0 z-20 bg-black rounded-3xl">
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
            </div>
          </div>
        )}

        {/* Layout Desktop: Balance y Video Tutorial */}
        {user?.id && (
          <div className="hidden md:grid md:grid-cols-[4fr_13fr] gap-4 mb-4 lg:mb-6">
            {/* Balance */}
            <div className="h-[380px]">
              <UserBalanceDisplay
                initialBalance={userStats.balance}
                userId={user.id}
                currency="USD"
                showControls={true}
                variant="light"
              />
            </div>

            {/* Video Tutorial */}
            <div className="h-[380px]">
              <div 
                className="relative h-full rounded-3xl overflow-hidden shadow-lg"
                style={{
                  background: '#FFFFFF'
                }}
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
                
                {/* Filtro claro */}
                <div className="absolute inset-0 bg-white/60 z-[1]"></div>

                {/* Contenido */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#111827' }}>
                      {tutorialVideo.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                      Aprende cómo funciona la plataforma
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {tutorialVideo.isClickable && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setShowFullPlayer(true)}
                          className="rounded-full overflow-hidden flex items-stretch gap-0 shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <span className="pl-5 pr-3 py-2.5 bg-white text-gray-900 font-bold flex items-center">
                            Ver video
                          </span>
                          <div className="pr-5 pl-3 flex items-center justify-center" style={{ backgroundColor: '#111827' }}>
                            <svg className="w-5 h-5" fill="#FFFFFF" viewBox="0 0 24 24">
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
                  <div className="absolute inset-0 z-20 bg-black rounded-3xl">
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
              </div>
            </div>
          </div>
        )}


        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6" style={{ contain: 'layout style' }}>
          {isVisible('stat_today') && (
            <div 
              className="rounded-3xl p-4 lg:p-6 shadow-sm"
              style={{ background: '#FFFFFF' }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoy
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    ${userStats.todayEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_week') && (
            <div 
              className="rounded-3xl p-4 lg:p-6 shadow-sm"
              style={{ background: '#FFFFFF' }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Semana</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    ${userStats.weekEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_total') && (
            <div 
              className="rounded-3xl p-4 lg:p-6 shadow-sm"
              style={{ background: '#FFFFFF' }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    ${userStats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_completed') && (
            <div 
              className="rounded-3xl p-4 lg:p-6 shadow-sm"
              style={{ background: '#FFFFFF' }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completas
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {userStats.totalTransactions}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenido principal - Ofertas */}
        {isVisible('offers_section') && (
          <Tabs defaultValue="offers" className="space-y-4">
            <TabsContent value="offers" className="space-y-4">
              <div 
                className="rounded-3xl overflow-hidden shadow-sm"
                style={{ background: '#FFFFFF' }}
              >
                <div className="p-6 pb-4">
                  {/* Título */}
                  <div className="mb-3">
                    <h2 className="font-bold">
                      <span className="text-lg md:text-2xl" style={{ color: '#111827' }}>Área de trabajo</span>
                    </h2>
                  </div>
                  
                  {/* Badge de ubicación */}
                  <div className="flex">
                    {detectedCountry && detectedCountry !== '--' && detectedCountry !== 'GLOBAL' ? (
                      <div 
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap shadow-sm"
                        style={{
                          background: '#F3F3F3'
                        }}
                      >
                        <CountryFlag countryCode={detectedCountry} size="sm" />
                        <span className="text-gray-800 font-semibold text-[10px] md:text-xs">
                          {detectedCountry}
                        </span>
                        <span className="text-gray-400 text-[10px] md:text-xs">•</span>
                        <span className="text-gray-600 text-[10px] md:text-xs">
                          {currentDateTime.date}
                        </span>
                      </div>
                    ) : (
                      <div 
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full"
                        style={{
                          background: '#F3F3F3'
                        }}
                      >
                        <span className="text-gray-500 text-[10px] md:text-xs">Detectando...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  {isLoadingOffers ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0, 0, 0, 0.1)', borderTopColor: '#0D50A4' }}></div>
                    </div>
                  ) : (
                    <OffersListNew onDataUpdate={setCpaLeadData} variant="light" />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
