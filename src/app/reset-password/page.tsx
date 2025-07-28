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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101010] px-4 py-12">
      <div className="w-full max-w-md relative">
        {/* Logo centrado */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-white">Restablecer contraseña</h1>
          <p className="text-muted-foreground">Introduce tu correo electrónico y te enviaremos un enlace</p>
        </div>

        <div className="bg-card/60 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
          {isSent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white">Correo enviado</h2>
              <p className="text-gray-400">
                Hemos enviado un enlace a <strong className="text-white">{email}</strong> para restablecer tu contraseña.
              </p>
              <p className="text-sm text-gray-400">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>
              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => setIsSent(false)}
                  variant="outline"
                  className="w-full py-3 h-12 bg-transparent hover:bg-[#2a2a2a] text-white border border-[#404040] rounded-lg"
                >
                  Volver a intentar
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 h-12 bg-white hover:bg-gray-100 text-black font-medium rounded-lg"
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            </div>
          ) : (
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

              <Button
                type="submit"
                className="w-full py-3 h-12 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-all duration-200 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                    <span className="text-sm">Enviando...</span>
                  </div>
                ) : (
                  "Enviar enlace"
                )}
              </Button>

              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-white hover:underline">
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
