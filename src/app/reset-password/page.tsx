'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

type Step = 'email' | 'password' | 'success';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('email');

  // Verificar si el email existe en Supabase
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email) {
        toast.error('Por favor, introduce tu correo electrónico');
        setIsLoading(false);
        return;
      }

      // Verificar si el usuario existe en user_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (profileError || !profileData) {
        toast.error('No se encontró una cuenta con este correo electrónico');
        setIsLoading(false);
        return;
      }

      // Usuario encontrado, pasar al paso de contraseña
      setStep('password');
      toast.success('Usuario verificado. Ingresa tu nueva contraseña');
      setIsLoading(false);

    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al verificar el correo electrónico');
      setIsLoading(false);
    }
  };

  // Cambiar la contraseña usando la API
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones
      if (newPassword !== confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        setIsLoading(false);
        return;
      }

      // Llamar a la API para actualizar la contraseña
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al cambiar la contraseña');
        setIsLoading(false);
        return;
      }

      // Éxito
      setStep('success');
      setIsLoading(false);

    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al cambiar la contraseña');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ backgroundColor: '#F6F3F3' }}>

      <div className="w-full max-w-md relative z-10" style={{ contain: 'layout style' }}>
        {/* Logo centrado */}
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
            {step === 'success' ? '¡Listo!' : 'Restablecer contraseña'}
          </h1>
          <p style={{ color: '#6B7280' }}>
            {step === 'email' && 'Introduce tu correo electrónico para verificar tu cuenta'}
            {step === 'password' && 'Ingresa tu nueva contraseña'}
            {step === 'success' && 'Tu contraseña ha sido actualizada'}
          </p>
        </div>

        <div className="rounded-2xl p-8 border-0 relative overflow-hidden" style={{ contain: 'layout style paint', backgroundColor: '#FFFFFF' }}>
          
          <div className="relative z-10">
            {/* Paso 1: Email */}
            {step === 'email' && (
              <form className="space-y-4" onSubmit={handleEmailSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 font-medium" style={{ color: '#111827' }}>
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full py-3 px-4 h-12 border-0 rounded-lg focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                    style={{ backgroundColor: '#F3F3F3', color: '#111827' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 h-12 text-white font-semibold rounded-lg transition-all duration-200 mt-6"
                  style={{ backgroundColor: '#0D50A4' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span className="text-sm">Verificando...</span>
                    </div>
                  ) : (
                    "Continuar"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm hover:underline transition-colors duration-200" style={{ color: '#0D50A4' }}>
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            )}

            {/* Paso 2: Nueva contraseña */}
            {step === 'password' && (
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                  <p className="text-sm" style={{ color: '#0D50A4' }}>
                    Cuenta verificada: <strong>{email}</strong>
                  </p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm mb-2 font-medium" style={{ color: '#111827' }}>
                    Nueva contraseña
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    className="w-full py-3 px-4 h-12 border-0 rounded-lg focus:ring-0 focus:ring-offset-0 transition-all duration-200"
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
                    className="w-full py-3 px-4 h-12 border-0 rounded-lg focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                    style={{ backgroundColor: '#F3F3F3', color: '#111827' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 h-12 text-white font-semibold rounded-lg transition-all duration-200 mt-6"
                  style={{ backgroundColor: '#0D50A4' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span className="text-sm">Actualizando...</span>
                    </div>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => window.location.reload()}
                    className="text-sm hover:underline transition-colors duration-200" 
                    style={{ color: '#0D50A4' }}
                  >
                    ← Volver atrás
                  </button>
                </div>
              </form>
            )}

            {/* Paso 3: Éxito */}
            {step === 'success' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold" style={{ color: '#111827' }}>
                  Tu contraseña ha sido cambiada con éxito
                </h2>
                <p style={{ color: '#6B7280' }}>
                  Ya puedes iniciar sesión con tu nueva contraseña
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full py-3 h-12 text-white font-medium rounded-lg transition-all duration-200"
                    style={{ backgroundColor: '#0D50A4' }}
                  >
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
