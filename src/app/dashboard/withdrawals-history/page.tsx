'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCardsGridSkeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DollarSign, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';

interface WithdrawalSummary {
  total_requested: number;
  total_approved: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}

interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  method: string;
  destination: string;
  status: string;
  created_at: string;
  processed_at?: string;
}

export default function WithdrawalsHistoryPage() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [summary, setSummary] = useState<WithdrawalSummary>({
    total_requested: 0,
    total_approved: 0,
    pending_count: 0,
    approved_count: 0,
    rejected_count: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchWithdrawalsHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Timeout para evitar loading infinito
      const timeoutId = setTimeout(() => {
        console.warn('Timeout al cargar historial de retiros');
        setLoading(false);
      }, 10000);

      // Obtener token de sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        clearTimeout(timeoutId);
        toast.error('Sesión expirada, por favor inicia sesión nuevamente');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/withdrawals-history?user_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('Error fetching withdrawals:', data.error);
        toast.error('Error al cargar el historial de retiros');
        return;
      }

      setWithdrawals(data.withdrawals || []);
      setSummary(data.summary || summary);

    } catch (error) {
      console.error('Error fetching withdrawals history:', error);
      toast.error('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalsHistory();
  }, [user]);

  // Configurar actualización en tiempo real
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('withdrawals_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'withdrawals',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchWithdrawalsHistory();
        toast.info('Estado de retiro actualizado');
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case 'approved':
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rechazado</Badge>;
      default:
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
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#111827' }}>Historial de Retiros</h1>
      </div>

      {/* Estadísticas de resumen */}
      {loading ? (
        <div className="mb-6">
          <StatsCardsGridSkeleton variant="light" columns={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Total Solicitado</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {formatCurrency(summary.total_requested)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Total Aprobado</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {formatCurrency(summary.total_approved)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Pendientes</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {summary.pending_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0D50A4' }}>
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Total Retiros</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>
                    {withdrawals.length}
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
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#111827' }}>
                <CreditCard className="w-5 h-5" style={{ color: '#0D50A4' }} />
                Historial Completo
                {withdrawals.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {withdrawals.length} retiros
                  </Badge>
                )}
              </h2>
            </div>
            <div className="p-6">
              {withdrawals.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 mx-auto mb-4" style={{ color: '#6B7280' }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>
                    No hay retiros aún
                  </h3>
                  <p style={{ color: '#6B7280' }}>
                    Cuando solicites un retiro, aparecerá aquí con su estado.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: '#F3F3F3' }}>
                        <TableHead style={{ color: '#6B7280' }}>Fecha</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Monto</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Método</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Destino</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Estado</TableHead>
                        <TableHead style={{ color: '#6B7280' }}>Procesado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id} style={{ borderColor: '#F3F3F3' }}>
                          <TableCell className="text-sm" style={{ color: '#111827' }}>
                            {new Date(withdrawal.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="font-bold" style={{ color: '#10B981' }}>
                            {formatCurrency(withdrawal.amount)}
                          </TableCell>
                          <TableCell style={{ color: '#111827' }}>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" style={{ color: '#6B7280' }} />
                              {withdrawal.method}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm" style={{ color: '#6B7280' }}>
                            {withdrawal.destination}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(withdrawal.status)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm" style={{ color: '#6B7280' }}>
                            {withdrawal.processed_at 
                              ? new Date(withdrawal.processed_at).toLocaleDateString('es-ES')
                              : '-'
                            }
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
