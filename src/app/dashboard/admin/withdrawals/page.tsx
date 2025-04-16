'use client';

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { WithdrawalRequest } from "@/lib/withdrawal-service";

function AdminWithdrawalsContent() {
  const { t } = useLanguage();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadWithdrawals = async () => {
      // Cargar todas las solicitudes de retiro
      const withdrawalService = await import('@/lib/withdrawal-service').then(module => module.default.getInstance());
      const allWithdrawals = withdrawalService.getAllRequests();
      setWithdrawals(allWithdrawals);
      setIsLoading(false);

      // Suscribirse a nuevas solicitudes
      const unsubscribeNewRequest = withdrawalService.onRequestReceived((newRequest) => {
        setWithdrawals((prevWithdrawals) => [newRequest, ...prevWithdrawals]);
      });

      // Suscribirse a actualizaciones de estado
      const unsubscribeStatusUpdate = withdrawalService.onStatusUpdated((updatedRequest) => {
        setWithdrawals((prevWithdrawals) => {
          const index = prevWithdrawals.findIndex((w) => w.id === updatedRequest.id);
          if (index !== -1) {
            const newWithdrawals = [...prevWithdrawals];
            newWithdrawals[index] = updatedRequest;
            return newWithdrawals;
          }
          return prevWithdrawals;
        });

        // Si la solicitud seleccionada fue actualizada, actualizar también la selección
        if (selectedRequest && selectedRequest.id === updatedRequest.id) {
          setSelectedRequest(updatedRequest);
        }
      });

      return () => {
        unsubscribeNewRequest();
        unsubscribeStatusUpdate();
      };
    };

    loadWithdrawals();
  }, [selectedRequest]);

  const handleApprove = async (request: WithdrawalRequest) => {
    const withdrawalService = await import('@/lib/withdrawal-service').then(module => module.default.getInstance());
    withdrawalService.updateRequestStatus({
      requestId: request.id,
      status: 'completed'
    });
  };

  const handleReject = async (request: WithdrawalRequest) => {
    const withdrawalService = await import('@/lib/withdrawal-service').then(module => module.default.getInstance());
    withdrawalService.updateRequestStatus({
      requestId: request.id,
      status: 'rejected',
      notes: rejectionReason || 'Solicitud rechazada por el administrador'
    });
    setRejectionReason("");
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <Clock size={12} />
            {t('pendiente') as string}
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

  const [filter, setFilter] = useState<'all' | WithdrawalRequest['status']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Filtrar, buscar y ordenar las solicitudes
  const filteredWithdrawals = withdrawals
    .filter(withdrawal => {
      // Aplicar filtro de búsqueda por término
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          withdrawal.username.toLowerCase().includes(searchLower) ||
          withdrawal.email.toLowerCase().includes(searchLower) ||
          withdrawal.id.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      // Aplicar filtro por estado
      return filter === 'all' || withdrawal.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return b.amount - a.amount;
    });

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Filtros y ordenamiento */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          className="bg-card/50 border border-border/20 rounded-lg px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value as WithdrawalRequest['status'])}
        >
          <option value="all">{t('todos')}</option>
          <option value="pending">{t('pendiente')}</option>
          <option value="processing">{t('procesando')}</option>
          <option value="completed">{t('completado')}</option>
          <option value="rejected">{t('rechazado')}</option>
        </select>

        <select
          className="bg-card/50 border border-border/20 rounded-lg px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
        >
          <option value="date">{t('ordenarPorFecha')}</option>
          <option value="amount">{t('ordenarPorMonto')}</option>
        </select>
      </div>
      {/* Header visible only in this page */}
      <header className="w-full py-4 border-b border-border/20 bg-card/70 backdrop-blur-md">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-primary font-bold text-xl">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="glow-effect">
                <path fillRule="evenodd" clipRule="evenodd" d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="url(#paint0_linear)" />
                <path d="M21.5253 15.535V10.3622H18.0229V15.535H13.9517V19.0425H18.0229V25.6486H21.5253V19.0425H25.5966V15.535H21.5253Z" fill="white" />
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9333ea" />
                    <stop offset="0.33" stopColor="#ec4899" />
                    <stop offset="0.66" stopColor="#f97316" />
                    <stop offset="1" stopColor="#facc15" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
            <h1 className="font-semibold text-xl hidden sm:block">Flow State</h1>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white font-bold relative">
              A
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-background"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom mt-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm mb-6">
            <ArrowLeft size={16} />
            <span>{t('volverDashboard') as string}</span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('adminRetiros') as string}</h1>
            <p className="text-foreground/70">{t('gestionSolicitudes') as string}</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-foreground/40" />
            </div>
            <Input
              type="text"
              placeholder={t('buscarSolicitudes') as string}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Withdrawals List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card p-6 mb-8 overflow-hidden">
                <h2 className="text-xl font-medium mb-4">{t('solicitudesRetiro') as string}</h2>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-foreground/60">{t('sinSolicitudes') as string}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/10 max-h-[600px] overflow-y-auto pr-2">
                    {filteredWithdrawals.map((withdrawal) => (
                      <div
                        key={withdrawal.id}
                        className={`py-4 first:pt-0 cursor-pointer transition-colors ${selectedRequest?.id === withdrawal.id ? 'bg-primary/5 -mx-4 px-4' : 'hover:bg-primary/5 -mx-4 px-4'}`}
                        onClick={() => setSelectedRequest(withdrawal)}
                      >
                        <div className="flex justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">
                                {withdrawal.username}
                              </h3>
                              {getStatusBadge(withdrawal.status)}
                            </div>
                            <p className="text-sm text-foreground/60">{withdrawal.email}</p>
                            <p className="text-xs text-foreground/50 mt-1">
                              {formatDate(withdrawal.timestamp)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-lg">${withdrawal.amount} USD</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Request Details */}
            <div>
              <Card className="glass-card p-6 mb-8 sticky top-6">
                {selectedRequest ? (
                  <div>
                    <h2 className="text-xl font-medium mb-4">{t('detallesSolicitud') as string}</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">{t('id') as string}</span>
                        <span className="font-medium">{selectedRequest.id.substring(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">{t('usuario') as string}</span>
                        <span className="font-medium">{selectedRequest.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">{t('correoElectronico') as string}</span>
                        <span className="font-medium">{selectedRequest.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">{t('monto') as string}</span>
                        <span className="font-medium">${selectedRequest.amount} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">{t('metodo') as string}</span>
                        <span className="font-medium">PayPal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">{t('fecha') as string}</span>
                        <span className="font-medium">{formatDate(selectedRequest.timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">{t('estado') as string}</span>
                        <span>{getStatusBadge(selectedRequest.status)}</span>
                      </div>
                      {selectedRequest.notes && (
                        <div className="pt-2">
                          <span className="text-foreground/60 block mb-1">{t('notas') as string}</span>
                          <p className="text-sm bg-card/50 p-2 rounded border border-border/20">{selectedRequest.notes}</p>
                        </div>
                      )}
                    </div>

                    {selectedRequest.status === 'pending' && (
                      <div className="space-y-4">
                        <div className="pt-4 border-t border-border/10">
                          <h3 className="font-medium mb-2">{t('accionesSolicitud') as string}</h3>

                          <div className="flex flex-col gap-3">
                            <Button
                              onClick={() => handleApprove(selectedRequest)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t('aprobarSolicitud') as string}
                            </Button>

                            <div className="space-y-2">
                              <Textarea
                                placeholder={t('razonRechazo') as string}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <Button
                                onClick={() => handleReject(selectedRequest)}
                                variant="destructive"
                                className="w-full"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                {t('rechazarSolicitud') as string}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-foreground/60">{t('seleccionaSolicitud') as string}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminWithdrawalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <AdminWithdrawalsContent />
    </Suspense>
  );
}