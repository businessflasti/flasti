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
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101010] px-4 py-12">
      <div className="container mx-auto flex justify-center gap-x-24 gap-y-12 flex-col lg:flex-row lg:items-stretch">
        {/* Bloque de anuncio */}
        <div className="w-full max-w-md lg:w-1/3 lg:max-w-sm order-2 lg:order-1 animate-in fade-in-0 zoom-in-95 duration-500 flex flex-col justify-center lg:mt-16">
          <AdBlock adClient="ca-pub-8330194041691289" adSlot="2159902041" alwaysVisible />
        </div>
        {/* Columna Derecha: Formulario de Login */}
        <div className="w-full max-w-md order-1 lg:order-2 flex flex-col justify-center lg:mt-4">
          {/* Encabezado visual */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#232323] to-[#101010] border border-[#333] shadow-md mb-4">
              <Logo size="sm" className="!m-0 flex items-center justify-center" />
            </div>
            <h1 className="text-3xl font-extrabold mt-2 mb-2 text-white tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-base text-gray-400 mb-2 text-center max-w-xs">Accede a tu cuenta para gestionar tus microtrabajos, actividad y ganancias.</p>
          </div>
          <div className="bg-[#232323] rounded-2xl border border-[#222] shadow-lg p-8 flex flex-col gap-4">
            {/* Email login form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Correo electrónico</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="1.5" d="M3 7.5l8.25 6.75a2 2 0 002.5 0L22 7.5M5.5 19h13A2.5 2.5 0 0021 16.5v-9A2.5 2.5 0 0018.5 5h-13A2.5 2.5 0 003 7.5v9A2.5 2.5 0 005.5 19z"/></svg>
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Introduce tu correo electrónico"
                    className="w-full py-5 h-auto bg-[#101010] border border-[#333] pl-11 pr-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
                  <Link href="/reset-password" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="1.5" d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2z"/></svg>
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Introduce tu contraseña"
                    className="w-full py-5 h-auto bg-[#101010] border border-[#333] pl-11 pr-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-4 h-auto bg-gradient-to-r from-[#3c66ce] to-[#3359b6] hover:opacity-90 transition-opacity text-lg font-semibold rounded-lg shadow-md mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Conectando..." : "Iniciar sesión"}
              </Button>
            </form>
            {/* Eliminado el separador y texto 'o continúa con' */}
          </div>
          {/* Pie de página eliminado según solicitud */}
        </div>
      </div>
    </div>
  );
}
