'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signIn, loading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    // Cambia el fondo del body a #101010 en vez de negro
    document.body.style.backgroundColor = '#101010';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones básicas
    if (!firstName || !lastName || !email || !password) {
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
    console.log('Iniciando registro para:', { email, firstName, lastName });

    try {
      // Intentar registro directamente con nombre y apellido
      console.log('Iniciando proceso de registro...');
      const { error } = await signUp(email, password, firstName, lastName);

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

      // Redirigir directamente al dashboard en vez de a welcome
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);

    } catch (error: any) {
      console.error('Error inesperado durante el registro:', error);
      toast.dismiss(loadingToast);
      toast.error('Error inesperado. Por favor, inténtalo de nuevo');
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-4 py-12 relative overflow-hidden">

      <div className="container mx-auto flex justify-center relative z-10">
        {/* Formulario de Registro - Estilo gamificado */}
        <div className="w-full max-w-md flex flex-col justify-center">
          {/* Logo centrado */}
          <div className="flex justify-center mb-8 lg:mb-6">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>

          <div className="text-center mb-8 lg:mb-6">
            <p className="text-white/80">Completa tu registro para comenzar</p>
          </div>

        <div 
          className="bg-[#101011] rounded-2xl shadow-2xl p-8 border-0 relative overflow-hidden"
        >
          
          <div className="relative z-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nombre y Apellido en una fila */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm mb-2 text-[#c9d1d9] font-medium">
                  Nombre
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full py-3 px-4 h-12 bg-[#151516] border-0 rounded-lg text-[#c9d1d9] placeholder-[#6e7681] placeholder:text-xs focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm mb-2 text-[#c9d1d9] font-medium">
                  Apellido
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  className="w-full py-3 px-4 h-12 bg-[#151516] border-0 rounded-lg text-[#c9d1d9] placeholder-[#6e7681] placeholder:text-xs focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm mb-2 text-[#c9d1d9] font-medium">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
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
                  <span className="text-sm">Procesando...</span>
                </div>
              ) : (
                "Crea tu cuenta"
              )}
            </Button>
          </form>
          </div>
        </div>

          {/* Enlace a login */}
          <div className="text-center mt-6">
            <p className="text-sm text-[#8b949e]">
              ¿Ya estás registrado en Flasti?{' '}
              <Link href="/login" className="text-[#58a6ff] font-medium transition-opacity duration-200">
                Ingresa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}