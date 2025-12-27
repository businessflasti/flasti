'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCardsGridSkeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DollarSign, CreditCard, AlertCircle, CheckCircle, Landmark, ArrowRightLeft, Wallet, Check } from 'lucide-react';
import PayPalIcon from '@/components/icons/PayPalIcon';
import Image from 'next/image';

interface UserBalance {
  balance: number;
  total_earnings: number;
  total_withdrawals: number;
}

// Componente de animación de éxito para retiro
const WithdrawalSuccessAnimation: React.FC<{ amount: number; onComplete: () => void }> = ({ amount, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-sm"
      >
        {/* Partículas de celebración */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: '50%',
                y: '50%'
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
                x: `${50 + (Math.random() - 0.5) * 150}%`,
                y: `${50 + (Math.random() - 0.5) * 150}%`
              }}
              transition={{ 
                duration: 1.5,
                delay: 0.3 + i * 0.05,
                ease: 'easeOut'
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: i % 2 === 0 ? '#0D50A4' : '#10B981' }}
            />
          ))}
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl text-center">
          {/* Header */}
          <div className="pt-10 pb-6 px-6">
            {/* Círculo con logo PayPal */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
              className="relative mx-auto mb-6 w-28 h-28"
            >
              {/* Círculo con logo */}
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F2F2F2' }}
              >
                <Image
                  src="/images/paypal.png"
                  alt="PayPal"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>

              {/* Check de confirmación */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.5 }}
                className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#10B981' }}
              >
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>

            {/* Título */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold mb-2"
              style={{ color: '#111827' }}
            >
              ¡Retiro Exitoso!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 text-sm"
            >
              Tu solicitud está siendo procesada
            </motion.p>
          </div>

          {/* Monto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', damping: 15 }}
            className="py-6 mx-6 rounded-2xl mb-6"
            style={{ backgroundColor: '#F0FDF4' }}
          >
            <p className="text-sm text-gray-500 mb-1">Monto del retiro</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-4xl font-bold" style={{ color: '#10B981' }}>
                ${amount.toFixed(2)}
              </span>
              <span className="text-lg font-medium text-gray-400">USD</span>
            </div>
          </motion.div>

          {/* Info de tiempo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="px-6 pb-8"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Acreditación en las próximas 24hs</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function WithdrawalsPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
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
    
    // Validación de mínimo $5 USD
    if (Number(amount) < 5) {
      toast.error('Retiro disponible desde $5.00 USD');
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
        setWithdrawnAmount(Number(amount));
        setShowSuccess(true);
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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style',
        backfaceVisibility: 'hidden',
        background: '#F6F3F3'
      }}
    >
      {/* Animación de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <WithdrawalSuccessAnimation 
            amount={withdrawnAmount} 
            onComplete={() => setShowSuccess(false)} 
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-16 md:pb-8 space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#111827' }}>Solicitar Retiro</h1>
      </div>

      {/* Información del saldo */}
      {pageLoading ? (
        <div className="mb-6">
          <StatsCardsGridSkeleton variant="light" columns={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="rounded-3xl border-0 shadow-sm" style={{ background: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ background: '#0D50A4' }}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saldo Disponible</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {formatCurrency(userBalance.balance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm" style={{ background: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ background: '#0D50A4' }}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Ganado</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {formatCurrency(userBalance.total_earnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm" style={{ background: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ background: '#0D50A4' }}>
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Retirado</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
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
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0, 0, 0, 0.1)', borderTopColor: '#0D50A4' }}></div>
          </div>
        ) : (
          <div className="rounded-3xl border-0 shadow-sm" style={{ background: '#FFFFFF' }}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#111827' }}>
                <ArrowRightLeft className="w-5 h-5" />
                Elige tu método de retiro
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleWithdraw} className="space-y-6">
                {/* Información importante */}
                <div className="rounded-lg p-4" style={{ background: '#F3F3F3' }}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#0D50A4' }} />
                    <div>
                      <h4 className="font-medium mb-1" style={{ color: '#0D50A4' }}>Información importante</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Los retiros se procesan en 48 horas hábiles</li>
                        <li>• Asegúrate de que el email de PayPal coincida con el registrado en Flasti</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                      Monto a retirar
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Introduce tu monto"
                      className="border-0 focus:ring-0"
                      style={{ background: '#F3F3F3', color: '#111827' }}
                    />
                    <p className="text-xs mt-1" style={{ color: '#0D50A4' }}>
                      Mínimo: $5.00 USD
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                      Email de PayPal
                    </label>
                    <Input
                      type="email"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      placeholder="Introduce tu email"
                      className="border-0 focus:ring-0"
                      style={{ background: '#F3F3F3', color: '#111827' }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Debe ser un email válido de PayPal
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                    Método de retiro
                  </label>
                  <div className="space-y-3">
                    <div className="flex-1 flex items-center gap-3 p-4 rounded-lg" style={{ background: '#F3F3F3' }}>
                      <Image src="/images/paypaliso.webp" alt="PayPal" width={20} height={20} className="w-5 h-5 object-contain" />
                      <span className="font-medium" style={{ color: '#111827' }}>PayPal</span>
                      <Badge className="ml-auto bg-green-100 text-green-600 border-green-200">
                        Disponible
                      </Badge>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3 p-4 rounded-lg opacity-60 cursor-not-allowed" style={{ background: '#F3F3F3' }}>
                      <Landmark className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-400 block">Transferencia Bancaria</span>
                        <p className="text-xs text-gray-500 mt-1">
                          Completa mínimo 5 microtareas para desbloquear retiros en tu moneda local
                        </p>
                      </div>
                      <Badge className="ml-auto bg-gray-100 text-gray-500 border-gray-200">
                        Pendiente
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || userBalance.balance <= 0}
                  className="w-full text-white hover:opacity-90"
                  style={{ background: '#0D50A4' }}
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
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
