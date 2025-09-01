"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import CasinoDashboardPage from './casino-page';
import OffersListNew from '@/components/cpalead/OffersListNew';
import UserBalanceDisplay from '@/components/cpalead/UserBalanceDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Target, Gift, Globe, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import OnboardingSlider from '@/components/dashboard/OnboardingSlider';

// Importar estilos de animaciones
import "./animations.css";

interface UserStats {
  balance: number;
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  totalTransactions: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
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
      console.log('🔄 Solicitando ofertas desde:', url);
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setOffers(result.data);
        console.log(`✅ CPALead: Cargadas ${result.count} ofertas para ${result.requestedCountry || 'detección automática'}`);
        
        if (result.stats) {
          console.log('📊 Estadísticas de ofertas:', result.stats);
        }
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
        console.log('🌍 País detectado/cambiado, recargando ofertas para:', currentCountry);
        fetchOffers(true); // Force refresh
      }
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleCountryChange);
    
    // También verificar periódicamente si se detectó el país
    const countryCheckInterval = setInterval(() => {
      const currentCountry = localStorage.getItem('userCountry');
      if (currentCountry && currentCountry !== 'GLOBAL' && offers.length === 0) {
        console.log('🔄 País disponible, recargando ofertas...');
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

  // Actualizar elementos del DOM cuando cambien los datos de CPA Lead
  useEffect(() => {
    if (cpaLeadData) {
      // Actualizar elementos de escritorio
      const countryElement = document.getElementById('country-info');
      const refreshButton = document.getElementById('refresh-button') as HTMLButtonElement;
      
      // Actualizar elementos móviles
      const countryElementMobile = document.getElementById('country-info-mobile');
      const refreshButtonMobile = document.getElementById('refresh-button-mobile') as HTMLButtonElement;
      
      // Escritorio - país
      if (countryElement) {
        const spanElement = countryElement.querySelector('span');
        if (spanElement) {
          spanElement.textContent = `País: ${cpaLeadData.userCountry}`;
        }
      }
      
      // Móvil - país
      if (countryElementMobile) {
        const spanElement = countryElementMobile.querySelector('span');
        if (spanElement) {
          spanElement.textContent = cpaLeadData.userCountry;
        }
      }
      
      // Escritorio - botón
      if (refreshButton) {
        refreshButton.disabled = cpaLeadData.refreshing;
        const spanElement = refreshButton.querySelector('span');
        if (spanElement) {
          spanElement.textContent = cpaLeadData.refreshing ? 'Actualizando...' : 'Actualizar';
        }
        refreshButton.onclick = cpaLeadData.handleRefresh;
      }
      
      // Móvil - botón
      if (refreshButtonMobile) {
        refreshButtonMobile.disabled = cpaLeadData.refreshing;
        const spanElement = refreshButtonMobile.querySelector('span');
        if (spanElement) {
          spanElement.textContent = cpaLeadData.refreshing ? 'Actualizando...' : 'Actualizar';
        }
        refreshButtonMobile.onclick = cpaLeadData.handleRefresh;
      }
    }
  }, [cpaLeadData]);

  return (
    <div className="min-h-screen bg-[#101010]">
      {/* Container principal con mejor padding y max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Slider de onboarding colapsible */}
        <OnboardingSlider />

        {/* Contador de saldo en ancho completo */}
        {user?.id && (
          <div className="mb-8 lg:mb-12">
            <UserBalanceDisplay
              initialBalance={userStats.balance}
              userId={user.id}
              currency="USD"
              showControls={true}
            />
          </div>
        )}

        {/* Estadísticas mejoradas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <Card className="bg-[#232323] border-green-500/20 hover:bg-[#2a2a2a] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">
                    <span className="hidden md:inline">Ganancias de </span>Hoy
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    ${userStats.todayEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#000000' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#232323] border-blue-500/20 hover:bg-[#2a2a2a] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Esta Semana</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    ${userStats.weekEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#000000' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#232323] border-purple-500/20 hover:bg-[#2a2a2a] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Total Ganado</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    ${userStats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
                  <Target className="w-6 h-6" style={{ color: '#000000' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#232323] border-orange-500/20 hover:bg-[#2a2a2a] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">
                    <span className="md:hidden text-sm">Completas</span>
                    <span className="hidden md:inline text-sm">Completadas</span>
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    {userStats.totalTransactions}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
                  <Gift className="w-6 h-6" style={{ color: '#000000' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal con tabs mejorado */}
        <Tabs defaultValue="offers" className="space-y-8">


          <TabsContent value="offers" className="space-y-6">
            <Card className="bg-[#232323] border-white/10">
              <CardHeader className="pb-4">
                {/* Título */}
                <div className="mb-3">
                  <CardTitle className="font-bold text-white">
                    <span className="text-lg md:text-2xl">Microtareas asignadas para ti hoy</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-gray-400 mt-1">
                    Las tareas se actualizan automáticamente, revise periódicamente para acceder a nuevas oportunidades de ingresos
                  </CardDescription>
                </div>
                
                {/* Controles debajo del título */}
                <div className="flex items-center justify-between">
                  {/* Versión móvil - compacta */}
                  <div className="flex md:hidden items-center space-x-2 text-xs">
                    <div className="flex items-center space-x-1 text-gray-400" id="country-info-mobile">
                      <Globe className="w-3 h-3 text-white" />
                      <span className="text-xs">--</span>
                    </div>
                    {/* Contador de ofertas eliminado */}
                  </div>
                  
                  {/* Versión escritorio */}
                  <div className="hidden md:flex items-center space-x-4">
                    {/* País */}
                    <div className="flex items-center space-x-2 text-gray-400" id="country-info">
                      <Globe className="w-4 h-4 text-white" />
                      <span className="text-sm">País: --</span>
                    </div>
                    
                    {/* Contador de ofertas eliminado */}
                  </div>
                  
                  {/* Botones de actualizar */}
                  <div className="flex">
                    {/* Botón escritorio */}
                    <button 
                      id="refresh-button"
                      className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-xs bg-white text-black rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Actualizar</span>
                    </button>
                    
                    {/* Botón móvil */}
                    <button 
                      id="refresh-button-mobile"
                      className="flex md:hidden items-center space-x-1 px-2 py-1 text-xs bg-white text-black rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Actualizar</span>
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoadingOffers ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-600 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
                    </div>
                    <p className="text-gray-400 font-medium">Cargando microtareas...</p>
                  </div>
                ) : (
                  <OffersListNew onDataUpdate={setCpaLeadData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="bg-slate-800/30 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CasinoDashboardPage />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
