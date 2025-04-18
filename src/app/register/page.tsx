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
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Establecer un timeout para evitar que se quede colgado indefinidamente
    const registerTimeout = setTimeout(() => {
      console.log('Timeout de registro alcanzado');
      setIsLoading(false);
      toast.error('La conexión está tardando demasiado. Por favor, intenta de nuevo.');
    }, 20000); // 20 segundos de timeout

    try {
      // Validaciones básicas
      if (!email || !password || !phone) {
        toast.error('Por favor, completa todos los campos');
        setIsLoading(false);
        clearTimeout(registerTimeout);
        return;
      }

      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        setIsLoading(false);
        clearTimeout(registerTimeout);
        return;
      }

      console.log('Intentando registrar usuario:', { email, phone });

      try {
        // Limpiar el timeout ya que vamos a procesar la respuesta
        clearTimeout(registerTimeout);

        const { error } = await signUp(email, password, phone);

        if (error) {
          console.error('Error detallado:', error);
          let errorMessage = 'Error al registrarse';

          if (error.message) {
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
              // Si el usuario ya está registrado, intentamos iniciar sesión directamente
              toast.info('Este correo ya está registrado. Iniciando sesión...');

              try {
                const { error: signInError } = await signIn(email, password);
                if (!signInError) {
                  toast.success('Inicio de sesión exitoso');
                  router.push("/dashboard");
                  return;
                } else {
                  errorMessage = 'Este correo ya está registrado. Por favor, inicia sesión';
                }
              } catch (signInErr) {
                errorMessage = 'Este correo ya está registrado. Por favor, inicia sesión';
              }
            } else if (error.message.includes('password')) {
              errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            } else if (error.message.includes('timeout') || error.message.includes('network') || error.message.includes('connect')) {
              errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo';
            } else {
              // Para cualquier otro error, simplemente mostramos un mensaje genérico
              errorMessage = 'Error al registrarse. Por favor, inténtalo de nuevo';
            }
          }

          toast.error(errorMessage);
        } else {
          toast.success('Registro exitoso. ¡Bienvenido a Flasti!');
          router.push("/dashboard");
        }
      } catch (signUpError: any) {
        // Limpiar el timeout ya que vamos a procesar la respuesta
        clearTimeout(registerTimeout);

        // Capturamos cualquier error inesperado durante el registro
        console.error('Error inesperado durante el registro:', signUpError);

        // Intentamos iniciar sesión de todos modos, por si el usuario ya existe
        try {
          toast.info('Verificando si la cuenta ya existe...');
          const { error: signInError } = await signIn(email, password);
          if (!signInError) {
            toast.success('Inicio de sesión exitoso');
            router.push("/dashboard");
            return;
          }
        } catch (signInErr) {
          // Si falla el inicio de sesión, mostramos el error original
          toast.error('Error al registrarse. Por favor, inténtalo de nuevo');
        }
      }
    } catch (error: any) {
      console.error('Error inesperado general:', error);
      toast.error('Error inesperado. Por favor, inténtalo de nuevo');
      clearTimeout(registerTimeout);
    } finally {
      setIsLoading(false);
      // Asegurarse de que el timeout se limpie en todos los casos
      clearTimeout(registerTimeout);
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