'use client';

import React from 'react';
import Link from 'next/link';
import {
  Eye,
  MinusCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { Button } from '@/components/ui/button';

export default function CasinoBalance() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();

  return (
    <div data-tour="balance" className="bg-gradient-to-br from-[#9333ea]/10 via-[#ec4899]/10 to-[#facc15]/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10 relative z-0 animate-fadeInUp hover-lift particles-bg hardware-accelerated">
      <h2 className="text-sm text-foreground/60 uppercase font-medium mb-2">{t('balance')}</h2>

      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-4xl font-bold animate-countUp">{isBalanceVisible ? `$${profile?.balance || '0.00'}` : "****"}</h3>
        <span className="text-lg">USDC</span>
        <button className="text-foreground/60 hover:text-foreground transition-colors" onClick={toggleBalanceVisibility}>
          <Eye size={20} />
        </button>
      </div>

      <p className="text-foreground/70 mb-4">{isBalanceVisible ? `$${profile?.balance || '0.00'} USD` : "****"}</p>

      <div className="flex items-center gap-3 mb-4">
        <Link href="/dashboard/paypal">
          <Button
            className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] hover:opacity-90 transition-opacity flex items-center gap-2 animate-pulse"
          >
            <MinusCircle size={18} />
            Retirar
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-1 text-sm">
        <span>1 USDC = 1 USD</span>
      </div>
    </div>
  );
}


