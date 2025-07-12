'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function BalancePage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 md:px-0 py-8" style={{ background: '#101010', minHeight: '100vh' }}>
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Mi Balance</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-40 w-full mb-6 rounded-2xl" />
        ) : (
          <Card className="p-0 overflow-hidden border-0 shadow-xl bg-[#18181b] relative">
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-primary/40 animate-pulse-slow" style={{zIndex:0, filter:'blur(1px)', opacity:0.15}}></div>
            <div className="flex flex-col gap-6 p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="text-lg font-semibold text-white">Saldo actual</span>
                </div>
                <span className="text-3xl font-bold text-primary">${profile?.balance?.toFixed(2) ?? '0.00'} <span className="text-base font-normal text-[#b0b0b0]">{profile?.currency || 'USD'}</span></span>
              </div>
              <div className="text-lg font-semibold text-[#b0b0b0] mb-2">
                {profile?.balance?.toFixed(2) ?? '0.00'} CR
              </div>
              <div className="text-sm text-[#ec3f7c] font-medium mb-2">
                1 crédito equivale a 1 dólar estadounidense (USD)
              </div>
              <div className="text-sm text-[#b0b0b0]">ID de usuario: {user?.id}</div>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
