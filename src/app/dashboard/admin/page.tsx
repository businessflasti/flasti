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
  Filter
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
      }

      setStats(dashboardStats);

      // Cargar datos básicos para las tablas
      loadBasicData();
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    }
  };

  // Cargar datos básicos para las tablas
  const loadBasicData = async () => {
    // Cargar algunos usuarios de ejemplo
    setUsers([
      {
        user_id: '1234567890',
        first_name: 'Juan',
        last_name: 'Pérez',
        users: { email: 'juan@example.com' },
        balance: 120,
        level: 2,
        created_at: '2023-03-15'
      },
      {
        user_id: '0987654321',
        first_name: 'María',
        last_name: 'García',
        users: { email: 'maria@example.com' },
        balance: 85,
        level: 1,
        created_at: '2023-04-20'
      }
    ]);

    // Cargar algunos retiros pendientes de ejemplo
    setPendingWithdrawals([
      {
        id: 'WR-12345',
        profiles: { email: 'juan@example.com' },
        amount: 50,
        payment_method: 'PayPal',
        created_at: '2023-05-15',
        status: 'pending'
      },
      {
        id: 'WR-12346',
        profiles: { email: 'maria@example.com' },
        amount: 75,
        payment_method: 'PayPal',
        created_at: '2023-05-14',
        status: 'approved'
      }
    ]);

    // Cargar algunos tickets de soporte de ejemplo
    setSupportTickets([
      {
        id: 'C-12345',
        profiles: { email: 'juan@example.com' },
        subject: 'Problema con retiro',
        updated_at: new Date().toISOString(),
        status: 'open'
      },
      {
        id: 'C-12346',
        profiles: { email: 'maria@example.com' },
        subject: 'Consulta sobre comisiones',
        updated_at: new Date(Date.now() - 86400000).toISOString(), // Ayer
        status: 'closed'
      }
    ]);
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
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-[#10b981]">
                              Aprobar
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-destructive">
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
