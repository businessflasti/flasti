'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  CreditCard,
  MessageSquare,
  BarChart2,
  ShoppingCart,
  ArrowUpRight,
  Search,
  Filter,
  Activity
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/admin-service';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

function AdminDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalSales: 0,
    salesToday: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalAmount: 0,
    openConversations: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  
  // Estados para gestión premium
  const [premiumUserId, setPremiumUserId] = useState('');
  const [premiumEmail, setPremiumEmail] = useState('');
  const [isActivatingPremium, setIsActivatingPremium] = useState(false);
  const [premiumStats, setPremiumStats] = useState({
    totalPremium: 0,
    totalFree: 0,
    conversionRate: 0,
    premiumToday: 0
  });

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const adminStatus = await adminService.isAdmin(user.id);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        toast.error('No tienes permisos para acceder a esta página');
        router.push('/dashboard');
      } else {
        // Cargar estadísticas
        loadDashboardStats();
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, router]);

  // Manejar aprobación de retiro
  const handleApproveWithdrawal = async (withdrawalId: string) => {
    if (!user?.id) return;

    try {
      const success = await adminService.approveWithdrawal(withdrawalId, user.id);
      if (success) {
        toast.success('Retiro aprobado exitosamente');
        loadRealData(); // Recargar datos
      } else {
        toast.error('Error al aprobar el retiro');
      }
    } catch (error) {
      console.error('Error aprobando retiro:', error);
      toast.error('Error al aprobar el retiro');
    }
  };

  // Manejar rechazo de retiro
  const handleRejectWithdrawal = async (withdrawalId: string) => {
    if (!user?.id) return;

    const reason = prompt('Ingresa la razón del rechazo:');
    if (!reason) return;

    try {
      const success = await adminService.rejectWithdrawal(withdrawalId, reason, user.id);
      if (success) {
        toast.success('Retiro rechazado');
        loadRealData(); // Recargar datos
      } else {
        toast.error('Error al rechazar el retiro');
      }
    } catch (error) {
      console.error('Error rechazando retiro:', error);
      toast.error('Error al rechazar el retiro');
    }
  };

  // Cargar estadísticas del panel de administración
  const loadDashboardStats = async () => {
    try {
      const dashboardStats = await adminService.getDashboardStats();

      // Obtener el número de conversaciones abiertas directamente de Supabase
      try {
        const { count, error } = await supabase
          .from('chat_conversations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');

        if (!error && count !== null) {
          dashboardStats.openConversations = count;
        }
      } catch (chatError) {
        console.error('Error al cargar conversaciones de soporte:', chatError);
        dashboardStats.openConversations = 0;
      }

      setStats(dashboardStats);

      // Cargar datos reales para las tablas
      loadRealData();
      
      // Cargar estadísticas premium
      loadPremiumStats();
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    }
  };

  // Cargar estadísticas premium
  const loadPremiumStats = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_users_stats')
        .select('*')
        .single();

      if (!error && data) {
        setPremiumStats({
          totalPremium: data.total_premium_users || 0,
          totalFree: data.total_free_users || 0,
          conversionRate: data.premium_conversion_rate || 0,
          premiumToday: data.premium_users_today || 0
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas premium:', error);
    }
  };

  // Activar premium manualmente
  const handleActivatePremium = async () => {
    if (!premiumUserId && !premiumEmail) {
      toast.error('Ingresa un UUID de usuario o email');
      return;
    }

    setIsActivatingPremium(true);

    try {
      const response = await fetch('/api/admin/activate-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: premiumUserId || undefined,
          email: premiumEmail || undefined,
          paymentMethod: 'manual_admin'
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Premium activado exitosamente');
        setPremiumUserId('');
        setPremiumEmail('');
        loadPremiumStats(); // Recargar estadísticas
      } else {
        toast.error(result.error || 'Error activando premium');
      }
    } catch (error) {
      console.error('Error activando premium:', error);
      toast.error('Error activando premium');
    } finally {
      setIsActivatingPremium(false);
    }
  };

  // Verificar estado premium
  const handleCheckPremiumStatus = async () => {
    if (!premiumUserId && !premiumEmail) {
      toast.error('Ingresa un UUID de usuario o email');
      return;
    }

    try {
      const params = new URLSearchParams();
      if (premiumUserId) params.append('userId', premiumUserId);
      if (premiumEmail) params.append('email', premiumEmail);

      const response = await fetch(`/api/admin/activate-premium?${params}`);
      const result = await response.json();

      if (response.ok) {
        const status = result.isPremium ? 'Premium' : 'Gratuito';
        const activatedAt = result.activatedAt 
          ? new Date(result.activatedAt).toLocaleString() 
          : 'N/A';
        const paymentMethod = result.paymentMethod || 'N/A';

        toast.success(`Estado: ${status} | Activado: ${activatedAt} | Método: ${paymentMethod}`);
      } else {
        toast.error(result.error || 'Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error verificando estado premium:', error);
      toast.error('Error verificando estado premium');
    }
  };

  // Cargar datos reales para las tablas
  const loadRealData = async () => {
    try {
      // Cargar usuarios reales
      const realUsers = await adminService.getUsers(10);
      const formattedUsers = realUsers.map(user => ({
        user_id: user.user_id,
        first_name: user.email.split('@')[0],
        last_name: '',
        users: { email: user.email },
        balance: user.balance,
        level: user.balance > 100 ? 3 : user.balance > 50 ? 2 : 1,
        created_at: user.created_at
      }));
      setUsers(formattedUsers);

      // Cargar retiros pendientes reales
      const realWithdrawals = await adminService.getWithdrawalRequests('pending');
      const formattedWithdrawals = realWithdrawals.map(withdrawal => ({
        id: withdrawal.id,
        profiles: { email: withdrawal.user_email },
        amount: withdrawal.amount,
        payment_method: withdrawal.payment_method,
        created_at: withdrawal.created_at,
        status: withdrawal.status
      }));
      setPendingWithdrawals(formattedWithdrawals);

      // Cargar tickets de soporte (mantener ejemplo por ahora)
      setSupportTickets([
        {
          id: 'C-12345',
          profiles: { email: 'soporte@flasti.com' },
          subject: 'Sistema funcionando correctamente',
          updated_at: new Date().toISOString(),
          status: 'open'
        }
      ]);

    } catch (error) {
      console.error('Error cargando datos reales:', error);
      // Fallback a datos vacíos
      setUsers([]);
      setPendingWithdrawals([]);
      setSupportTickets([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-primary mb-2">⟳</div>
        <p className="ml-2">Cargando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
        <p className="text-foreground/70 mb-6">No tienes permisos para acceder a esta página</p>
        <Button onClick={() => router.push('/dashboard')}>
          Volver al Inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-foreground/70 mt-1">
            Gestiona usuarios, retiros y estadísticas de la plataforma
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/add-balance">
            <Button className="flex items-center gap-2">
              <DollarSign size={16} />
              Agregar Balance
            </Button>
          </Link>
          <Link href="/dashboard/admin/retiros">
            <Button className="flex items-center gap-2" variant="outline">
              <CreditCard size={16} />
              Gestionar Retiros
            </Button>
          </Link>
          <Link href="/dashboard/admin/webhooks">
            <Button className="flex items-center gap-2" variant="outline">
              <Activity size={16} />
              Monitor Webhooks
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-card/50 hover:bg-card/70 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground/60 text-sm">Usuarios Totales</p>
              <h3 className="text-3xl font-bold mt-1">{stats.totalUsers}</h3>
              <p className="text-foreground/60 text-xs mt-2">
                <span className="text-[#10b981]">+{stats.newUsersToday}</span> hoy
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#9333ea]/10 flex items-center justify-center">
              <Users size={20} className="text-[#9333ea]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 hover:bg-card/70 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground/60 text-sm">Ventas Totales</p>
              <h3 className="text-3xl font-bold mt-1">${stats.totalSales.toFixed(2)}</h3>
              <p className="text-foreground/60 text-xs mt-2">
                <span className="text-[#10b981]">${stats.salesToday.toFixed(2)}</span> hoy
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center">
              <ShoppingCart size={20} className="text-[#10b981]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 hover:bg-card/70 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground/60 text-sm">Retiros Pendientes</p>
              <h3 className="text-3xl font-bold mt-1">{stats.pendingWithdrawals}</h3>
              <p className="text-foreground/60 text-xs mt-2">
                <span className="text-[#ec4899]">${stats.pendingWithdrawalAmount.toFixed(2)}</span> en total
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#ec4899]/10 flex items-center justify-center">
              <CreditCard size={20} className="text-[#ec4899]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 hover:bg-card/70 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground/60 text-sm">Conversaciones Abiertas</p>
              <h3 className="text-3xl font-bold mt-1">{stats.openConversations}</h3>
              <p className="text-foreground/60 text-xs mt-2">
                <span className="text-[#facc15]">Soporte</span> activo
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#facc15]/10 flex items-center justify-center">
              <MessageSquare size={20} className="text-[#facc15]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pestañas de administración */}
      <Tabs defaultValue="withdrawals" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="withdrawals" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Retiros</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span>Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Soporte</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart2 size={16} />
            <span>Estadísticas</span>
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Premium</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Solicitudes de Retiro</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por usuario o ID..."
                className="max-w-xs"
              />
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Search size={16} />
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-foreground/5">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Monto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Método</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {pendingWithdrawals.length > 0 ? (
                    pendingWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-4 py-3 text-sm">{withdrawal.id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm">{withdrawal.profiles?.email || 'Usuario'}</td>
                        <td className="px-4 py-3 text-sm font-medium">${withdrawal.amount?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3 text-sm">{withdrawal.payment_method || 'PayPal'}</td>
                        <td className="px-4 py-3 text-sm text-foreground/70">
                          {withdrawal.created_at ? new Date(withdrawal.created_at).toLocaleDateString() : 'No disponible'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                            Pendiente
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 text-xs text-[#10b981]"
                              onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              disabled={withdrawal.status !== 'pending'}
                            >
                              Aprobar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 text-xs text-destructive"
                              onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              disabled={withdrawal.status !== 'pending'}
                            >
                              Rechazar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">
                        No hay retiros pendientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border/30 flex items-center justify-between">
              <p className="text-sm text-foreground/70">Mostrando {pendingWithdrawals.length} {pendingWithdrawals.length === 1 ? 'retiro pendiente' : 'retiros pendientes'}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end mt-4">
            <Link href="/dashboard/admin/withdrawals">
              <Button variant="link" className="flex items-center gap-1 text-primary">
                Ver todas las solicitudes
                <ArrowUpRight size={14} />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar usuario..."
                className="max-w-xs"
              />
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Search size={16} />
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-foreground/5">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Balance</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Nivel</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Registro</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.user_id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-4 py-3 text-sm">{user.user_id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm">{user.first_name} {user.last_name}</td>
                        <td className="px-4 py-3 text-sm">{user.users?.email || 'No disponible'}</td>
                        <td className="px-4 py-3 text-sm font-medium">${user.balance?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.level === 3 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                            user.level === 2 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                            Nivel {user.level || 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground/70">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'No disponible'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              Ver
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              Editar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">
                        No hay usuarios para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border/30 flex items-center justify-between">
              <p className="text-sm text-foreground/70">Mostrando {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end mt-4">
            <Link href="/dashboard/admin/users">
              <Button variant="link" className="flex items-center gap-1 text-primary">
                Ver todos los usuarios
                <ArrowUpRight size={14} />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Soporte al Cliente</h2>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard/admin/support">
                  Ver panel de soporte completo
                </Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-foreground/5">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Asunto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Último mensaje</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {supportTickets.length > 0 ? (
                    supportTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-4 py-3 text-sm">{ticket.id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm">{ticket.profiles?.email || 'Usuario'}</td>
                        <td className="px-4 py-3 text-sm">{ticket.subject || 'Sin asunto'}</td>
                        <td className="px-4 py-3 text-sm text-foreground/70">
                          {ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : 'No disponible'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'open' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                          }`}>
                            {ticket.status === 'open' ? 'Abierto' : 'Cerrado'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                            {ticket.status === 'open' ? 'Responder' : 'Ver'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                        No hay conversaciones de soporte
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border/30 flex items-center justify-between">
              <p className="text-sm text-foreground/70">Mostrando {supportTickets.length} {supportTickets.length === 1 ? 'conversación' : 'conversaciones'}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end mt-4">
            <Link href="/dashboard/admin/support">
              <Button variant="link" className="flex items-center gap-1 text-primary">
                Ver todas las conversaciones
                <ArrowUpRight size={14} />
              </Button>
            </Link>
          </div>

          {/* Mostrar conversaciones recientes */}
          <div className="mt-4">
            <p className="text-sm text-foreground/60 mb-2">Conversaciones recientes:</p>
            <div className="space-y-2">
              {stats.openConversations > 0 ? (
                <p className="text-sm">Hay {stats.openConversations} conversaciones abiertas que requieren atención.</p>
              ) : (
                <p className="text-sm">No hay conversaciones abiertas en este momento.</p>
              )}
              <Button asChild className="w-full">
                <Link href="/dashboard/admin/support">Ir al panel de soporte</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Estadísticas Detalladas</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Últimos 7 días
              </Button>
              <Button variant="outline" size="sm">
                Últimos 30 días
              </Button>
              <Button variant="outline" size="sm">
                Este año
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Ventas por App</h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-foreground/50">Gráfico de ventas por app</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Nuevos Usuarios</h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-foreground/50">Gráfico de nuevos usuarios</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Retiros por Método</h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-foreground/50">Gráfico de retiros por método</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Comisiones Pagadas</h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-foreground/50">Gráfico de comisiones pagadas</p>
              </div>
            </Card>
          </div>

          <div className="flex justify-end mt-4">
            <Link href="/dashboard/admin/stats">
              <Button variant="link" className="flex items-center gap-1 text-primary">
                Ver estadísticas avanzadas
                <ArrowUpRight size={14} />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Gestión Premium</h2>
          </div>

          {/* Estadísticas Premium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-card/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#10b981]">{premiumStats.totalPremium}</p>
                <p className="text-sm text-foreground/60">Usuarios Premium</p>
              </div>
            </Card>
            <Card className="p-4 bg-card/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#6b7280]">{premiumStats.totalFree}</p>
                <p className="text-sm text-foreground/60">Usuarios Gratuitos</p>
              </div>
            </Card>
            <Card className="p-4 bg-card/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#9333ea]">{premiumStats.conversionRate}%</p>
                <p className="text-sm text-foreground/60">Tasa Conversión</p>
              </div>
            </Card>
            <Card className="p-4 bg-card/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#facc15]">{premiumStats.premiumToday}</p>
                <p className="text-sm text-foreground/60">Premium Hoy</p>
              </div>
            </Card>
          </div>

          {/* Panel de Activación Manual */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Activar Premium Manualmente</h3>
            <p className="text-sm text-foreground/60 mb-6">
              Puedes activar premium para un usuario usando su UUID o email. Solo necesitas uno de los dos campos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">UUID del Usuario</label>
                <Input
                  placeholder="ej: 123e4567-e89b-12d3-a456-426614174000"
                  value={premiumUserId}
                  onChange={(e) => setPremiumUserId(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-foreground/50 mt-1">
                  Puedes encontrar el UUID en la tabla de usuarios arriba
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">O Email del Usuario</label>
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={premiumEmail}
                  onChange={(e) => setPremiumEmail(e.target.value)}
                />
                <p className="text-xs text-foreground/50 mt-1">
                  Alternativa si no tienes el UUID
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleActivatePremium}
                disabled={isActivatingPremium || (!premiumUserId && !premiumEmail)}
                className="bg-[#10b981] hover:bg-[#059669] text-white"
              >
                {isActivatingPremium ? (
                  <>
                    <div className="animate-spin mr-2">⟳</div>
                    Activando...
                  </>
                ) : (
                  'Activar Premium'
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleCheckPremiumStatus}
                disabled={!premiumUserId && !premiumEmail}
              >
                Verificar Estado
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setPremiumUserId('');
                  setPremiumEmail('');
                }}
              >
                Limpiar
              </Button>
            </div>
          </Card>

          {/* Instrucciones */}
          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-medium mb-3 text-blue-900 dark:text-blue-100">
              📋 Instrucciones de Uso
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p><strong>1. Activar Premium:</strong> Ingresa el UUID o email del usuario y haz clic en "Activar Premium"</p>
              <p><strong>2. Verificar Estado:</strong> Usa "Verificar Estado" para comprobar si un usuario ya es premium</p>
              <p><strong>3. Encontrar UUID:</strong> Ve a la pestaña "Usuarios" para ver los UUIDs de los usuarios registrados</p>
              <p><strong>4. Resultado:</strong> Una vez activado, el usuario verá las microtareas desbloqueadas inmediatamente</p>
            </div>
          </Card>

          {/* Acciones Rápidas */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Acciones Rápidas</h3>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                onClick={loadPremiumStats}
                className="flex items-center gap-2"
              >
                <BarChart2 size={16} />
                Actualizar Estadísticas
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // Copiar ejemplo de UUID para testing
                  navigator.clipboard.writeText('123e4567-e89b-12d3-a456-426614174000');
                  toast.success('UUID de ejemplo copiado al portapapeles');
                }}
                className="flex items-center gap-2"
              >
                📋 Copiar UUID de Ejemplo
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-primary mb-2">⟳</div><p className="ml-2">Cargando...</p></div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
