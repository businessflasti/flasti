'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
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
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprobado</Badge>;
    } else if (status === 'revertido') {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Revertido</Badge>;
    } else if (status === 'pendiente') {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
    } else {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Historial de Recompensas</h1>
      </div>

      {/* Estadísticas de resumen */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Ganado</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(summary.total_earnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aprobadas</p>
                  <p className="text-xl font-bold text-foreground">
                    {summary.approved_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revertidas</p>
                  <p className="text-xl font-bold text-foreground">
                    {summary.reversed_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Gift className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tareas</p>
                  <p className="text-xl font-bold text-foreground">
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
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-gray-600 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            </div>
            <p className="text-gray-400 font-medium">Cargando historial de recompensas...</p>
          </div>
        ) : (
          <div className="bg-[#232323] border border-white/10 rounded-lg">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                <Gift className="w-5 h-5" />
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
                  <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No hay recompensas aún
                  </h3>
                  <p className="text-muted-foreground">
                    Completa tareas para ver tu historial aquí.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tarea</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>ID Transacción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewards.map((reward) => (
                        <TableRow key={reward.id}>
                          <TableCell className="text-sm">
                            {new Date(reward.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {reward.offer_name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {reward.goal_name}
                          </TableCell>
                          <TableCell className={`font-bold ${reward.payout >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {reward.payout >= 0 ? '+' : ''}{formatCurrency(reward.payout)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(reward.status, reward.type)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">
                            {reward.transaction_id}
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
  );
}
