'use client';

import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1017] px-4 py-12 relative overflow-hidden">

      <div className="w-full max-w-md relative z-10">
        {/* Logo centrado */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo/isotipo-web.png" 
            alt="Flasti" 
            width={64} 
            height={64} 
            className="object-contain"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">
            Restablecer contraseña
          </h1>
          <p className="text-[#8b949e]">Introduce tu correo electrónico y te enviaremos un enlace</p>
        </div>

        <div className="bg-[#161b22]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-0 relative overflow-hidden group transition-all duration-300">
          {/* Efecto neón sutil en hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6E40FF]/5 via-transparent to-[#2DE2E6]/5 rounded-2xl"></div>
          </div>
          
          <div className="relative z-10">
          {isSent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#238636]/20 flex items-center justify-center border border-[#238636]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3fb950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-[#c9d1d9]">Correo enviado</h2>
              <p className="text-[#8b949e]">
                Hemos enviado un enlace a <strong className="text-[#c9d1d9]">{email}</strong> para restablecer tu contraseña.
              </p>
              <p className="text-sm text-[#8b949e]">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>
              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => setIsSent(false)}
                  variant="outline"
                  className="w-full py-3 h-12 bg-transparent hover:bg-[#21262d] text-[#c9d1d9] border border-[#30363d] hover:border-[#8b949e] rounded-lg transition-all duration-200"
                >
                  Volver a intentar
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 h-12 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-lg transition-all duration-200"
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-[#c9d1d9] font-medium">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full py-3 px-4 h-12 bg-[#0d1117] border-0 rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 h-12 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-lg transition-all duration-200 mt-6 shadow-lg shadow-[#238636]/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="text-sm">Enviando...</span>
                  </div>
                ) : (
                  "Enviar enlace"
                )}
              </Button>

              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-[#58a6ff] hover:underline transition-colors duration-200">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
