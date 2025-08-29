"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserBalanceDisplayProps {
  initialBalance: number;
  userId: string;
  currency?: string;
  showControls?: boolean;
}

interface BalanceStats {
  balance: number;
  totalEarnings: number;
  todayEarnings: number;
  lastUpdated: string;
}

const UserBalanceDisplay: React.FC<UserBalanceDisplayProps> = ({ 
  initialBalance, 
  userId, 
  currency = 'USD',
  showControls = true 
}) => {
  const [balance, setBalance] = useState(initialBalance);
  const [balanceStats, setBalanceStats] = useState<BalanceStats>({
    balance: initialBalance,
    totalEarnings: 0,
    todayEarnings: 0,
    lastUpdated: new Date().toISOString()
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Obtener estadísticas detalladas del saldo
  const fetchBalanceStats = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Obtener el token de sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Sesión expirada, por favor inicia sesión nuevamente');
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
        toast.error('Error al obtener el perfil de usuario');
        return;
      }

      const { profile, cpalead_stats } = data;

      // Actualizar estado
      const newStats: BalanceStats = {
        balance: profile.balance || 0,
        totalEarnings: cpalead_stats.total_earnings || 0,
        todayEarnings: cpalead_stats.today_earnings || 0,
        lastUpdated: profile.updated_at || new Date().toISOString()
      };

      setBalanceStats(newStats);
      setBalance(newStats.balance);
      setLastRefresh(new Date());

    } catch (error) {
      console.error('Error fetching balance stats:', error);
      toast.error('Error al actualizar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  // Configurar suscripción en tiempo real para cambios de saldo
  useEffect(() => {
    if (!userId) return;

    // Suscribirse a cambios en el perfil del usuario
    const profileChannel = supabase
      .channel('user_balance_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        if (payload.new && 'balance' in payload.new) {
          const newBalance = payload.new.balance as number;
          setBalance(newBalance);
          setBalanceStats(prev => ({
            ...prev,
            balance: newBalance,
            lastUpdated: payload.new.updated_at || new Date().toISOString()
          }));
          
          // Mostrar notificación de cambio de saldo
          if (newBalance > balance) {
            toast.success(`¡Saldo actualizado! +${formatCurrency(newBalance - balance)}`);
          }
        }
      })
      .subscribe();

    // Suscribirse a nuevas transacciones de CPALead
    const transactionChannel = supabase
      .channel('cpalead_transactions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'cpalead_transactions',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        if (payload.new) {
          // Actualizar estadísticas cuando hay una nueva transacción
          fetchBalanceStats();
        }
      })
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(transactionChannel);
    };
  }, [userId, balance]);

  // Actualizar estadísticas al montar el componente
  useEffect(() => {
    fetchBalanceStats();
  }, [userId]);

  // Manejar actualización manual
  const handleRefresh = async (): Promise<void> => {
    await fetchBalanceStats();
    toast.success('Saldo actualizado');
  };

  return (
    <TooltipProvider>
      <Card className="bg-[#232323] border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
                <DollarSign className="w-5 h-5 text-[#101010]" />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tu Saldo
                  </span>
                  {balanceStats.todayEarnings > 0 && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Hoy: {formatCurrency(balanceStats.todayEarnings)}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isVisible ? (
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(balance)}
                    </span>
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">
                      ••••••
                    </span>
                  )}
                  
                  {isLoading && (
                    <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
            </div>

            {showControls && (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsVisible(!isVisible)}
                      className="h-8 w-8 p-0 hover:bg-white hover:text-black transition-colors"
                    >
                      {isVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 hover:bg-white hover:text-black transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Actualizar saldo
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Información adicional */}
          {isVisible && (
            <div className="mt-3 pt-3 border-t border-primary/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Total ganado: {formatCurrency(balanceStats.totalEarnings)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>En vivo</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default UserBalanceDisplay;