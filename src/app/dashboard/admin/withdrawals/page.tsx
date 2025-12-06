'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  DollarSign,
  User,
  Mail,
  Calendar,
  CreditCard,
  FileText
} from "lucide-react";
import { WithdrawalRequest } from "@/lib/withdrawal-service";
import { toast } from 'sonner';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | WithdrawalRequest['status']>('pending');

  useEffect(() => {
    const loadWithdrawals = async () => {
      try {
        const { adminService } = await import('@/lib/admin-service');
        const allWithdrawals = await adminService.getWithdrawalRequests();
        
        const formattedWithdrawals = allWithdrawals.map(w => ({
          id: w.id,
          user_id: w.user_id,
          username: w.user_email?.split('@')[0] || 'Usuario',
          email: w.user_email || 'No disponible',
          amount: w.amount,
          payment_method: w.payment_method,
          payment_details: w.payment_details,
          status: w.status as WithdrawalRequest['status'],
          timestamp: w.created_at,
          processed_at: w.processed_at,
          notes: w.notes
        }));
        
        setWithdrawals(formattedWithdrawals);
        setIsLoading(false);

        const withdrawalService = (await import('@/lib/withdrawal-service')).default.getInstance();
        
        const unsubscribeNewRequest = withdrawalService.onRequestReceived((newRequest) => {
          setWithdrawals((prevWithdrawals) => [newRequest, ...prevWithdrawals]);
        });

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

          if (selectedRequest && selectedRequest.id === updatedRequest.id) {
            setSelectedRequest(updatedRequest);
          }
        });

        return () => {
          unsubscribeNewRequest();
          unsubscribeStatusUpdate();
        };
      } catch (error) {
        console.error('Error cargando retiros:', error);
        setIsLoading(false);
      }
    };

    loadWithdrawals();
  }, [selectedRequest]);

  const handleApprove = async (request: WithdrawalRequest) => {
    try {
      const { adminService } = await import('@/lib/admin-service');
      const success = await adminService.approveWithdrawal(request.id, 'admin-user-id');

      if (success) {
        toast.success('Retiro aprobado exitosamente');
        
        const updatedRequest = { 
          ...request, 
          status: 'completed' as WithdrawalRequest['status'], 
          processed_at: new Date().toISOString() 
        };
        
        setWithdrawals(prev => prev.map(w => 
          w.id === request.id ? updatedRequest : w
        ));
        
        if (selectedRequest?.id === request.id) {
          setSelectedRequest(updatedRequest);
        }
      } else {
        toast.error('Error al aprobar el retiro');
      }
    } catch (error) {
      console.error('Error aprobando retiro:', error);
      toast.error('Error al aprobar el retiro');
    }
  };

  const handleReject = async (request: WithdrawalRequest) => {
    try {
      const { adminService } = await import('@/lib/admin-service');
      const success = await adminService.rejectWithdrawal(
        request.id, 
        rejectionReason || 'Solicitud rechazada por el administrador',
        'admin-user-id'
      );

      if (success) {
        toast.success('Retiro rechazado');
        setRejectionReason("");
        
        setWithdrawals(prev => prev.map(w => 
          w.id === request.id 
            ? { 
                ...w, 
                status: 'rejected', 
                processed_at: new Date().toISOString(),
                notes: rejectionReason || 'Solicitud rechazada por el administrador'
              }
            : w
        ));
        
        setSelectedRequest(null);
      } else {
        toast.error('Error al rechazar el retiro');
      }
    } catch (error) {
      console.error('Error rechazando retiro:', error);
      toast.error('Error al rechazar el retiro');
    }
  };

  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
            <CheckCircle className="w-3 h-3" />
            Completado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
            <XCircle className="w-3 h-3" />
            Rechazado
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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredWithdrawals = withdrawals
    .filter(withdrawal => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = withdrawal.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return filter === 'all' || withdrawal.status === filter;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const stats = {
    pending: withdrawals.filter(w => w.status === 'pending').length,
    completed: withdrawals.filter(w => w.status === 'completed').length,
    rejected: withdrawals.filter(w => w.status === 'rejected').length,
    total: withdrawals.reduce((sum, w) => sum + w.amount, 0)
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Búsqueda y Filtros */}
        <Card className="bg-[#121212] border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0a0a0a] border-white/10 text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={filter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilter('pending')}
                  className={filter === 'pending' 
                    ? 'bg-amber-500 text-black' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Pendientes
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                  className={filter === 'completed' 
                    ? 'bg-green-500 text-black' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Completados
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setFilter('rejected')}
                  className={filter === 'rejected' 
                    ? 'bg-red-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Rechazados
                </Button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              Mostrando {filteredWithdrawals.length} de {withdrawals.length} solicitudes
            </div>
          </CardContent>
        </Card>

        {/* Lista de Retiros */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista */}
          <div className="lg:col-span-2">
            <Card className="bg-[#121212] border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  Solicitudes de Retiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin text-4xl">⟳</div>
                  </div>
                ) : filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No se encontraron solicitudes</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {filteredWithdrawals.map((withdrawal) => (
                      <div 
                        key={withdrawal.id} 
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedRequest?.id === withdrawal.id 
                            ? 'bg-blue-500/10 border-blue-500/50' 
                            : 'bg-[#0a0a0a] border-white/10 hover:border-blue-500/30'
                        }`}
                        onClick={() => setSelectedRequest(withdrawal)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white">{withdrawal.username}</h3>
                              {getStatusBadge(withdrawal.status)}
                            </div>
                            <p className="text-sm text-gray-400">{withdrawal.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-white">${withdrawal.amount}</p>
                            <p className="text-xs text-gray-500">USD</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(withdrawal.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detalles */}
          <div>
            <Card className="bg-[#121212] border-0 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Detalles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRequest ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Usuario:</span>
                        <span className="text-white font-medium">{selectedRequest.username}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white font-medium text-xs">{selectedRequest.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Monto:</span>
                        <span className="text-white font-bold">${selectedRequest.amount} USD</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Método:</span>
                        <span className="text-white font-medium">PayPal</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Fecha:</span>
                        <span className="text-white font-medium text-xs">{formatDate(selectedRequest.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Estado:</span>
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                      {selectedRequest.notes && (
                        <div className="pt-2">
                          <p className="text-sm text-gray-400 mb-1">Notas:</p>
                          <p className="text-sm bg-[#0a0a0a] p-3 rounded border border-white/10 text-white">{selectedRequest.notes}</p>
                        </div>
                      )}
                    </div>

                    {selectedRequest.status === 'pending' && (
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <Button 
                          onClick={() => handleApprove(selectedRequest)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aprobar Retiro
                        </Button>
                        
                        <Textarea 
                          placeholder="Razón del rechazo (opcional)"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="min-h-[80px] bg-[#0a0a0a] border-white/10 text-white"
                        />
                        <Button 
                          onClick={() => handleReject(selectedRequest)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar Retiro
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Selecciona una solicitud para ver los detalles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
