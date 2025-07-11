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
      <h1 className="text-2xl font-bold mb-6 text-white">Mi Balance</h1>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-32 w-full mb-6" />
        ) : (
          <Card className="flex flex-col gap-4 items-start" style={{ background: '#101010' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">Saldo actual:</span>
              <Badge color="success">Activo</Badge>
            </div>
            <div className="text-4xl font-extrabold mb-2">
              ${profile?.balance?.toFixed(2) ?? '0.00'}
              <span className="text-base font-normal text-[#b0b0b0]">{profile?.currency || 'USD'}</span>
            </div>
            <div className="text-lg font-semibold text-[#b0b0b0] mb-2">
              {profile?.balance?.toFixed(2) ?? '0.00'} CR
            </div>
            <div className="text-sm text-[#b0b0b0]">ID de usuario: {user?.id}</div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
