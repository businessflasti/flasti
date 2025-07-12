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
    <div className="w-full max-w-lg mx-auto px-2 md:px-0 py-10">
      <ConfettiCheck show={showConfetti} onClose={() => setShowConfetti(false)} message="¡Solicitud de retiro enviada!" />
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary"><path d="M12 3v18m0 0-4-4m4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Solicitar Retiro</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {pageLoading ? (
          <Skeleton className="h-72 w-full mb-6 rounded-2xl" />
        ) : (
          <Card className="p-0 overflow-hidden border-0 shadow-xl bg-[#18181b] relative">
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-primary/40 animate-pulse-slow" style={{zIndex:0, filter:'blur(1px)', opacity:0.15}}></div>
            <form onSubmit={handleWithdraw} className="flex flex-col gap-6 p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="text-lg font-semibold text-white">Saldo disponible</span>
                </div>
                <span className="text-2xl font-bold text-primary">${profile?.balance?.toFixed(2) ?? '0.00'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#b0b0b0] mb-1">Monto a retirar</label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Ej: 10.00"
                    className="bg-[#232323] border border-[#232323] focus:border-primary text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#b0b0b0] mb-1">Email de PayPal</label>
                  <Input
                    type="email"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="tu-email@paypal.com"
                    className="bg-[#232323] border border-[#232323] focus:border-primary text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#b0b0b0] mb-1">Método de retiro</label>
                <div className="flex gap-3">
                  <Button variant="primary" type="button" className="flex-1 flex items-center gap-2 bg-[#232323] border border-primary/40 text-primary font-semibold cursor-default py-5 min-h-[56px] text-base" disabled>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    PayPal <Badge color="success" className="ml-2">Disponible</Badge>
                  </Button>
                </div>
                <div className="text-xs text-[#b0b0b0] mt-1">No hay mínimo de retiro.</div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 text-lg font-bold py-3 rounded-xl bg-white text-[#101010] border border-[#e5e5e5] transition-all shadow-lg hover:bg-[#ec3f7c] hover:text-white hover:border-[#ec3f7c] focus:bg-[#ec3f7c] focus:text-white focus:border-[#ec3f7c]"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> Enviando...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 19V5m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Solicitar retiro
                  </span>
                )}
              </Button>
              <div className="text-xs text-[#b0b0b0] mt-2 text-center">El retiro se procesa en menos de 24 horas hábiles.</div>
            </form>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
