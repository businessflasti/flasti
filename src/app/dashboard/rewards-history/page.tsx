'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, RotateCcw, Gift } from 'lucide-react';

interface RewardSummary {
  total_earnings: number;
  total_reversals: number;
  approved_count: number;
  reversed_count: number;
}

interface Reward {
  id: string;
  created_at: string;
  transaction_id: string;
  offer_name: string;
  program_name: string;
  goal_name: string;
  payout: number;
  currency: string;
  status: string;
  source: string;
  type: string;
}

export default function RewardsHistoryPage() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [summary, setSummary] = useState<RewardSummary>({
    total_earnings: 0,
    total_reversals: 0,
    approved_count: 0,
    reversed_count: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchRewardsHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Obtener token de sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Sesión expirada, por favor inicia sesión nuevamente');
        return;
      }

      const response = await fetch(`/api/rewards-history?user_id=${user.id}`, {
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
        console.error('Error fetching rewards:', data.error);
        toast.error('Error al cargar el historial de recompensas');
        return;
      }

      setRewards(data.rewards || []);
      setSummary(data.summary || summary);

    } catch (error) {
      console.error('Error fetching rewards history:', error);
      toast.error('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsHistory();
  }, [user]);

  // Configurar actualización en tiempo real
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('rewards_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'cpalead_transactions',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchRewardsHistory();
        toast.success('¡Nueva recompensa registrada!');
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'cpalead_reversals',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchRewardsHistory();
        toast.info('Se ha registrado una reversión');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: string, type: string) => {
    if (status === 'aprobado') {
      return <Badge className="bg-green-100 text-green-700 border-green-200">Aprobado</Badge>;
    } else if (status === 'revertido') {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Revertido</Badge>;
    } else if (status === 'pendiente') {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pendiente</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: '#F6F3F3',
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#111827' }}>Historial de Recompensas</h1>
      </div>

      {/* Estadísticas de resumen */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Total Ganado</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {formatCurrency(summary.total_earnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Aprobadas</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {summary.approved_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Revertidas</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {summary.reversed_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Total Tareas</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {rewards.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de historial */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#0D50A4' }}></div>
          </div>
        ) : (
          <div className="rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="p-6 border-b" style={{ borderColor: '#F3F3F3' }}>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 flex-wrap" style={{ color: '#111827' }}>
                <Gift className="w-5 h-5" style={{ color: '#0D50A4' }} />
                <span className="text-base sm:text-xl">Historial Completo</span>
                {rewards.length > 0 && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-xs sm:px-2 sm:py-1 sm:text-sm min-w-[100px] sm:min-w-0 text-center sm:text-left ml-0 sm:ml-2 mt-1 sm:mt-0">
                    {rewards.length} transacciones
                  </Badge>
                )}
              </h2>
            </div>
            <div className="p-6">
              {rewards.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 mx-auto mb-4" style={{ color: '#6B7280' }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>
                    No hay recompensas aún
                  </h3>
                  <p style={{ color: '#6B7280' }}>
                    Completa tareas para ver tu historial aquí.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: '#F3F3F3' }}>
                        <TableHead style={{ color: '#6B7280' }}>Fecha</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Tarea</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Monto</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Estado</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>ID Transacción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewards.map((reward) => (
                        <TableRow key={reward.id} style={{ borderColor: '#F3F3F3' }}>
                          <TableCell className="text-sm" style={{ color: '#111827' }}>
                            {new Date(reward.created_at).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </TableCell>
                          <TableCell className="font-medium" style={{ color: '#111827' }}>
                            {reward.offer_name}
                          </TableCell>
                          <TableCell className="font-bold" style={{ color: reward.payout >= 0 ? '#10B981' : '#EF4444' }}>
                            {reward.payout >= 0 ? '+' : ''}{formatCurrency(reward.payout)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(reward.status, reward.type)}
                          </TableCell>
                          <TableCell className="text-xs font-mono" style={{ color: '#6B7280' }}>
                            {reward.transaction_id.split('_').pop() || reward.transaction_id}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
}
