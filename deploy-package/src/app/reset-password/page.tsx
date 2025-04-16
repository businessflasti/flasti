'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!email) {
        toast.error('Por favor, introduce tu correo electrónico');
        setIsLoading(false);
        return;
      }

      // Simular envío de correo (en producción, aquí iría la lógica real)
      setTimeout(() => {
        setIsSent(true);
        toast.success('Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña');
        setIsLoading(false);
      }, 1500);

    } catch (error: any) {
      console.error('Error inesperado:', error);
      toast.error(error.message || 'Error inesperado al solicitar restablecimiento de contraseña');
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

        <h1 className="text-center text-2xl font-bold mb-4">Restablecer contraseña</h1>
        <p className="text-center text-muted-foreground mb-8">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <div className="bg-card/60 backdrop-blur-md rounded-lg border border-border/40 shadow-xl p-6">
          {isSent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold">Correo enviado</h2>
              <p className="text-muted-foreground">
                Hemos enviado un enlace a <strong>{email}</strong> para restablecer tu contraseña.
              </p>
              <p className="text-sm text-muted-foreground">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam o solicita un nuevo enlace.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => setIsSent(false)}
                  variant="outline"
                  className="mr-2"
                >
                  Volver a intentar
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity"
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm mb-2">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Introduce tu correo electrónico"
                  className="w-full py-5 h-auto bg-card/60 backdrop-blur-md border-muted"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-5 h-auto bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar enlace de restablecimiento"}
              </Button>

              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
