'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Crown,
  X,
  Search,
  ArrowLeft,
  DollarSign
} from "lucide-react";
import CountryFlag from '@/components/ui/CountryFlag';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/admin-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface User {
  user_id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  created_at: string;
  last_sign_in_at?: string | null;
  is_premium: boolean;
  premium_activated_at?: string;
  country?: string | null;
  device_type?: string | null;
  os?: string;
}

export default function UsersManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'dayBeforeYesterday' | 'lastWeek' | 'month' | 'year'>('all');
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [addBalanceUserId, setAddBalanceUserId] = useState<string | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<string>('');

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
        loadUsers();
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, router]);

  // Suscripción en tiempo real para cambios en user_profiles
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('user_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
        },
        (payload) => {
          // Actualizar el usuario en la lista cuando cambia su perfil
          if (payload.new) {
            setUsers((prevUsers) =>
              prevUsers.map((u) =>
                u.user_id === payload.new.user_id
                  ? {
                      ...u,
                      first_name: payload.new.first_name,
                      last_name: payload.new.last_name,
                    }
                  : u
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  // Cargar todos los usuarios
  const loadUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('No hay sesión activa');
        return;
      }

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al cargar usuarios');
      }

      console.log('📊 Usuarios cargados:', result.users.length);
      console.log('👤 Usuarios con nombre:', result.users.filter((u: User) => u.first_name || u.last_name).length);
      console.log('📝 Ejemplo de usuario con nombre:', result.users.find((u: User) => u.first_name));
      
      setUsers(result.users);
      setFilteredUsers(result.users);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.error('Error al cargar usuarios');
    }
  };

  // Filtrar usuarios por búsqueda y fecha
  useEffect(() => {
    let filtered = users;

    // Filtrar por búsqueda (solo email)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(u => {
        const userDate = new Date(u.created_at);
        
        if (dateFilter === 'today') {
          return userDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          return userDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === 'dayBeforeYesterday') {
          const dayBefore = new Date(now);
          dayBefore.setDate(dayBefore.getDate() - 2);
          return userDate.toDateString() === dayBefore.toDateString();
        } else if (dateFilter === 'lastWeek') {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return userDate >= weekAgo && userDate <= now;
        } else if (dateFilter === 'month') {
          return userDate.getMonth() === now.getMonth() && 
                 userDate.getFullYear() === now.getFullYear();
        } else if (dateFilter === 'year') {
          return userDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [searchTerm, dateFilter, users]);

  // Activar premium
  const handleActivatePremium = async (userId: string, email: string) => {
    setProcessingUserId(userId);

    try {
      const response = await fetch('/api/admin/activate-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          email: email,
          paymentMethod: 'manual_admin'
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Premium activado exitosamente');
        loadUsers(); // Recargar lista
      } else {
        toast.error(result.error || 'Error activando premium');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error activando premium');
    } finally {
      setProcessingUserId(null);
    }
  };

  // Desactivar premium
  const handleDeactivatePremium = async (userId: string) => {
    setProcessingUserId(userId);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_premium: false,
          premium_activated_at: null
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Premium desactivado exitosamente');
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error desactivando premium');
    } finally {
      setProcessingUserId(null);
    }
  };

  // Añadir saldo
  const handleAddBalance = async (email: string) => {
    if (!balanceAmount || parseFloat(balanceAmount) === 0) {
      toast.error('Ingresa un monto válido (diferente de 0)');
      return;
    }

    const amount = parseFloat(balanceAmount);
    const isNegative = amount < 0;

    try {
      const response = await fetch('/api/admin/add-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          amount: amount
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (isNegative) {
          toast.success(`$${Math.abs(amount)} restados exitosamente`);
        } else {
          toast.success(`$${amount} agregados exitosamente`);
        }
        setBalanceAmount('');
        setAddBalanceUserId(null);
        loadUsers();
      } else {
        toast.error(result.message || 'Error modificando saldo');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error modificando saldo');
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black">
        <h1 className="text-3xl font-bold mb-4 text-white">Acceso Restringido</h1>
        <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Búsqueda y Filtros */}
        <Card className="bg-[#1a1a1a] border-blue-500/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda */}
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

              {/* Filtro de fecha */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={dateFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('all')}
                  className={dateFilter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  variant={dateFilter === 'today' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('today')}
                  className={dateFilter === 'today' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Hoy
                </Button>
                <Button
                  size="sm"
                  variant={dateFilter === 'yesterday' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('yesterday')}
                  className={dateFilter === 'yesterday' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Ayer
                </Button>
                <Button
                  size="sm"
                  variant={dateFilter === 'dayBeforeYesterday' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('dayBeforeYesterday')}
                  className={dateFilter === 'dayBeforeYesterday' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Antes de ayer
                </Button>
                <Button
                  size="sm"
                  variant={dateFilter === 'lastWeek' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('lastWeek')}
                  className={dateFilter === 'lastWeek' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Última semana
                </Button>
                <Button
                  size="sm"
                  variant={dateFilter === 'month' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('month')}
                  className={dateFilter === 'month' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Este Mes
                </Button>
                <Button
                  size="sm"
                  variant={dateFilter === 'year' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('year')}
                  className={dateFilter === 'year' 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/10 text-white hover:bg-white/10'}
                >
                  Este Año
                </Button>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="mt-4 text-sm text-gray-400">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuarios */}
        <Card className="bg-[#1a1a1a] border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Usuarios Registrados ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-400 min-w-[180px]">Fecha de Registro</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-400 min-w-[200px]">Email / Nombre</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-400 min-w-[100px]">País</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-400 min-w-[120px]">Estado</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-400 min-w-[120px]">Dispositivo</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-400 min-w-[180px]">Último Acceso</th>
                    <th className="text-right py-3 px-4 text-sm font-bold text-gray-400 min-w-[150px]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.user_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-sm text-white min-w-[180px]">
                        {new Date(u.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-white font-medium">{u.email}</span>
                          {(u.first_name || u.last_name) && (
                            <span className="text-xs text-gray-400">
                              {`${u.first_name || ''} ${u.last_name || ''}`.trim()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {u.country ? (
                          <div className="flex items-center justify-center gap-2">
                            <CountryFlag countryCode={u.country} size="sm" />
                            <span className="text-xs text-gray-400">{u.country}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {u.is_premium ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                            <Crown className="w-3 h-3" />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">
                            Gratuito
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-white font-medium">
                            {u.device_type === 'mobile' ? '📱 Móvil' : u.device_type === 'desktop' ? '💻 Desktop' : '❓ Desconocido'}
                          </span>
                          {u.os && u.os !== 'Desconocido' && (
                            <span className="text-xs text-gray-400">
                              {u.os}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-white min-w-[180px]">
                        {u.last_sign_in_at ? (
                          new Date(u.last_sign_in_at).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        ) : (
                          <span className="text-gray-500 italic">Nunca</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Botón Añadir Saldo */}
                          {addBalanceUserId === u.user_id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="+10 o -5"
                                value={balanceAmount}
                                onChange={(e) => setBalanceAmount(e.target.value)}
                                className="w-28 h-8 bg-[#0a0a0a] border-white/10 text-white text-sm"
                                autoFocus
                                step="0.01"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddBalance(u.email)}
                                className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20 h-8"
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setAddBalanceUserId(null);
                                  setBalanceAmount('');
                                }}
                                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 h-8"
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setAddBalanceUserId(u.user_id)}
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20"
                              title="Agregar o restar saldo"
                            >
                              <DollarSign className="w-3 h-3 mr-1" />
                              ± Saldo
                            </Button>
                          )}

                          {/* Botón Premium */}
                          {u.is_premium ? (
                            <Button
                              size="sm"
                              onClick={() => handleDeactivatePremium(u.user_id)}
                              disabled={processingUserId === u.user_id}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
                            >
                              <X className="w-3 h-3 mr-1" />
                              {processingUserId === u.user_id ? 'Procesando...' : 'Quitar Premium'}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleActivatePremium(u.user_id, u.email)}
                              disabled={processingUserId === u.user_id}
                              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              {processingUserId === u.user_id ? 'Activando...' : 'Activar Premium'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No se encontraron usuarios</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
