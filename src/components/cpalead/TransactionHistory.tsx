"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  transaction_id: string;
  offer_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  transaction_type: 'earning' | 'reversal';
}

interface TransactionHistoryProps {
  userId: string;
  limit?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  userId, 
  limit = 20 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Formatear moneda
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener historial de transacciones
  const fetchTransactions = async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      const currentOffset = reset ? 0 : offset;

      const { data, error } = await supabase
        .rpc('get_user_cpalead_history', {
          user_id_param: userId,
          limit_param: limit,
          offset_param: currentOffset
        });

      if (error) {
        console.error('Error fetching transaction history:', error);
        toast.error('Error al cargar el historial');
        return;
      }

      const newTransactions = data || [];
      
      if (reset) {
        setTransactions(newTransactions);
        setOffset(limit);
      } else {
        setTransactions(prev => [...prev, ...newTransactions]);
        setOffset(prev => prev + limit);
      }

      setHasMore(newTransactions.length === limit);

    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error al cargar las transacciones');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar más transacciones
  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchTransactions(false);
    }
  };

  // Actualizar historial
  const refreshHistory = () => {
    fetchTransactions(true);
    toast.success('Historial actualizado');
  };

  // Cargar transacciones al montar el componente
  useEffect(() => {
    if (userId) {
      fetchTransactions(true);
    }
  }, [userId]);

  // Configurar suscripción en tiempo real
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('transaction_history')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'cpalead_transactions',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchTransactions(true);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'cpalead_reversals',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchTransactions(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Obtener icono según el tipo de transacción
  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.transaction_type === 'reversal') {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    
    if (transaction.status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  // Obtener color del badge según el estado
  const getBadgeVariant = (transaction: Transaction): "default" | "secondary" | "destructive" | "outline" => {
    if (transaction.transaction_type === 'reversal') return 'destructive';
    if (transaction.status === 'completed') return 'default';
    return 'secondary';
  };

  // Obtener texto del estado
  const getStatusText = (transaction: Transaction): string => {
    if (transaction.transaction_type === 'reversal') return 'Revertida';
    if (transaction.status === 'completed') return 'Completada';
    if (transaction.status === 'pending') return 'Pendiente';
    return 'Desconocido';
  };

  if (isLoading && transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historial de Transacciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando historial...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historial de Transacciones CPALead
            </CardTitle>
            <CardDescription>
              Historial completo de tus ganancias y reversiones
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshHistory}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Sin transacciones
            </h3>
            <p className="text-muted-foreground">
              Aún no tienes transacciones de CPALead. ¡Completa tu primera oferta para comenzar!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            Oferta #{transaction.offer_id}
                          </span>
                          <Badge variant={getBadgeVariant(transaction)} className="text-xs">
                            {getStatusText(transaction)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(transaction.created_at)}</span>
                          <span>•</span>
                          <span>ID: {transaction.transaction_id.slice(-8)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        transaction.transaction_type === 'reversal' 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}>
                        {transaction.transaction_type === 'reversal' ? '-' : '+'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.currency}
                      </div>
                    </div>
                  </div>
                  
                  {index < transactions.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Botón para cargar más */}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Cargar más transacciones
                    </>
                  )}
                </Button>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;