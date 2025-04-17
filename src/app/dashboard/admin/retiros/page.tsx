'use client';

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Toaster } from "sonner";
// Importar format de manera dinámica para evitar errores de hidratación
import { format as formatDate } from "date-fns";
import { es } from "date-fns/locale";

// Función para formatear fechas en el cliente
const format = (date: Date, formatStr: string, options?: any) => {
  // Solo formatear en el cliente para evitar errores de hidratación
  if (typeof window === 'undefined') {
    return '';
  }
  return formatDate(date, formatStr, options);
};

interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails: {
    email?: string;
    name?: string;
    accountNumber?: string;
    bankName?: string;
    [key: string]: any;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  userEmail?: string;
}

function AdminRetirosContent() {
  const { t } = useLanguage();
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar solicitudes de retiro
  useEffect(() => {
    const fetchWithdrawalRequests = async () => {
      setIsLoading(true);
      try {
        // Obtener directamente de la base de datos
        let query = supabase
          .from('withdrawal_requests')
          .select('*')
          .order('created_at', { ascending: false });

        // Aplicar filtro de estado si es necesario
        if (statusFilter !== "all") {
          query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // Mapear los datos al formato esperado
        const requests = data.map((item) => ({
          id: item.id,
          userId: item.user_id,
          amount: item.amount,
          paymentMethod: item.payment_method,
          paymentDetails: item.payment_details || {},
          status: item.status || 'pending',
          adminNotes: item.admin_notes,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          userEmail: item.payment_details?.email || 'Usuario'
        }));

        setWithdrawalRequests(requests);
      } catch (error) {
        console.error('Error al cargar solicitudes de retiro:', error);
        toast.error('Error al cargar solicitudes de retiro');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawalRequests();
  }, [statusFilter, refreshKey]);

  // Filtrar solicitudes por término de búsqueda
  const filteredWithdrawals = withdrawalRequests.filter((withdrawal) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      withdrawal.id.toLowerCase().includes(searchTermLower) ||
      withdrawal.userEmail?.toLowerCase().includes(searchTermLower) ||
      withdrawal.paymentDetails.email?.toLowerCase().includes(searchTermLower) ||
      withdrawal.amount.toString().includes(searchTermLower)
    );
  });

  // Manejar aprobación de solicitud
  const handleApprove = async (request: WithdrawalRequest) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        throw error;
      }

      toast.success('Solicitud aprobada correctamente');
      setRefreshKey(prev => prev + 1);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      toast.error('Error al aprobar solicitud');
    }
  };

  // Manejar rechazo de solicitud
  const handleReject = async (request: WithdrawalRequest) => {
    if (!rejectionReason.trim()) {
      toast.error('Debes proporcionar un motivo de rechazo');
      return;
    }

    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status: 'rejected',
          admin_notes: rejectionReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        throw error;
      }

      toast.success('Solicitud rechazada correctamente');
      setRejectionReason("");
      setRefreshKey(prev => prev + 1);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      toast.error('Error al rechazar solicitud');
    }
  };

  // Obtener badge de estado
  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <Clock size={12} />
            Pendiente
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            Completado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle size={12} />
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <div className="container-custom mt-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/dashboard/admin" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm mb-6">
            <ArrowLeft size={16} />
            <span>Volver al panel de administración</span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Administración de Retiros</h1>
            <p className="text-foreground/70">Gestiona las solicitudes de retiro de los usuarios</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className="text-sm"
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              className="text-sm"
            >
              Pendientes
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              onClick={() => setStatusFilter("completed")}
              className="text-sm"
            >
              Completados
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "default" : "outline"}
              onClick={() => setStatusFilter("rejected")}
              className="text-sm"
            >
              Rechazados
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-foreground/40" />
            </div>
            <Input
              type="text"
              placeholder="Buscar solicitudes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Withdrawals List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card p-6 mb-8 overflow-hidden">
                <h2 className="text-xl font-medium mb-4">Solicitudes de Retiro</h2>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-foreground/60">No hay solicitudes de retiro</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/10 max-h-[600px] overflow-y-auto pr-2">
                    {filteredWithdrawals.map((withdrawal) => (
                      <div
                        key={withdrawal.id}
                        className={`py-4 first:pt-0 cursor-pointer transition-colors ${selectedRequest?.id === withdrawal.id ? 'bg-primary/5 -mx-4 px-4' : 'hover:bg-primary/5 -mx-4 px-4'}`}
                        onClick={() => setSelectedRequest(withdrawal)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{withdrawal.userEmail || 'Usuario'}</p>
                            <p className="text-sm text-foreground/60">
                              ID: {withdrawal.id.substring(0, 8)}...
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${withdrawal.amount.toFixed(2)}</p>
                            <p className="text-xs text-foreground/60">
                              {format(withdrawal.createdAt, "dd MMM yyyy, HH:mm", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm">
                              <span className="text-foreground/60">PayPal:</span> {withdrawal.paymentDetails.email}
                            </p>
                          </div>
                          <div>
                            {getStatusBadge(withdrawal.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Request Details */}
            <div className="lg:col-span-1">
              <Card className="glass-card p-6 sticky top-6">
                {selectedRequest ? (
                  <>
                    <h2 className="text-xl font-medium mb-4">Detalles de la Solicitud</h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-sm text-foreground/60">ID de Solicitud</p>
                        <p className="font-medium">{selectedRequest.id}</p>
                      </div>

                      <div>
                        <p className="text-sm text-foreground/60">Usuario</p>
                        <p className="font-medium">{selectedRequest.userEmail || 'No disponible'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-foreground/60">Monto</p>
                        <p className="font-bold text-lg">${selectedRequest.amount.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-foreground/60">Método de Pago</p>
                        <p className="font-medium">{selectedRequest.paymentMethod}</p>
                      </div>

                      <div>
                        <p className="text-sm text-foreground/60">Detalles de Pago</p>
                        <p className="font-medium">{selectedRequest.paymentDetails.email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-foreground/60">Estado</p>
                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                      </div>

                      <div>
                        <p className="text-sm text-foreground/60">Fecha de Solicitud</p>
                        <p className="font-medium">
                          {format(selectedRequest.createdAt, "dd MMMM yyyy, HH:mm", { locale: es })}
                        </p>
                      </div>

                      {selectedRequest.adminNotes && (
                        <div>
                          <p className="text-sm text-foreground/60">Notas del Administrador</p>
                          <p className="font-medium">{selectedRequest.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    {selectedRequest.status === 'pending' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleApprove(selectedRequest)}
                            className="w-full"
                          >
                            Aprobar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(selectedRequest)}
                            className="w-full"
                            disabled={!rejectionReason.trim()}
                          >
                            Rechazar
                          </Button>
                        </div>

                        <div>
                          <p className="text-sm text-foreground/60 mb-2">Motivo de Rechazo</p>
                          <Textarea
                            placeholder="Ingresa el motivo del rechazo..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-foreground/60">Selecciona una solicitud para ver los detalles</p>
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

export default function AdminRetirosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <AdminRetirosContent />
    </Suspense>
  );
}
