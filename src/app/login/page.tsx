'use client';

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormEvent, useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";

const getLoginErrorMessage = (error: any): string => {
  const defaultMessage = 'Error al iniciar sesión';
  const message = error?.message || error?.msg || String(error || '');
  if (!message) return defaultMessage;

  if (String(message).includes('Invalid login')) {
    return 'Correo o contraseña incorrectos';
  }
  if (String(message).includes('not confirmed')) {
    return 'Correo no confirmado. Por favor, verifica tu bandeja de entrada';
  }
  return String(message);
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState('');


  useEffect(() => {
    // Cambia el fondo del body a #0B1017 en vez de negro
    document.body.style.backgroundColor = '#0B1017';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Timeout más largo y que se cancele correctamente
    timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        toast.error('La conexión está tardando demasiado. Por favor, intenta de nuevo.');
      }
    }, 30000); // 30 segundos de timeout

    try {
      console.log('Intentando iniciar sesión:', { email });
      setLoginStep('Verificando credenciales...');
      
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Error detallado:', error);
        setLoginStep('');
        toast.error(getLoginErrorMessage(error));
      } else {
        setLoginStep('Verificando configuración...');
        // Redirigir a dashboard para admins
        setTimeout(() => router.push('/dashboard'), 500);
        return;
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setLoginStep('');
      const message = error instanceof Error ? error.message : 'Error inesperado al iniciar sesión';
      toast.error(message);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast.info('Debes registrarte primero para iniciar sesión con Google.');
  };

  const handleFacebookSignIn = async () => {
    toast.info('Debes registrarte primero para iniciar sesión con Facebook.');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-4 py-12 relative overflow-hidden">

      <div className="container mx-auto flex justify-center relative z-10">
        {/* Formulario de Login - Estilo gamificado */}
        <div className="w-full max-w-md flex flex-col justify-center">
          {/* Logo centrado */}
          <div className="flex justify-center mb-6 mt-4">
            <Link href="/">
              <Image 
                src="/logo/isotipo-web.png" 
                alt="Flasti" 
                width={40} 
                height={40} 
                className="object-contain"
              />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-white">Bienvenido</h1>
            <p className="text-white/80">Inicia sesión en tu cuenta</p>
          </div>

          <div 
            className="bg-[#101011] rounded-2xl shadow-2xl p-8 border-0 relative overflow-hidden"
          >
            
            <div className="relative z-10">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-[#c9d1d9] font-medium">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full py-3 px-4 h-12 bg-[#151516] border-0 rounded-lg text-[#c9d1d9] placeholder-[#6e7681] placeholder:text-xs focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm text-[#c9d1d9] font-medium">
                    Contraseña
                  </label>
                  <Link href="/reset-password" className="text-xs text-[#58a6ff] transition-opacity duration-200">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    className="w-full py-3 px-4 pr-12 h-12 bg-[#151516] border-0 rounded-lg text-[#c9d1d9] placeholder-[#6e7681] placeholder:text-xs focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] transition-opacity duration-200"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 h-12 bg-[#238636] text-white font-semibold rounded-lg transition-all duration-200 mt-6 hover:bg-white hover:text-black"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="text-sm">{loginStep || "Conectando..."}</span>
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

            {/* Separador elegante */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#30363d]"></div>
              <span className="text-sm text-[#8b949e]">o</span>
              <div className="flex-1 h-px bg-[#30363d]"></div>
            </div>

            {/* Botones de redes sociales - Tamaño compacto */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 h-12 bg-transparent hover:bg-[#21262d] text-[#c9d1d9] hover:text-[#c9d1d9] border border-[#30363d] hover:border-[#8b949e] rounded-lg transition-all duration-200"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm">Continuar con Google</span>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full py-3 h-12 bg-transparent hover:bg-[#21262d] text-[#c9d1d9] hover:text-[#c9d1d9] border border-[#30363d] hover:border-[#8b949e] rounded-lg transition-all duration-200"
                onClick={handleFacebookSignIn}
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm">Continuar con Facebook</span>
                </div>
              </Button>
            </div>
          </div>
          </div>

          {/* Enlace a register */}
          <div className="text-center mt-6">
            <p className="text-sm text-[#8b949e]">
              ¿No tienes cuenta en Flasti?{' '}
              <Link href="/register" className="text-[#58a6ff] font-medium transition-opacity duration-200">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
