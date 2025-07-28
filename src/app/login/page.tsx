'use client';

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormEvent, useState, useEffect, useRef } from "react";
import { AuthError, useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";
import AdBlock from "@/components/ui/AdBlock";

const getLoginErrorMessage = (error: AuthError): string => {
  const defaultMessage = 'Error al iniciar sesión';
  if (!error.message) return defaultMessage;

  if (error.message.includes('Invalid login')) {
    return 'Correo o contraseña incorrectos';
  }
  if (error.message.includes('not confirmed')) {
    return 'Correo no confirmado. Por favor, verifica tu bandeja de entrada';
  }
  return error.message;
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState('');
  const [isAdVisible, setIsAdVisible] = useState(true);
  const adInsRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Cambia el fondo del body a #101010 en vez de negro
    document.body.style.backgroundColor = '#101010';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }

    // Comprobar si el anuncio se ha cargado después de un tiempo
    const adCheckTimeout = setTimeout(() => {
      if (adInsRef.current) {
        // Google AdSense añade data-ad-status="unfilled" si no puede cargar un anuncio.
        // También comprobamos si el elemento está vacío y no tiene altura como respaldo.
        const isUnfilled = adInsRef.current.dataset.adStatus === 'unfilled';
        const isEmpty = adInsRef.current.innerHTML.trim() === '' && adInsRef.current.clientHeight === 0;

        if (isUnfilled || isEmpty) {
          console.log("Anuncio no cargado, ocultando el bloque.");
          setIsAdVisible(false);
        }
      }
    }, 3500); // Esperar 3.5 segundos para dar tiempo a AdSense a cargar.

    return () => clearTimeout(adCheckTimeout);
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
        setLoginStep('Cargando perfil...');
        toast.success('Inicio de sesión exitoso');
        console.log('Redirigiendo al dashboard...');
        setTimeout(() => router.push('/dashboard'), 500);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101010] px-4 py-12">
      <div className="container mx-auto flex justify-center gap-x-24 gap-y-12 flex-col lg:flex-row lg:items-stretch">
        {/* Bloque de anuncio */}
        <div className="order-2 lg:order-1 flex flex-col justify-center lg:mt-16">
          <AdBlock adClient="ca-pub-8330194041691289" adSlot="2159902041" alwaysVisible />
        </div>
        
        {/* Formulario de Login - Estilo moderno y compacto */}
        <div className="w-full max-w-md order-1 lg:order-2 flex flex-col justify-center lg:-mt-4">
          {/* Logo centrado */}
          <div className="flex justify-center mb-8 lg:mb-6">
            <Logo size="lg" />
          </div>

          <div className="text-center mb-8 lg:mb-6">
            <h1 className="text-2xl font-bold mb-2 text-white">Bienvenido de nuevo</h1>
            <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
          </div>

          <div className="bg-card/60 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-white">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full py-3 px-4 h-12 bg-[#2a2a2a] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm text-white">
                    Contraseña
                  </label>
                  <Link href="/reset-password" className="text-xs text-white hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  className="w-full py-3 px-4 h-12 bg-[#2a2a2a] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 h-12 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-all duration-200 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                    <span className="text-sm">{loginStep || "Conectando..."}</span>
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

            {/* Separador elegante */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#404040]"></div>
              <span className="text-sm text-gray-400">o</span>
              <div className="flex-1 h-px bg-[#404040]"></div>
            </div>

            {/* Botones de redes sociales - Tamaño compacto */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 h-12 bg-transparent hover:bg-transparent hover:border-[#606060] text-white border border-[#404040] rounded-lg transition-all duration-200 hover:text-white"
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
                className="w-full py-3 h-12 bg-transparent hover:bg-transparent hover:border-[#606060] text-white border border-[#404040] rounded-lg transition-all duration-200 hover:text-white"
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
      </div>
    </div>
  );
}
