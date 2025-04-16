'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { AffiliatePaymentService } from '@/lib/affiliate-payment-service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function AffiliatePayments() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [minAmount, setMinAmount] = useState(50);
  const [canRequest, setCanRequest] = useState(false);
  const [hasPendingPayments, setHasPendingPayments] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [requestingPayment, setRequestingPayment] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);

      // Obtener el ID del afiliado
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (affiliateError) {
        console.error('Error al obtener datos de afiliado:', affiliateError);
        toast.error('No se pudieron cargar los datos de afiliado');
        setLoading(false);
        return;
      }

      setAffiliateId(affiliateData.id);

      // Verificar si puede solicitar pagos
      const { success, canRequest: canRequestPayment, availableBalance: balance, hasPendingPayments: hasPending, minAmount: minAmountValue } = 
        await AffiliatePaymentService.canRequestPayment(affiliateData.id);

      if (success) {
        setAvailableBalance(balance);
        setCanRequest(canRequestPayment);
        setHasPendingPayments(hasPending);
        if (minAmountValue) setMinAmount(minAmountValue);
      }

      // Obtener historial de pagos
      const { success: historySuccess, payments: paymentsData } = 
        await AffiliatePaymentService.getPaymentHistory(affiliateData.id);

      if (historySuccess) {
        setPayments(paymentsData || []);
      }
    } catch (error) {
      console.error('Error al cargar datos de pagos:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayment = async () => {
    if (!affiliateId) return;

    try {
      setRequestingPayment(true);

      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Ingresa un monto válido');
        return;
      }

      if (amount > availableBalance) {
        toast.error('El monto solicitado es mayor que tu saldo disponible');
        return;
      }

      if (amount < minAmount) {
        toast.error(`El monto mínimo para retirar es ${formatCurrency(minAmount)}`);
        return;
      }

      if (!paymentMethod) {
        toast.error('Selecciona un método de pago');
        return;
      }

      if (!paymentDetails.trim()) {
        toast.error('Ingresa los detalles de pago');
        return;
      }

      const { success, payment, error } = await AffiliatePaymentService.requestPayment(
        affiliateId,
        amount,
        paymentMethod,
        paymentDetails
      );

      if (success) {
        toast.success('Solicitud de pago enviada correctamente');
        setPaymentDialogOpen(false);
        setPaymentAmount('');
        setPaymentDetails('');
        fetchAffiliateData(); // Actualizar datos
      } else {
        toast.error(`Error al solicitar pago: ${error}`);
      }
    } catch (error) {
      console.error('Error al solicitar pago:', error);
      toast.error('Error al procesar la solicitud');
    } finally {
      setRequestingPayment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Procesando</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagos de Afiliado</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pagos de Afiliado</CardTitle>
        <CardDescription>
          Gestiona tus comisiones y solicita pagos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Saldo disponible */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">Saldo disponible</h3>
                  <p className="text-sm text-muted-foreground">
                    {canRequest 
                      ? 'Puedes solicitar un pago cuando tu saldo sea mayor a ' + formatCurrency(minAmount)
                      : hasPendingPayments 
                        ? 'Tienes una solicitud de pago pendiente'
                        : `El monto mínimo para retirar es ${formatCurrency(minAmount)}`
                    }
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="bg-muted/30 p-4 rounded-md">
                    <p className="text-sm font-medium mb-1">Tu saldo:</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(availableBalance)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 px-6 py-4 flex justify-end">
              <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    disabled={!canRequest || availableBalance < minAmount}
                    className="w-full md:w-auto"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Solicitar Pago
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar Pago</DialogTitle>
                    <DialogDescription>
                      Completa los detalles para solicitar tu pago. El monto mínimo es {formatCurrency(minAmount)}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Monto a retirar</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min={minAmount}
                        max={availableBalance}
                        step="0.01"
                      />
                      <p className="text-sm text-muted-foreground">
                        Saldo disponible: {formatCurrency(availableBalance)}
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="payment-method">Método de pago</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                          <SelectItem value="crypto">Criptomonedas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="payment-details">Detalles de pago</Label>
                      <Textarea
                        id="payment-details"
                        placeholder={
                          paymentMethod === 'paypal' 
                            ? 'Ingresa tu correo de PayPal' 
                            : paymentMethod === 'bank_transfer' 
                              ? 'Ingresa los datos de tu cuenta bancaria' 
                              : 'Ingresa tu dirección de wallet'
                        }
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleRequestPayment}
                      disabled={requestingPayment}
                    >
                      {requestingPayment ? 'Procesando...' : 'Solicitar Pago'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          
          {/* Historial de pagos */}
          <div>
            <h3 className="text-lg font-medium mb-4">Historial de pagos</h3>
            
            {payments.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No tienes pagos registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{formatCurrency(payment.amount)}</h3>
                            {getStatusBadge(payment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {payment.payment_method === 'paypal' 
                              ? 'PayPal' 
                              : payment.payment_method === 'bank_transfer' 
                                ? 'Transferencia Bancaria' 
                                : 'Criptomonedas'
                            }
                          </p>
                          {payment.notes && (
                            <p className="text-sm mt-1 text-muted-foreground">
                              {payment.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatDate(payment.created_at)}
                          </div>
                          {payment.status === 'completed' && payment.transaction_id && (
                            <div className="text-sm text-muted-foreground">
                              <CreditCard className="h-3 w-3 inline mr-1" />
                              {payment.transaction_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
