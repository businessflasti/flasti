"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function BalanceCard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Función para iniciar retiro
  const handleWithdraw = () => {
    if (!profile || (profile.balance || 0) <= 0) {
      toast.error(t('balanceInsuficiente'));
      return;
    }

    if ((profile.balance || 0) < 20) {
      toast.error(t('montoMinimoRetiro', { amount: '20' }));
      return;
    }

    setIsWithdrawing(true);
    
    // Simular proceso de retiro
    setTimeout(() => {
      toast.success(t('solicitudRetiroExitosa'));
      setIsWithdrawing(false);
    }, 1500);
  };

  return (
    <Card className="glass-effect p-6 relative overflow-hidden hardware-accelerated hover-lift">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ec4899]/10 rounded-full blur-3xl -mr-10 -mt-10 hardware-accelerated"></div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-semibold">{t('tuBalance')}</h3>
          <p className="text-sm text-foreground/60">{t('gananciasDisponibles')}</p>
        </div>
        
        <button
          className="p-2 rounded-full hover:bg-foreground/10 transition-colors mobile-touch-friendly hardware-accelerated"
          onClick={() => setIsBalanceHidden(!isBalanceHidden)}
          aria-label={isBalanceHidden ? t('mostrarBalance') : t('ocultarBalance')}
        >
          {isBalanceHidden ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      <div className="flex items-end gap-2 mb-6 relative z-10">
        <DollarSign size={24} className="text-[#ec4899]" />
        <span className="text-3xl font-bold">
          {isBalanceHidden ? '••••' : (profile?.balance || 0).toFixed(2)}
        </span>
        <span className="text-foreground/60 mb-1">USD</span>
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <button
          className={`px-4 py-2 bg-[#ec4899] text-white rounded-lg flex items-center gap-2 hover:bg-[#ec4899]/90 transition-colors mobile-touch-friendly hardware-accelerated ${
            isWithdrawing || !profile || (profile.balance || 0) <= 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleWithdraw}
          disabled={isWithdrawing || !profile || (profile.balance || 0) <= 0}
        >
          <ArrowUpRight size={18} />
          <span>{isWithdrawing ? t('procesando') : t('retirar')}</span>
        </button>
        
        <div className="text-sm text-foreground/60">
          <span>{t('montoMinimo')}: $20 USD</span>
        </div>
      </div>
    </Card>
  );
}
