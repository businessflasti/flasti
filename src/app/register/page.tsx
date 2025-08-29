'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";
import AdBlock from "@/components/ui/AdBlock";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signIn, loading } = useAuth();
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
    setIsLoading(true);

    // Validaciones básicas
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Mostrar mensaje de carga
    const loadingToast = toast.loading('Procesando registro...');
    console.log('Iniciando registro para:', { email });

    try {
      // Intentar registro directamente
      console.log('Iniciando proceso de registro...');
      const { error } = await signUp(email, password);

      if (error) {
        console.log('Registro falló con error:', error.message);

        // Manejar caso de usuario ya existente
        if (error.message && (error.message.includes('already') || error.message.includes('exists') || error.message.includes('User already registered'))) {
          console.log('Usuario ya existe, intentando iniciar sesión...');
          toast.dismiss(loadingToast);
          toast.info('Este correo ya está registrado. Iniciando sesión...');

          try {
            const { error: loginError } = await signIn(email, password);

            if (!loginError) {
              toast.success('Inicio de sesión exitoso');
              router.push('/dashboard');
              return;
            } else {
              toast.error('Credenciales incorrectas. Por favor, verifica tu contraseña');
              setIsLoading(false);
              return;
            }
          } catch (e) {
            toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo');
            setIsLoading(false);
            return;
          }
        }

        // Manejar otros errores específicos
        toast.dismiss(loadingToast);
        if (error.message && error.message.includes('password')) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
        } else if (error.message && error.message.includes('email')) {
          toast.error('Por favor, ingresa un correo electrónico válido');
        } else if (error.message && (error.message.includes('timeout') || error.message.includes('network') || error.message.includes('connect'))) {
          toast.error('Error de conexión. Por favor, verifica tu conexión a internet');
        } else {
          toast.error('Error al registrarse. Por favor, inténtalo de nuevo');
          console.error('Error detallado:', error);
        }

        setIsLoading(false);
        return;
      }

      // Registro exitoso
      console.log('Registro completado con éxito');
      toast.dismiss(loadingToast);
      toast.success('¡Registro exitoso! Redirigiendo...');

      // Esperar un momento para que el contexto se actualice y luego redirigir a welcome
      setTimeout(() => {
        router.push('/welcome');
      }, 500);

    } catch (error: any) {
      console.error('Error inesperado durante el registro:', error);
      toast.dismiss(loadingToast);
      toast.error('Error inesperado. Por favor, inténtalo de nuevo');
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101010] px-4 py-12">
      <div className="container mx-auto flex justify-center gap-x-24 gap-y-12 flex-col lg:flex-row lg:items-stretch">
        {/* Bloque de anuncio */}
        <div className="order-2 lg:order-1 flex flex-col justify-center lg:mt-16">
          <AdBlock adClient="ca-pub-8330194041691289" adSlot="1375086377" alwaysVisible />
        </div>
        
        {/* Formulario de Registro - Estilo moderno y compacto */}
        <div className="w-full max-w-md order-1 lg:order-2 flex flex-col justify-center lg:-mt-4">
          {/* Logo centrado */}
          <div className="flex justify-center mb-8 lg:mb-6">
            <Link href="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="text-center mb-8 lg:mb-6">
            <p className="text-muted-foreground">Completa tu registro para comenzar</p>
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
                className="w-full py-3 px-4 h-12 bg-[#2a2a2a] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:ring-[0.1px] focus:ring-[#606060] focus:border-[#606060] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-white">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                className="w-full py-3 px-4 h-12 bg-[#2a2a2a] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:ring-[0.1px] focus:ring-[#606060] focus:border-[#606060] transition-all"
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
                  <span className="text-sm">Procesando...</span>
                </div>
              ) : (
                "Crea tu cuenta"
              )}
            </Button>
          </form>
        </div>

          {/* Enlace a login */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              ¿Ya estás registrado en Flasti?{' '}
              <Link href="/login" className="text-white hover:underline font-medium">
                Ingresa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}