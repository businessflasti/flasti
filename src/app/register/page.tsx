'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones básicas
    if (!email || !password || !phone) {
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
    toast.info('Procesando registro...');
    console.log('Iniciando registro ultra básico para:', { email, phone: phone.substring(0, 3) + '***' });

    try {
      // Intentar iniciar sesión primero por si el usuario ya existe
      try {
        const { error: loginError } = await signIn(email, password);
        if (!loginError) {
          toast.success('Inicio de sesión exitoso');
          router.push('/dashboard');
          return;
        }
      } catch (e) {
        // Ignorar errores aquí, significa que el usuario no existe
      }

      // Intentar registro con la solución ultra básica
      const { error } = await signUp(email, password, phone);

      if (error) {
        console.log('Registro falló con error:', error.message);

        // Manejar caso de usuario ya existente
        if (error.message && (error.message.includes('already') || error.message.includes('exists'))) {
          toast.info('Este correo ya está registrado. Intentando iniciar sesión...');

          try {
            const { error: loginError } = await signIn(email, password);

            if (!loginError) {
              toast.success('Inicio de sesión exitoso');
              router.push('/dashboard');
              return;
            } else {
              toast.error('Este correo ya está registrado. Por favor, inicia sesión');
              setTimeout(() => router.push('/login'), 2000);
            }
          } catch (e) {
            toast.error('Este correo ya está registrado. Por favor, inicia sesión');
            setTimeout(() => router.push('/login'), 2000);
          }

          setIsLoading(false);
          return;
        }

        // Manejar otros errores
        if (error.message && error.message.includes('password')) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
        } else if (error.message && (error.message.includes('timeout') || error.message.includes('network') || error.message.includes('connect'))) {
          toast.error('Error de conexión. Por favor, verifica tu conexión a internet');
        } else {
          // Mostrar un mensaje genérico para no confundir al usuario
          toast.error('Error al registrarse. Por favor, inténtalo de nuevo');
          console.error('Error detallado:', error);
        }

        setIsLoading(false);
        return;
      }

      // Registro exitoso
      console.log('Registro completado con éxito');
      toast.success('Registro exitoso. ¡Bienvenido a Flasti!');

      // Redirigir al dashboard con un pequeño delay para asegurar que todo esté listo
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Error inesperado durante el registro:', error);
      toast.error('Error al registrarse. Por favor, inténtalo de nuevo');

      // Último intento: probar inicio de sesión directo
      try {
        toast.info('Intentando recuperar la sesión...');
        const { error: loginError } = await signIn(email, password);
        if (!loginError) {
          toast.success('Inicio de sesión exitoso');
          router.push('/dashboard');
          return;
        }
      } catch (e) {
        // Ignorar errores aquí
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">¡Bienvenido!</h1>
          <p className="text-muted-foreground">Completa tu registro para comenzar</p>
        </div>

        <div className="bg-card/60 backdrop-blur-md rounded-lg shadow-xl p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Introduce tu correo electrónico"
                className="w-full py-5 h-auto bg-card/60 backdrop-blur-md border-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Introduce tu contraseña"
                className="w-full py-5 h-auto bg-card/60 backdrop-blur-md border-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm mb-2">
                Número de teléfono
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Introduce tu número de teléfono"
                className="w-full py-5 h-auto bg-card/60 backdrop-blur-md border-0"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-5 h-auto bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Ingresar a Flasti"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}