'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  ArrowUp, 
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CasinoBalance() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  
  return (
    <div className="mb-6">
      <Card className="glass-card p-6 relative overflow-hidden hardware-accelerated">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ec4899]/10 rounded-full blur-3xl -mr-10 -mt-10 hardware-accelerated"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Wallet className="text-primary" size={20} />
              {t('balanceDisponible')}
            </h2>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {isBalanceVisible ? (
                  `$${profile?.balance || "0.00"}`
                ) : (
                  "••••"
                )}
              </span>
              <span className="text-foreground/60">USD</span>
              <button
                onClick={toggleBalanceVisibility}
                className="ml-2 p-1 rounded-full hover:bg-white/5 transition-colors"
              >
                {isBalanceVisible ? (
                  <EyeOff size={16} className="text-foreground/60" />
                ) : (
                  <Eye size={16} className="text-foreground/60" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/paypal">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-[#9333ea] to-[#ec4899] hover:opacity-90 transition-opacity">
                <ArrowUp size={16} />
                {t('retirar')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Historial de transacciones recientes */}
        <div className="mt-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{t('transaccionesRecientes')}</h3>
            <Link
              href="/dashboard/transactions"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              {t('verTodas')}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <PlusCircle size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{t('comisionRecibida')}</p>
                  <p className="text-xs text-foreground/60">
                    {t('hace')} 2 {t('horas')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-500">+$25.00</p>
                <p className="text-xs text-foreground/60">Flasti Images</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <MinusCircle size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="font-medium">{t('retiroPayPal')}</p>
                  <p className="text-xs text-foreground/60">
                    {t('hace')} 5 {t('dias')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-500">-$100.00</p>
                <p className="text-xs text-foreground/60">PayPal</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <PlusCircle size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{t('comisionRecibida')}</p>
                  <p className="text-xs text-foreground/60">
                    {t('hace')} 7 {t('dias')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-500">+$15.00</p>
                <p className="text-xs text-foreground/60">Flasti AI</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Componentes para los iconos
function PlusCircle({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

function MinusCircle({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

function ArrowRight({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
