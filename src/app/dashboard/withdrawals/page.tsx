'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DollarSign, CreditCard, AlertCircle, CheckCircle, Landmark, ArrowRightLeft, Wallet } from 'lucide-react';
import PayPalIcon from '@/components/icons/PayPalIcon';

interface UserBalance {
  balance: number;
  total_earnings: number;
  total_withdrawals: number;
}

export default function WithdrawalsPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [userBalance, setUserBalance] = useState<UserBalance>({
    balance: 0,
    total_earnings: 0,
    total_withdrawals: 0
  });

  // Obtener saldo del usuario desde CPALead
  const fetchUserBalance = async () => {
    if (!user?.id) {
      setPageLoading(false);
      return;
    }

    try {
      setPageLoading(true);
      
      // Timeout para evitar loading infinito
      const timeoutId = setTimeout(() => {
        console.warn('Timeout al cargar saldo, usando datos por defecto');
        setUserBalance({
          balance: 0,
          total_earnings: 0,
          total_withdrawals: 0
        });
        setPageLoading(false);
      }, 10000); // 10 segundos timeout

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Sesión expirada, por favor inicia sesión nuevamente');
        clearTimeout(timeoutId);
        setPageLoading(false);
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
        setUserBalance({
          balance: 0,
          total_earnings: 0,
          total_withdrawals: 0
        });
      } else {
        setUserBalance({
          balance: data.profile.balance || 0,
          total_earnings: data.profile.total_earnings || 0,
          total_withdrawals: data.profile.total_withdrawals || 0
        });
      }
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setUserBalance({
        balance: 0,
        total_earnings: 0,
        total_withdrawals: 0
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, [user?.id]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Ingresa un monto válido.');
      return;
    }
    
    // Validación de mínimo $1 USD
    if (Number(amount) < 1) {
      toast.error('No puedes retirar menos del mínimo permitido. Debes alcanzar al menos $1.00 USD para solicitar un retiro.');
      return;
    }
    
    if (!destination || !destination.includes('@')) {
      toast.error('Debes ingresar un email de PayPal válido.');
      return;
    }
    
    if (Number(amount) > userBalance.balance) {
      toast.error(`Saldo insuficiente. Disponible: $${userBalance.balance.toFixed(2)}`);
      return;
    }

    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Sesión expirada, por favor inicia sesión nuevamente');
        return;
      }

      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          user_id: user?.id, 
          amount: Number(amount), 
          method: 'PayPal', 
          destination 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('¡Solicitud de retiro enviada correctamente!');
        setAmount('');
        setDestination('');
        // Actualizar saldo
        fetchUserBalance();
      } else {
        toast.error(data.error || 'Error al solicitar el retiro.');
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error('Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-16 md:pb-8 space-y-6 relative z-10">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Solicitar Retiro</h1>
      </div>

      {/* Información del saldo */}
      {!pageLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card 
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl transition-opacity duration-300 relative"
            style={{ 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transform: 'translate3d(0, 0, 0)',
              contain: 'layout style paint'
            }}
          >
            {/* Brillo superior glassmorphism */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 transition-opacity duration-300 border border-green-300/20">
                  <DollarSign className="w-5 h-5 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <p className="text-sm text-white/80">Saldo Disponible</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(userBalance.balance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl transition-opacity duration-300 relative"
            style={{ 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transform: 'translate3d(0, 0, 0)',
              contain: 'layout style paint'
            }}
          >
            {/* Brillo superior glassmorphism */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 transition-opacity duration-300 border border-blue-300/20">
                  <CheckCircle className="w-5 h-5 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <p className="text-sm text-white/80">Total Ganado</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(userBalance.total_earnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl transition-opacity duration-300 relative"
            style={{ 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transform: 'translate3d(0, 0, 0)',
              contain: 'layout style paint'
            }}
          >
            {/* Brillo superior glassmorphism */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 transition-opacity duration-300 border border-purple-300/20">
                  <CreditCard className="w-5 h-5 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <p className="text-sm text-white/80">Total Retirado</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(userBalance.total_withdrawals)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Formulario de retiro */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {pageLoading ? (
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
            <p className="text-gray-400 font-medium">Cargando métodos de retiro...</p>
          </div>
        ) : (
          <div 
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl relative"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Brillo superior glassmorphism */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Elige tu método de retiro
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleWithdraw} className="space-y-6">
                {/* Información importante */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-400 mb-1">Información importante</h4>
                      <ul className="text-sm text-blue-300 space-y-1">
                        <li>• Los retiros se procesan en 24 horas hábiles</li>
                        <li>• Asegúrate de que el email de PayPal coincida con el registrado en Flasti</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Monto a retirar
                    </label>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      max={userBalance.balance}
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Introduce tu monto"
                      className="bg-background border-border focus:border-primary"
                    />
                    <p className="text-xs text-blue-400/80 mt-1">
                      Mínimo: $1.00 USD
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email de PayPal
                    </label>
                    <Input
                      type="email"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      placeholder="Introduce tu email"
                      className="bg-background border-border focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Debe ser un email válido de PayPal
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Método de retiro
                  </label>
                  <div className="space-y-3">
                    <div className="flex-1 flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <PayPalIcon className="w-5 h-5 text-white" />
                      <span className="font-medium text-white">PayPal</span>
                      <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                        Disponible
                      </Badge>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3 p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg opacity-60 cursor-not-allowed">
                      <Landmark className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-400 block">Transferencia Bancaria</span>
                        <p className="text-xs text-gray-500 mt-1">
                          Completa mínimo 5 microtareas para desbloquear retiros en tu moneda local
                        </p>
                      </div>
                      <Badge className="ml-auto bg-gray-500/20 text-gray-400 border-gray-500/30">
                        Pendiente
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || userBalance.balance <= 0}
                  className="w-full bg-white hover:bg-white/90 text-[#101010]"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-[#101010] border-t-transparent rounded-full"></span>
                      Procesando...
                    </span>
                  ) : (
                    <span>
                      Solicitar Retiro
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
}
