'use client';

import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function RewardsHistoryPage() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/rewards-history?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setRewards(data.rewards || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 py-8">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-6 text-white">Historial de Recompensas</h1>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-48 w-full mb-6" />
        ) : (
          <Card>
            {rewards.length === 0 ? (
              <div className="text-[#b0b0b0] py-8 text-center">No tienes recompensas registradas aún.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Oferta</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs">{new Date(r.created_at).toLocaleString()}</TableCell>
                      <TableCell>{r.program_name || r.goal_name || '-'}</TableCell>
                      <TableCell>{r.payout} {r.currency || 'USD'}</TableCell>
                      <TableCell>
                        <Badge color={r.status === 'aprobado' ? 'success' : r.status === 'pendiente' ? 'warning' : 'danger'}>
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  );
}
