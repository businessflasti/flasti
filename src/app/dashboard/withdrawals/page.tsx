'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ConfettiCheck } from '@/components/ui/confetti-check';

export default function WithdrawalsPage() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showToast('Ingresa un monto válido.', 'error');
      return;
    }
    if (!destination) {
      showToast('Debes ingresar el email de PayPal.', 'error');
      return;
    }
    if (Number(amount) > Number(profile?.balance ?? 0)) {
      showToast('Saldo insuficiente.', 'error');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user?.id, amount, method: 'PayPal', destination })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Solicitud de retiro enviada correctamente.', 'success');
      setAmount('');
      setDestination('');
      setShowConfetti(true);
    } else {
      showToast(data.error || 'Error al solicitar el retiro.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 md:px-0 py-8">
      <ConfettiCheck show={showConfetti} onClose={() => setShowConfetti(false)} message="¡Solicitud de retiro enviada!" />
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-6 text-white">Solicitar Retiro</h1>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {pageLoading ? (
          <Skeleton className="h-64 w-full mb-6" />
        ) : (
          <Card>
            <form onSubmit={handleWithdraw} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-[#b0b0b0] mb-1">Monto a retirar</label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Ej: 10.00"
                />
              </div>
              <div>
                <label className="block text-sm text-[#b0b0b0] mb-1">Método</label>
                <div className="flex gap-3">
                  <Button variant="primary" type="button" className="flex-1" disabled>
                    PayPal <Badge color="success" className="ml-2">Disponible</Badge>
                  </Button>
                  <Button variant="secondary" type="button" className="flex-1 opacity-60 cursor-not-allowed" disabled>
                    Cuenta bancaria <Badge color="danger" className="ml-2">Próximamente</Badge>
                  </Button>
                </div>
                <div className="text-xs text-[#b0b0b0] mt-1">No hay mínimo de retiro.</div>
              </div>
              <div>
                <label className="block text-sm text-[#b0b0b0] mb-1">Email de PayPal</label>
                <Input
                  type="email"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="tu-email@paypal.com"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? 'Enviando...' : 'Solicitar retiro'}
              </Button>
            </form>
            <div className="mt-6 text-[#b0b0b0] text-sm">
              Saldo disponible: <span className="font-bold text-white">${profile?.balance?.toFixed(2) ?? '0.00'}</span>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
