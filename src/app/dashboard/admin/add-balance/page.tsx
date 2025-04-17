'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AddBalancePage() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Verificar si el usuario es administrador
  const [isAdmin, setIsAdmin] = useState(true); // Por simplicidad, asumimos que es admin

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error('Por favor ingresa un correo electrónico y un monto válido');
      return;
    }

    setIsLoading(true);

    try {
      // Usar el endpoint manual
      const response = await fetch('/api/admin/add-balance-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        setEmail('');
        setAmount('');
      } else {
        toast.error(data.message || 'Error al agregar balance');
      }
    } catch (error) {
      console.error('Error al agregar balance:', error);
      toast.error('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6 max-w-4xl mt-20">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              No tienes permisos para acceder a esta página.
            </p>
            <Button asChild>
              <Link href="/dashboard">Volver al Dashboard</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl mt-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Agregar Balance</h1>
          <p className="text-foreground/70 mt-1">
            Añade saldo a la cuenta de un usuario
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Correo Electrónico del Usuario
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Monto a Agregar (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={16} />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="pl-10"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Agregar Balance'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
