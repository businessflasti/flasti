"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import TasksList from '@/components/dashboard/TasksList';
import UserBalanceDisplay from '@/components/dashboard/UserBalanceDisplay';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, Wallet, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useElementVisibility } from '@/hooks/useElementVisibility';
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
  const { isVisible } = useElementVisibility('dashboard');
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  
  const [userStats, setUserStats] = useState<UserStats>({
    balance: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    totalTransactions: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingStats(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) return;

      const { profile, cpalead_stats } = data;
      setUserStats({
        balance: profile.balance || 0,
        totalEarnings: cpalead_stats.total_earnings || 0,
        todayEarnings: cpalead_stats.today_earnings || 0,
        weekEarnings: cpalead_stats.week_earnings || 0,
        totalTransactions: cpalead_stats.total_transactions || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user?.id || onboardingChecked) return;
      
      const localCompleted = localStorage.getItem('onboarding_completed');
      if (localCompleted === 'true') {
        setOnboardingChecked(true);
        return;
      }
      
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
    fetchUserStats();
  }, [user?.id]);

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
    <div className="min-h-screen overscroll-none relative overflow-x-hidden" style={{ background: '#F5F3F3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 pb-16 md:pb-8 relative z-10">

        {/* Balance móvil */}
        {user?.id && isVisible('balance_display') && (
          <div className="md:hidden mb-4" data-tour="balance">
            <UserBalanceDisplay initialBalance={userStats.balance} userId={user.id} currency="USD" showControls={true} variant="light" />
          </div>
        )}

        {/* Bienvenida móvil */}
        {user?.id && isVisible('video_tutorial') && (
          <div className="md:hidden mb-4">
            <div className="relative h-[200px] rounded-3xl overflow-hidden shadow-lg" style={{ background: '#FFFFFF' }}>
              <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <img src="/images/tutorial.webp" alt="Infraestructura global" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'rgba(32, 32, 32, 0.75)' }}></div>
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#F6F3F3' }}>Infraestructura global</h3>
                  <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Respaldando la seguridad operativa y el procesamiento de flujos de trabajo a gran escala.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout Desktop */}
        {user?.id && (
          <div className="hidden md:grid md:grid-cols-[4fr_13fr] gap-4 mb-4 lg:mb-6">
            <div className="flex flex-col gap-4 h-[380px]">
              <div data-tour="balance">
                <UserBalanceDisplay initialBalance={userStats.balance} userId={user.id} currency="USD" showControls={true} variant="light" />
              </div>
              
              {/* Ranking semanal */}
              <div className="rounded-3xl p-4 shadow-sm flex-1 overflow-hidden" style={{ background: '#FFFFFF' }}>
                <div className="mb-3">
                  <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Líderes en ingresos</h3>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Miembros con mayor rendimiento esta semana</p>
                </div>
                
                <div className="space-y-2">
                  {/* Usuario 1 */}
                  <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: '#F3F3F3' }}>
                    <div className="relative">
                      <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#F1BF44' }}>1</div>
                      <img src="/images/ranking-avatars/ranking1.jpg" alt="Alejandro Torres" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate" style={{ color: '#111827' }}>Alejandro Torres</p>
                      <p className="flex items-center gap-1" style={{ color: '#111827' }}>
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-xs">$647</span>
                        <span className="text-[10px]" style={{ color: '#6B7280' }}>USD</span>
                      </p>
                    </div>
                    <img src="/images/ranking-avatars/colombia.webp" alt="Colombia" className="w-6 h-6 rounded-full object-cover" />
                  </div>
                  
                  {/* Usuario 2 */}
                  <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: '#F3F3F3' }}>
                    <div className="relative">
                      <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#B7BCC5' }}>2</div>
                      <img src="/images/ranking-avatars/ranking2.jpg" alt="Laura Herrera" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate" style={{ color: '#111827' }}>Laura Herrera</p>
                      <p className="flex items-center gap-1" style={{ color: '#111827' }}>
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-xs">$479</span>
                        <span className="text-[10px]" style={{ color: '#6B7280' }}>USD</span>
                      </p>
                    </div>
                    <img src="/images/ranking-avatars/espana.webp" alt="España" className="w-6 h-6 rounded-full object-cover" />
                  </div>
                  
                  {/* Usuario 3 */}
                  <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: '#F3F3F3' }}>
                    <div className="relative">
                      <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#F1813A' }}>3</div>
                      <img src="/images/ranking-avatars/ranking3.jpg" alt="Daniel Ramírez" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate" style={{ color: '#111827' }}>Daniel Ramírez</p>
                      <p className="flex items-center gap-1" style={{ color: '#111827' }}>
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-xs">$312</span>
                        <span className="text-[10px]" style={{ color: '#6B7280' }}>USD</span>
                      </p>
                    </div>
                    <img src="/images/ranking-avatars/argentina.webp" alt="Argentina" className="w-6 h-6 rounded-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[380px]">
              <div className="relative h-full rounded-3xl overflow-hidden shadow-lg" style={{ background: '#FFFFFF' }}>
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                  <img src="/images/tutorial.webp" alt="Infraestructura global" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'rgba(32, 32, 32, 0.75)' }}></div>
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#F6F3F3' }}>Infraestructura global</h3>
                    <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Respaldando la seguridad operativa y el procesamiento de flujos de trabajo a gran escala.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6" data-tour="stats">
          {isVisible('stat_today') && (
            <div className="rounded-3xl p-4 lg:p-6 shadow-sm" style={{ background: '#FFFFFF' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hoy</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">${userStats.todayEarnings.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_week') && (
            <div className="rounded-3xl p-4 lg:p-6 shadow-sm" style={{ background: '#FFFFFF' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Semana</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">${userStats.weekEarnings.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_total') && (
            <div className="rounded-3xl p-4 lg:p-6 shadow-sm" style={{ background: '#FFFFFF' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">${userStats.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}

          {isVisible('stat_completed') && (
            <div className="rounded-3xl p-4 lg:p-6 shadow-sm" style={{ background: '#FFFFFF' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Completas</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{userStats.totalTransactions}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0C50A4' }}>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ranking móvil - después de estadísticas */}
        {user?.id && (
          <div className="md:hidden mb-4">
            <div className="rounded-3xl p-4 shadow-sm" style={{ background: '#FFFFFF' }}>
              <div className="mb-3">
                <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Líderes en ingresos</h3>
                <p className="text-xs" style={{ color: '#6B7280' }}>Miembros con mayor rendimiento esta semana</p>
              </div>
              
              <div className="space-y-2">
                {/* Usuario 1 */}
                <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: '#F3F3F3' }}>
                  <div className="relative">
                    <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#F1BF44' }}>1</div>
                    <img src="/images/ranking-avatars/ranking1.jpg" alt="Alejandro Torres" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs truncate" style={{ color: '#111827' }}>Alejandro Torres</p>
                    <p className="flex items-center gap-1" style={{ color: '#111827' }}>
                      <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-bold text-xs">$647</span>
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>USD</span>
                    </p>
                  </div>
                  <img src="/images/ranking-avatars/colombia.webp" alt="Colombia" className="w-6 h-6 rounded-full object-cover" />
                </div>
                
                {/* Usuario 2 */}
                <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: '#F3F3F3' }}>
                  <div className="relative">
                    <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#B7BCC5' }}>2</div>
                    <img src="/images/ranking-avatars/ranking2.jpg" alt="Laura Herrera" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs truncate" style={{ color: '#111827' }}>Laura Herrera</p>
                    <p className="flex items-center gap-1" style={{ color: '#111827' }}>
                      <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-bold text-xs">$479</span>
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>USD</span>
                    </p>
                  </div>
                  <img src="/images/ranking-avatars/espana.webp" alt="España" className="w-6 h-6 rounded-full object-cover" />
                </div>
                
                {/* Usuario 3 */}
                <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: '#F3F3F3' }}>
                  <div className="relative">
                    <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#F1813A' }}>3</div>
                    <img src="/images/ranking-avatars/ranking3.jpg" alt="Daniel Ramírez" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs truncate" style={{ color: '#111827' }}>Daniel Ramírez</p>
                    <p className="flex items-center gap-1" style={{ color: '#111827' }}>
                      <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-bold text-xs">$312</span>
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>USD</span>
                    </p>
                  </div>
                  <img src="/images/ranking-avatars/argentina.webp" alt="Argentina" className="w-6 h-6 rounded-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal - Tareas */}
        {isVisible('offers_section') && (
          <Tabs defaultValue="offers" className="space-y-4">
            <TabsContent value="offers" className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-sm" style={{ background: '#FFFFFF' }} data-tour="work-area">
                <div className="p-6 pb-4">
                  <div className="mb-3">
                    <h2 className="font-bold">
                      <span className="text-lg md:text-2xl" style={{ color: '#111827' }}>Área de trabajo</span>
                    </h2>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <TasksList variant="light" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {showOnboarding && user?.id && (
        <OnboardingTour userId={user.id} onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
