'use client';

import { useState, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

function AdminAccessContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
// Archivo temporalmente deshabilitado para permitir el build en Netlify
// Renombrado por Copilot
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificar que el usuario esté autenticado
      if (!user) {
        setError('Debes iniciar sesión para acceder a esta página');
        setLoading(false);
        return;
      }

      // Código de acceso temporal para desarrollo
      if (accessCode === 'admin123') {
        // Solución alternativa: usar localStorage para almacenar el rol de administrador
        try {
          // Guardar en localStorage
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminAccessGranted', new Date().toISOString());

          // Redirigir al panel de administración
          toast.success('Acceso de administrador concedido');
          router.push('/dashboard/admin');
        } catch (storageError) {
          console.error('Error al guardar en localStorage:', storageError);
          setError('Error al guardar permisos de administrador');
        }
      } else {
        setError('Código de acceso incorrecto');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Acceso Administrativo</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="accessCode" className="text-sm font-medium">
              Código de Acceso
            </label>
            <Input
              id="accessCode"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Ingresa el código de acceso"
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !accessCode}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Procesando...
              </>
            ) : (
              "Acceder"
            )}
          </Button>

          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => router.push('/dashboard')}
              className="text-sm"
            >
              Volver al Dashboard
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function AdminAccessPage() {
  return <AdminAccessContent />;
}
