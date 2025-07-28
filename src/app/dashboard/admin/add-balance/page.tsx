'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, DollarSign, User, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/admin-service';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AddBalancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    reason: ''
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
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.amount || !formData.reason) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('El monto debe ser un número positivo');
      return;
    }

    setSubmitting(true);

    try {
      const success = await adminService.addUserBalance(
        formData.userId,
        amount,
        formData.reason,
        user!.id
      );

      if (success) {
        toast.success('Saldo agregado exitosamente');
        setFormData({ userId: '', amount: '', reason: '' });
      } else {
        toast.error('Error al agregar saldo');
      }
    } catch (error) {
      console.error('Error agregando saldo:', error);
      toast.error('Error al agregar saldo');
    } finally {
      setSubmitting(false);
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
    <div className="container mx-auto p-6 max-w-2xl mt-20">
      {/* Back Button */}
      <Link 
        href="/dashboard/admin" 
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm mb-6"
      >
        <ArrowLeft size={16} />
        <span>Volver al Panel Admin</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-primary" />
          Agregar Saldo a Usuario
        </h1>
        <p className="text-foreground/70">
          Agrega saldo manualmente a la cuenta de un usuario
        </p>
      </div>

      {/* Form */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Formulario de Ajuste de Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ID del Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Ingresa el UUID del usuario"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Puedes encontrar el ID del usuario en la lista de usuarios del panel admin
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Monto a Agregar
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ingresa el monto en USD que deseas agregar al saldo del usuario
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Razón del Ajuste
              </label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Describe la razón por la cual estás agregando este saldo..."
                className="min-h-[100px]"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Esta información se guardará en los logs para auditoría
              </p>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-yellow-400 mt-0.5">⚠️</div>
                <div>
                  <h4 className="font-medium text-yellow-400 mb-1">Advertencia</h4>
                  <p className="text-sm text-yellow-300">
                    Esta acción agregará saldo real al usuario. Asegúrate de que la información sea correcta antes de continuar.
                    Esta operación quedará registrada en los logs de auditoría.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Agregar Saldo
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6 bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-400 mb-2">Instrucciones</h3>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• El ID del usuario es un UUID que puedes encontrar en la lista de usuarios</li>
            <li>• El monto se agregará al saldo actual del usuario</li>
            <li>• La razón es obligatoria para mantener un registro de auditoría</li>
            <li>• Esta acción es irreversible, verifica los datos antes de confirmar</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}