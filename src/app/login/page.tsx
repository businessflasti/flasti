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
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdVisible, setIsAdVisible] = useState(true);
  const adInsRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Asegura que el fondo del body sea negro en esta página para evitar
    // que se vea un color diferente si el contenido no llena toda la pantalla.
    document.body.classList.add('bg-black');
    // Limpia la clase cuando el componente se desmonta.
    return () => {
      document.body.classList.remove('bg-black');
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
    const loginTimeout = setTimeout(() => {
      setIsLoading(false);
      toast.error('La conexión está tardando demasiado. Por favor, intenta de nuevo.');
    }, 10000); // 10 segundos de timeout

    try {
      console.log('Intentando iniciar sesión:', { email });
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Error detallado:', error);
        toast.error(getLoginErrorMessage(error));
      } else {
        toast.success('Inicio de sesión exitoso');
        console.log('Redirigiendo al dashboard...');
        setTimeout(() => router.push('/dashboard'), 500);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      const message = error instanceof Error ? error.message : 'Error inesperado al iniciar sesión';
      toast.error(message);
    } finally {
      clearTimeout(loginTimeout);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 py-12">
      <div className={`container mx-auto flex justify-center gap-x-24 gap-y-12 ${isAdVisible ? 'flex-col lg:flex-row lg:items-stretch' : 'flex-col items-center'}`}>
        
        {isAdVisible && (
          <div className="w-full max-w-md lg:w-1/3 lg:max-w-sm order-2 lg:order-1 animate-in fade-in-0 zoom-in-95 duration-500 flex flex-col justify-center lg:mt-16">
            <div className="bg-[#141414] rounded-lg w-full overflow-hidden shadow-lg p-4 relative">
              <p className="absolute top-2 right-3 text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                Publicidad
              </p>
              <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8330194041691289"
                crossOrigin="anonymous"
                strategy="afterInteractive"
              />
              <ins 
                ref={adInsRef}
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-8330194041691289"
                data-ad-slot="9339785426"></ins>
            </div>
          </div>
        )}

        {/* Columna Derecha: Formulario de Login */}
        <div className={`w-full max-w-md ${isAdVisible ? 'order-1 lg:order-2' : 'order-1'} flex flex-col justify-center`}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h1 className="text-center text-2xl font-bold mb-8">Iniciar sesión</h1>

          <div className="bg-card/60 backdrop-blur-md rounded-lg border border-border/40 shadow-xl p-6">
            {/* Email login form */}
            <form className="space-y-4 mobile-form" onSubmit={handleSubmit}>
              <div className="mobile-form-field">
                <label htmlFor="email" className="block text-sm mb-2">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Introduce tu correo electrónico"
                  className="w-full py-5 h-auto bg-card/60 backdrop-blur-md border-muted mobile-touch-friendly"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mobile-form-field">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm">
                    Contraseña
                  </label>
                  <Link href="/reset-password" className="text-sm text-primary hover:underline mobile-touch-friendly">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Introduce tu contraseña"
                  className="w-full py-5 h-auto bg-card/60 backdrop-blur-md border-muted mobile-touch-friendly"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-5 h-auto bg-gradient-to-r from-[#d4386c] to-[#3359b6] hover:opacity-90 transition-opacity mobile-touch-friendly mobile-touch-feedback"
                disabled={isLoading}
              >
                {isLoading ? "Conectando..." : "Continuar"}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-4 mobile-touch-friendly mobile-touch-feedback inline-block">
              &larr; Volver a inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
