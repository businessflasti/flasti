'use client';

import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function WithdrawalsHistoryPage() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/withdrawals-history?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setWithdrawals(data.withdrawals || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 py-8">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M8 11h8M8 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Historial de Retiros</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-56 w-full mb-6 rounded-2xl" />
        ) : (
          <Card className="p-0 overflow-hidden border-0 shadow-xl bg-[#18181b] relative">
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-primary/40 animate-pulse-slow" style={{zIndex:0, filter:'blur(1px)', opacity:0.15}}></div>
            <div className="p-8 relative z-10">
              {withdrawals.length === 0 ? (
                <div className="text-[#b0b0b0] py-8 text-center">No tienes retiros registrados aún.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="text-xs">{new Date(w.created_at).toLocaleString()}</TableCell>
                        <TableCell>{w.amount} {w.currency || 'USD'}</TableCell>
                        <TableCell>
                          <Badge color={w.status === 'aprobado' ? 'success' : w.status === 'pendiente' ? 'warning' : 'danger'}>
                            {w.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
