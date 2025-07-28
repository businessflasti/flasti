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

      // Obtener token de sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Sesión expirada, por favor inicia sesión nuevamente');
        return;
      }

      const response = await fetch(`/api/withdrawals-history?user_id=${user.id}`, {
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
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
      case 'approved':
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rechazado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-8 h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Historial de Retiros</h1>
      </div>

      {/* Estadísticas de resumen */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Solicitado</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(summary.total_requested)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Aprobado</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(summary.total_approved)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-xl font-bold text-foreground">
                    {summary.pending_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Retiros</p>
                  <p className="text-xl font-bold text-foreground">
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
            <p className="text-gray-400 font-medium">Cargando historial de retiros...</p>
          </div>
        ) : (
          <div className="bg-[#232323] border border-white/10 rounded-lg">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
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
                  <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No hay retiros aún
                  </h3>
                  <p className="text-muted-foreground">
                    Cuando solicites un retiro, aparecerá aquí con su estado.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Procesado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="text-sm">
                            {new Date(withdrawal.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="font-bold text-primary">
                            {formatCurrency(withdrawal.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              {withdrawal.method}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {withdrawal.destination}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(withdrawal.status)}
                              {getStatusBadge(withdrawal.status)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
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
  );
}
