"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import OffersListNew from '@/components/cpalead/OffersListNew';
import UserBalanceDisplay from '@/components/cpalead/UserBalanceDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Gift, Wallet, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useElementVisibility } from '@/hooks/useElementVisibility';
import PremiumServicesSlider from '@/components/premium/PremiumServicesSlider';
import OnboardingTour from '@/components/onboarding/OnboardingTour';

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
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  
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

  // Check if user needs onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user?.id || onboardingChecked) return;
      
      // Check localStorage first for quick response
      const localCompleted = localStorage.getItem('onboarding_completed');
      if (localCompleted === 'true') {
        setOnboardingChecked(true);
        return;
      }
      
      // Check database
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          if (data.onboarding_completed) {
            localStorage.setItem('onboarding_completed', 'true');
          } else {
            setShowOnboarding(true);
          }
        } else {
          // If no record or error, show onboarding for new users
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      }
      
      setOnboardingChecked(true);
    };
    
    checkOnboarding();
  }, [user?.id, onboardingChecked]);

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
          <div className="md:hidden mb-4" data-tour="balance">
            <UserBalanceDisplay
              initialBalance={userStats.balance}
              userId={user.id}
              currency="USD"
              showControls={true}
              variant="light"
            />
          </div>
        )}

        {/* Bienvenida móvil */}
        {user?.id && isVisible('video_tutorial') && (
          <div className="md:hidden mb-4">
            <div 
              className="relative h-[200px] rounded-3xl overflow-hidden shadow-lg"
              style={{ background: '#FFFFFF' }}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <img src="/images/tutorial.webp" alt="Bienvenido" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-white/60 z-[1]"></div>
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#111827' }}>Bienvenido a flasti</h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Tu plataforma de microtareas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout Desktop: Balance y Bienvenida */}
        {user?.id && (
          <div className="hidden md:grid md:grid-cols-[4fr_13fr] gap-4 mb-4 lg:mb-6">
            <div className="self-start" data-tour="balance">
              <UserBalanceDisplay
                initialBalance={userStats.balance}
                userId={user.id}
                currency="USD"
                showControls={true}
                variant="light"
              />
            </div>
            <div className="h-[380px]">
              <div className="relative h-full rounded-3xl overflow-hidden shadow-lg" style={{ background: '#FFFFFF' }}>
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                  <img src="/images/tutorial.webp" alt="Bienvenido" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-white/60 z-[1]"></div>
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#111827' }}>Bienvenido a flasti</h3>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Tu plataforma de microtareas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6" style={{ contain: 'layout style' }} data-tour="stats">
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
                data-tour="work-area"
              >
                <div className="p-6 pb-4">
                  {/* Título */}
                  <div className="mb-3">
                    <h2 className="font-bold">
                      <span className="text-lg md:text-2xl" style={{ color: '#111827' }}>Área de trabajo</span>
                    </h2>
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

      {/* Onboarding Tour for new users */}
      {showOnboarding && user?.id && (
        <OnboardingTour 
          userId={user.id} 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}
    </div>
  );
}
