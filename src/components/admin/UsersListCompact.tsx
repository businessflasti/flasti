'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Crown, X, Search, DollarSign, Trash2, Monitor, Smartphone, Tablet } from "lucide-react";
import CountryFlag from '@/components/ui/CountryFlag';
import EmailRecoveryBadge from '@/components/admin/EmailRecoveryBadge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface User {
  user_id: string;
  email: string;
  created_at: string;
  is_premium: boolean;
  premium_activated_at?: string;
  country?: string | null;
  device_type?: string | null;
  balance?: number;
}

const getDeviceIcon = (deviceType: string | null | undefined) => {
  if (!deviceType) return <Monitor className="w-4 h-4 text-gray-600" />;
  
  const type = deviceType.toLowerCase();
  if (type.includes('mobile') || type.includes('phone')) {
    return <Smartphone className="w-4 h-4 text-blue-400" />;
  } else if (type.includes('tablet')) {
    return <Tablet className="w-4 h-4 text-purple-400" />;
  } else {
    return <Monitor className="w-4 h-4 text-green-400" />;
  }
};

const getDeviceLabel = (deviceType: string | null | undefined) => {
  if (!deviceType) return 'Desconocido';
  
  const type = deviceType.toLowerCase();
  if (type.includes('mobile') || type.includes('phone')) {
    return 'Móvil';
  } else if (type.includes('tablet')) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
};

export default function UsersListCompact() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'dayBeforeYesterday' | 'lastWeek' | 'month' | 'year'>('today');
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addBalanceUserId, setAddBalanceUserId] = useState<string | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
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

      setUsers(result.users);
      setFilteredUsers(result.users);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios
  useEffect(() => {
    let filtered = users;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
        loadUsers();
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
      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error desactivando premium');
    } finally {
      setProcessingUserId(null);
    }
  };

  // Añadir saldo (Work)
  const handleAddBalance = async (email: string) => {
    if (!balanceAmount || parseFloat(balanceAmount) <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    try {
      const response = await fetch('/api/admin/add-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          amount: parseFloat(balanceAmount)
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`$${balanceAmount} agregados exitosamente`);
        setBalanceAmount('');
        setAddBalanceUserId(null);
        loadUsers();
      } else {
        toast.error(result.message || 'Error añadiendo saldo');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error añadiendo saldo');
    }
  };



  // Eliminar usuario definitivamente
  const handleDeleteUser = async (userId: string, email: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar definitivamente a ${email}?\n\nEsta acción NO se puede deshacer y eliminará:\n- Su cuenta de autenticación\n- Su perfil\n- Todo su historial\n\n¿Continuar?`
    );

    if (!confirmed) return;

    setDeletingUserId(userId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('No hay sesión activa');
        return;
      }

      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Usuario eliminado definitivamente');
        loadUsers();
      } else {
        toast.error(result.error || 'Error eliminando usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error eliminando usuario');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1a1a1a] border-blue-500/20">
        <CardContent className="p-12 text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando usuarios...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda y Filtros */}
      <Card className="bg-[#1a1a1a] border-blue-500/20">
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-400">Email</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-400">Balance</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-400">País</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-400">Dispositivo</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-400">Estado</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-400">Correos</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.user_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">{u.email}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(u.created_at).toLocaleDateString('es-ES', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-bold text-green-400">
                        ${(u.balance || 0).toFixed(2)}
                      </span>
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
                      <div className="flex items-center justify-center gap-2">
                        {getDeviceIcon(u.device_type)}
                        <span className="text-xs text-gray-400">{getDeviceLabel(u.device_type)}</span>
                      </div>
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
                    
                    {/* Columna de Correos */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <EmailRecoveryBadge 
                          userId={u.user_id}
                          userEmail={u.email}
                          userName={u.email.split('@')[0]}
                        />
                      </div>
                    </td>

                    {/* Columna de Acciones */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón Añadir Saldo */}
                        {addBalanceUserId === u.user_id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Monto"
                              value={balanceAmount}
                              onChange={(e) => setBalanceAmount(e.target.value)}
                              className="w-24 h-8 bg-[#0a0a0a] border-white/10 text-white text-sm"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddBalance(u.email)}
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20 h-8 w-8 p-0"
                              title="Confirmar"
                            >
                              ✓
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setAddBalanceUserId(null);
                                setBalanceAmount('');
                              }}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 h-8 w-8 p-0"
                              title="Cancelar"
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setAddBalanceUserId(u.user_id)}
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20 w-8 h-8 p-0"
                            title="Añadir Saldo USD"
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Botón Premium */}
                        {u.is_premium ? (
                          <Button
                            size="sm"
                            onClick={() => handleDeactivatePremium(u.user_id)}
                            disabled={processingUserId === u.user_id}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 w-8 h-8 p-0"
                            title="Quitar Premium"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleActivatePremium(u.user_id, u.email)}
                            disabled={processingUserId === u.user_id}
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold w-8 h-8 p-0"
                            title="Activar Premium"
                          >
                            <Crown className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Botón Eliminar Usuario */}
                        <Button
                          size="sm"
                          onClick={() => handleDeleteUser(u.user_id, u.email)}
                          disabled={deletingUserId === u.user_id}
                          className="bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-600/20 w-8 h-8 p-0"
                          title="Eliminar Usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
  );
}
