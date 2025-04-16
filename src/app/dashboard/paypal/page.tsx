"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/ui/back-button";
import Logo from "@/components/ui/logo";
import PayPalLogo from "@/components/icons/PayPalLogo";
import { toast } from "sonner";
import { withdrawalServiceEnhanced } from "@/lib/withdrawal-service-enhanced";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PayPalWithdrawalPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, updateBalance } = useAuth();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Cargar balance y historial de retiros
  useEffect(() => {
    if (user) {
      // Cargar balance del usuario
      const fetchUserBalance = async () => {
        try {
          // Primero actualizar el balance en el contexto de autenticación
          await updateBalance();

          // Luego obtener el balance actualizado
          const { data, error } = await supabase
            .from('user_profiles')
            .select('balance')
            .eq('user_id', user.id)
            .single();

          if (error) {
            // Si hay error, intentar obtener desde profiles
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('balance')
              .eq('id', user.id)
              .single();

            if (profileError) throw profileError;
            setBalance(profileData.balance || 0);
          } else {
            setBalance(data.balance || 0);
          }
        } catch (error) {
          console.error('Error al cargar balance:', error);
          toast.error('Error al cargar tu balance');
        }
      };

      // Cargar historial de retiros
      const fetchWithdrawalHistory = async () => {
        // No mostrar indicador de carga si ya tenemos datos
        if (withdrawalHistory.length === 0) {
          setLoadingHistory(true);
        }

        try {
          const { data, error } = await supabase
            .from('withdrawal_requests')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Mapear los datos al formato esperado
          const formattedWithdrawals = data.map(item => ({
            id: item.id,
            userId: item.user_id,
            amount: item.amount,
            paymentMethod: item.payment_method,
            paymentDetails: item.payment_details || {},
            status: item.status,
            adminNotes: item.admin_notes,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at)
          }));

          setWithdrawalHistory(formattedWithdrawals);
        } catch (error) {
          console.error('Error al cargar historial de retiros:', error);
          // No mostrar toast para evitar mensajes repetitivos
        } finally {
          setLoadingHistory(false);
        }
      };

      fetchUserBalance();
      fetchWithdrawalHistory();
    }
  }, [user, updateBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validaciones
    if (!email) {
      setError("Por favor ingresa tu correo de PayPal");
      setIsLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Por favor ingresa un monto válido");
      setIsLoading(false);
      return;
    }

    const amountValue = parseFloat(amount);

    if (amountValue < 10) {
      setError("El monto mínimo de retiro es $10 USD");
      setIsLoading(false);
      return;
    }

    if (amountValue > balance) {
      setError("No tienes suficiente balance para este retiro");
      setIsLoading(false);
      return;
    }

    try {
      // Usar el endpoint super simple
      const response = await fetch('/api/withdrawal/super-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || '',
          amount: amountValue,
          email: email
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Solicitud de retiro creada correctamente');
        // Actualizar balance local
        setBalance(result.newBalance || 0);
        // Actualizar balance en el contexto de autenticación
        await updateBalance();
        // Limpiar formulario
        setEmail("");
        setAmount("");
        // Actualizar el historial de manera optimista (sin parpadeo)
        const newWithdrawal = {
          id: result.requestId,
          userId: user?.id || '',
          amount: parseFloat(amount),
          paymentMethod: 'paypal',
          paymentDetails: { email: email },
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Agregar la nueva solicitud al inicio del historial existente
        setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error al procesar retiro:', error);
      setError('Error al procesar tu solicitud de retiro');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            <Clock size={12} className="mr-1" />
            Pendiente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <Info size={12} className="mr-1" />
            Aprobado
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <CheckCircle size={12} className="mr-1" />
            Completado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <XCircle size={12} className="mr-1" />
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy, HH:mm', {
      locale: language === 'es' ? es : undefined
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('ID copiado al portapapeles');

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <BackButton />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Retiros</h1>
            <p className="text-foreground/70 mt-1">
              Retira tus comisiones a través de PayPal
            </p>
          </div>
          <Card className="p-4 bg-card/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center">
              <DollarSign size={20} className="text-[#10b981]" />
            </div>
            <div>
              <p className="text-sm text-foreground/70">Tu balance</p>
              <p className="text-xl font-bold">${balance.toFixed(2)} USD</p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="withdraw" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <CreditCard size={16} />
              <span>Solicitar Retiro</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock size={16} />
              <span>Historial</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="withdraw" className="space-y-6">
            <Card className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <h2 className="text-xl font-semibold mb-6">Solicitar Retiro</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo de PayPal</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu.correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto a retirar (USD)</Label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
                        <Input
                          id="amount"
                          type="number"
                          min="10"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-foreground/60">Monto mínimo: $10.00 USD</p>
                    </div>

                    {error && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start">
                        <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || !email || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Procesando...
                        </>
                      ) : (
                        "Solicitar Retiro"
                      )}
                    </Button>

                    <p className="text-xs text-foreground/60 text-center">
                      Los retiros son procesados en un plazo de 24-48 horas hábiles
                    </p>
                  </form>
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-4 mb-6">
                    <PayPalLogo className="w-full h-full text-[#009cde]" />
                  </div>

                  <h3 className="text-lg font-medium mb-4">Información Importante</h3>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm">
                        ¿Cuánto tiempo tarda el proceso?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-foreground/70">
                        Los retiros son procesados en un plazo de 24-48 horas hábiles. Una vez aprobado,
                        el dinero se enviará a tu cuenta de PayPal y estará disponible según las políticas de PayPal.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm">
                        ¿Hay alguna comisión por retiro?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-foreground/70">
                        No cobramos comisiones por retiros. Sin embargo, PayPal puede aplicar sus propias
                        comisiones según tu país y tipo de cuenta.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm">
                        ¿Cuál es el monto mínimo de retiro?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-foreground/70">
                        El monto mínimo para solicitar un retiro es de $10 USD.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-sm">
                        ¿Qué pasa si mi solicitud es rechazada?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-foreground/70">
                        Si tu solicitud es rechazada, el monto será devuelto a tu balance automáticamente.
                        Te notificaremos el motivo del rechazo para que puedas corregirlo en futuras solicitudes.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="overflow-hidden border border-border/50 min-h-[300px]">
              {loadingHistory ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin text-primary mr-2">⟳</div>
                  <p>Cargando historial...</p>
                </div>
              ) : withdrawalHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <CreditCard size={48} className="text-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes retiros</h3>
                  <p className="text-foreground/60 text-center max-w-md mb-4">
                    Aún no has realizado ninguna solicitud de retiro. Cuando lo hagas, aparecerán aquí.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="withdraw"]')?.click()}
                  >
                    Solicitar mi primer retiro
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-foreground/5">
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Fecha</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Monto</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Método</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Estado</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {withdrawalHistory.map((withdrawal) => (
                        <tr key={withdrawal.id} className="hover:bg-foreground/5 transition-colors">
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="font-mono">{withdrawal.id.substring(0, 8)}...</span>
                              <button
                                onClick={() => copyToClipboard(withdrawal.id, withdrawal.id)}
                                className="text-foreground/50 hover:text-foreground transition-colors"
                              >
                                {copiedId === withdrawal.id ? (
                                  <Check size={14} className="text-[#10b981]" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground/70">
                            {formatDate(withdrawal.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ${withdrawal.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {withdrawal.paymentMethod === 'paypal' ? (
                              <span className="inline-flex items-center">
                                <PayPalLogo className="w-4 h-4 mr-1 text-[#009cde]" />
                                PayPal
                              </span>
                            ) : (
                              withdrawal.paymentMethod
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {getStatusBadge(withdrawal.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground/70">
                            {withdrawal.adminNotes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
