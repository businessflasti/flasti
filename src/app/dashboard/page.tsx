"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import CasinoDashboardPage from './casino-page';
import OffersList from '@/components/cpalead/OffersList';
import UserBalanceDisplay from '@/components/cpalead/UserBalanceDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Target, Gift } from 'lucide-react';
import { toast } from 'sonner';

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

  // Obtener ofertas de CPALead
  const fetchOffers = async () => {
    try {
      setIsLoadingOffers(true);
      
      const response = await fetch('/api/cpalead/offers');
      const result = await response.json();
      
      if (result.success) {
        setOffers(result.data);
        console.log(`CPALead: Cargadas ${result.count} ofertas`);
      } else {
        console.error('Error fetching CPALead offers:', result.message);
        toast.error('Error al cargar las ofertas');
        setOffers([]);
      }
    } catch (error) {
      console.error('Error fetching CPALead offers:', error);
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

  return (
    <div className="min-h-screen bg-[#101010]">
      {/* Container principal con mejor padding y max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        


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
                    <span className="md:hidden">Completas</span>
                    <span className="hidden md:inline">Completadas</span>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-bold text-white">
                      <span className="md:hidden text-lg">Microtareas asignadas</span>
                      <span className="hidden md:inline text-2xl">Microtareas asignadas para ti hoy</span>
                    </CardTitle>
                  </div>
                  {!isLoadingOffers && offers.length > 0 && (
                    <Badge className="px-3 py-1.5 text-xs sm:px-2 sm:py-1 sm:text-sm min-w-[90px] sm:min-w-0 text-center sm:text-left border-0" style={{ backgroundColor: 'white', color: '#000000' }}>
                      {offers.length} disponibles
                    </Badge>
                  )}
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
                  <OffersList offers={offers} />
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
