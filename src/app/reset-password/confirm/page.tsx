'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión válida del enlace de recuperación
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsValidSession(true);
      } else {
        toast.error('El enlace ha expirado o es inválido');
      }
      setIsChecking(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast.success('¡Contraseña actualizada correctamente!');
      setIsLoading(false);

    } catch (error: any) {
      toast.error('Error al actualizar la contraseña');
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: '#F6F3F3' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0D50A4] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F6F3F3' }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo/isotipo-web.png" 
            alt="Flasti" 
            width={64} 
            height={64} 
            className="object-contain"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>
            {isSuccess ? '¡Listo!' : 'Nueva contraseña'}
          </h1>
          <p style={{ color: '#6B7280' }}>
            {isSuccess ? 'Tu contraseña ha sido actualizada' : 'Ingresa tu nueva contraseña'}
          </p>
        </div>

        <div className="rounded-2xl p-8 border-0" style={{ backgroundColor: '#FFFFFF' }}>
          {!isValidSession && !isSuccess ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: '#EF4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
                Enlace inválido o expirado
              </h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Por favor, solicita un nuevo enlace de recuperación
              </p>
              <Button
                onClick={() => router.push('/reset-password')}
                className="w-full py-3 h-12 text-white font-medium rounded-lg"
                style={{ backgroundColor: '#0D50A4' }}
              >
                Solicitar nuevo enlace
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
                Tu contraseña ha sido cambiada con éxito
              </h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Ya puedes iniciar sesión con tu nueva contraseña
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full py-3 h-12 text-white font-medium rounded-lg"
                style={{ backgroundColor: '#0D50A4' }}
              >
                Iniciar sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm mb-2 font-medium" style={{ color: '#111827' }}>
                  Nueva contraseña
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full py-3 px-4 h-12 border-0 rounded-lg"
                  style={{ backgroundColor: '#F3F3F3', color: '#111827' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm mb-2 font-medium" style={{ color: '#111827' }}>
                  Confirmar nueva contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  className="w-full py-3 px-4 h-12 border-0 rounded-lg"
                  style={{ backgroundColor: '#F3F3F3', color: '#111827' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 h-12 text-white font-semibold rounded-lg mt-6"
                style={{ backgroundColor: '#0D50A4' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  'Cambiar contraseña'
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
