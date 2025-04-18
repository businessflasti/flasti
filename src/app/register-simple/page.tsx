'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterSimple() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!email || !password || !confirmPassword) {
      setError(t('todosLosCamposSonRequeridos'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('lasContraseñasNoCoinciden'));
      return;
    }

    if (password.length < 6) {
      setError(t('contraseñaDemasiadoCorta'));
      return;
    }

    try {
      setLoading(true);

      // Registrar usuario directamente con Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Mostrar mensaje de éxito
      toast.success(t('registroExitoso'));
      
      // Redirigir al usuario a la página de inicio de sesión
      router.push('/login');
    } catch (error: any) {
      console.error('Error al registrar:', error);
      
      // Manejar errores específicos
      if (error.message.includes('already registered')) {
        setError(t('emailYaRegistrado'));
      } else if (error.message.includes('invalid email')) {
        setError(t('emailInvalido'));
      } else {
        setError(error.message || t('errorRegistro'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/90">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 opacity-30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 opacity-20 rounded-full filter blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md p-6 bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{t('crearCuenta')}</h1>
          <p className="text-foreground/60">{t('registroSimple')}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('correoElectronico')}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              disabled={loading}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t('contraseña')}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                disabled={loading}
                className="bg-background/50 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t('confirmarContraseña')}
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              disabled={loading}
              className="bg-background/50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 text-white"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                {t('procesando')}
              </>
            ) : (
              t('registrarse')
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-foreground/60">
            {t('yaTenesUnaCuenta')}{' '}
            <Link href="/login" className="text-primary hover:underline">
              {t('iniciarSesion')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
