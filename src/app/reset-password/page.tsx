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
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ backgroundColor: '#F6F3F3' }}>

      <div className="w-full max-w-md relative z-10" style={{ contain: 'layout style' }}>
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>
            Restablecer contraseña
          </h1>
          <p style={{ color: '#6B7280' }}>Introduce tu correo electrónico y te enviaremos un enlace</p>
        </div>

        <div className="rounded-2xl p-8 border-0 relative overflow-hidden" style={{ contain: 'layout style paint', backgroundColor: '#FFFFFF' }}>
          
          <div className="relative z-10">
          {isSent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(13, 80, 164, 0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: '#0D50A4' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#111827' }}>Correo enviado</h2>
              <p style={{ color: '#6B7280' }}>
                Hemos enviado un enlace a <strong style={{ color: '#111827' }}>{email}</strong> para restablecer tu contraseña.
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>
              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => setIsSent(false)}
                  variant="outline"
                  className="w-full py-3 h-12 rounded-lg transition-all duration-200"
                  style={{ backgroundColor: '#F3F3F3', color: '#111827', border: 'none' }}
                >
                  Volver a intentar
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 h-12 text-white font-medium rounded-lg transition-all duration-200"
                  style={{ backgroundColor: '#0D50A4' }}
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm mb-2 font-medium" style={{ color: '#111827' }}>
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full py-3 px-4 h-12 border-0 rounded-lg focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                  style={{ backgroundColor: '#F3F3F3', color: '#111827' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 h-12 text-white font-semibold rounded-lg transition-all duration-200 mt-6"
                style={{ backgroundColor: '#0D50A4' }}
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
                <Link href="/login" className="text-sm hover:underline transition-colors duration-200" style={{ color: '#0D50A4' }}>
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
