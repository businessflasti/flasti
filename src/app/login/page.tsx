'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Establecer un timeout para evitar que se quede colgado indefinidamente
    const loginTimeout = setTimeout(() => {
      console.log('Timeout de login alcanzado');
      setIsLoading(false);
      toast.error('La conexión está tardando demasiado. Por favor, intenta de nuevo.');
    }, 10000); // 10 segundos de timeout

    try {
      // Validaciones básicas
      if (!email || !password) {
        toast.error('Por favor, completa todos los campos');
        setIsLoading(false);
        clearTimeout(loginTimeout);
        return;
      }

      console.log('Intentando iniciar sesión:', { email });
      const { error } = await signIn(email, password);

      // Limpiar el timeout ya que la operación completó
      clearTimeout(loginTimeout);

      if (error) {
        console.error('Error detallado:', error);
        let errorMessage = 'Error al iniciar sesión';

        if (error.message) {
          if (error.message.includes('Invalid login')) {
            errorMessage = 'Correo o contraseña incorrectos';
          } else if (error.message.includes('not confirmed')) {
            errorMessage = 'Correo no confirmado. Por favor, verifica tu bandeja de entrada';
          } else {
            errorMessage = error.message;
          }
        }

        toast.error(errorMessage);
        setIsLoading(false);
      } else {
        toast.success('Inicio de sesión exitoso');
        console.log('Redirigiendo al dashboard...');

        // Pequeño retraso antes de redireccionar para asegurar que el estado se actualice
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (error: any) {
      console.error('Error inesperado:', error);
      toast.error(error.message || 'Error inesperado al iniciar sesión');
      clearTimeout(loginTimeout);
    } finally {
      setIsLoading(false);
      clearTimeout(loginTimeout);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 mobile-smooth-scroll">
      <div className="w-full max-w-md relative">
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
              className="w-full py-5 h-auto bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity mobile-touch-friendly mobile-touch-feedback"
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
  );
}
