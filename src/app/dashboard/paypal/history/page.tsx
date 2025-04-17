'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { WithdrawalRequest } from "@/lib/withdrawal-service";
import Logo from "@/components/ui/logo";

export default function WithdrawalHistoryPage() {
  const { t } = useLanguage();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWithdrawals = async () => {
      // En un caso real, obtendríamos el ID del usuario de la sesión
      const userId = "user-123";
      const withdrawalService = await import('@/lib/withdrawal-service').then(module => module.default.getInstance());
      const userWithdrawals = withdrawalService.getUserRequests(userId);
      setWithdrawals(userWithdrawals);
      setIsLoading(false);

      // Suscribirse a actualizaciones de estado
      const unsubscribe = withdrawalService.onStatusUpdated((updatedRequest) => {
        setWithdrawals((prevWithdrawals) => {
          const index = prevWithdrawals.findIndex((w) => w.id === updatedRequest.id);
          if (index !== -1) {
            const newWithdrawals = [...prevWithdrawals];
            newWithdrawals[index] = updatedRequest;
            return newWithdrawals;
          }
          return prevWithdrawals;
        });
      });

      return () => {
        unsubscribe();
      };
    };

    loadWithdrawals();
  }, []);

  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <Clock size={12} />
            {t('procesando') as string}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            {t('completado') as string}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle size={12} />
            {t('rechazado') as string}
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header visible only in this page */}
      <header className="w-full py-4 border-b border-border/20 bg-card/70 backdrop-blur-md">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white font-bold relative">
              U
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-background"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom mt-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/dashboard/withdrawals" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm mb-6">
            <ArrowLeft size={16} />
            <span>{t('volverDashboard') as string}</span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('historialRetiros') as string}</h1>
            <p className="text-foreground/70">{t('historialTransacciones') as string}</p>
          </div>

          {/* Withdrawals History */}
          <Card className="glass-card p-6 mb-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">{t('sinHistorial') as string}</p>
                <Link href="/dashboard/withdrawals/paypal">
                  <Button variant="outline">{t('solicitarRetiro') as string}</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/10">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            PayPal - ${withdrawal.amount} USD
                          </h3>
                          {getStatusBadge(withdrawal.status)}
                        </div>
                        <p className="text-sm text-foreground/60">{withdrawal.email}</p>
                        <p className="text-xs text-foreground/50 mt-1">
                          {formatDate(withdrawal.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {withdrawal.status === 'pending' && (
                          <span className="text-sm text-foreground/60">{t('enProceso') as string}</span>
                        )}
                        {withdrawal.status === 'completed' && (
                          <span className="text-sm text-green-500">{t('pagado') as string}</span>
                        )}
                        {withdrawal.status === 'rejected' && (
                          <div className="flex flex-col">
                            <span className="text-sm text-red-500">{t('rechazado') as string}</span>
                            {withdrawal.notes && (
                              <span className="text-xs text-foreground/60">{withdrawal.notes}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* New Withdrawal Button */}
          <div className="flex justify-center">
            <Link href="/dashboard/withdrawals/paypal">
              <Button className="bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity px-8 py-6 h-auto">
                {t('nuevoRetiro') as string}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}