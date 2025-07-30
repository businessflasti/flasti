'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Sparkles, ArrowRight, Gift, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PagoExitosoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Agregar confetti animado después de montar
    const timer = setTimeout(() => {
      // Efecto de celebración
      console.log('¡Pago exitoso! 🎉');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/15 to-cyan-500/15 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 rounded-full bg-gradient-to-r from-yellow-500/15 to-orange-500/15 blur-xl animate-pulse delay-1500"></div>
      </div>

      {/* Estrellas de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-white/10 animate-pulse"
            size={Math.random() * 8 + 4}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <Card className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#2a2a2a]/90 backdrop-blur-2xl border border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-6 md:p-12 text-center space-y-8">
            {/* Header con logo y efectos */}
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-yellow-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-[#1a1a1a] p-4 rounded-full border-2 border-gray-700/50">
                    <Image
                      src="/logo/isotipo.svg"
                      alt="Logo Flasti"
                      width={64}
                      height={64}
                      className="h-16 w-16"
                      priority
                    />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ícono de éxito principal */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center border-4 border-green-400/50 shadow-lg">
                  <CheckCircle className="w-16 h-16 text-green-400" />
                </div>
                <div className="absolute inset-0 w-28 h-28 bg-green-400/20 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Títulos principales */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                ¡ÉXITO!
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                Pago Procesado Correctamente
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            </div>

            {/* Mensaje de agradecimiento principal */}
            <div className="bg-gradient-to-r from-[#232323]/80 to-[#2a2a2a]/80 rounded-2xl p-6 border border-gray-600/30">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                🎉 ¡Gracias por confiar en Flasti! 🎉
              </h3>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">
                Tu inversión ha sido procesada exitosamente. Ahora tienes acceso completo a nuestra plataforma premium de generación de ingresos.
              </p>
              <p className="text-base md:text-lg text-gray-400">
                Bienvenido a la comunidad de emprendedores digitales más exitosa. Tu viaje hacia la libertad financiera comienza ahora.
              </p>
            </div>

            {/* Beneficios premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Acceso Premium</h3>
                <p className="text-gray-400 text-sm">Todas las herramientas y funciones desbloqueadas</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Ganancias Maximizadas</h3>
                <p className="text-gray-400 text-sm">Estrategias avanzadas para multiplicar ingresos</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Soporte VIP</h3>
                <p className="text-gray-400 text-sm">Atención prioritaria y personalizada 24/7</p>
              </div>
            </div>

            {/* Call to action principal */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-yellow-500/20">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🚀 ¡Tu Aventura Comienza Ahora!
                </h3>
                <p className="text-lg text-gray-300 mb-4">
                  Completa tu registro para acceder inmediatamente a todas las funcionalidades premium
                </p>
              </div>
              
              <Link href="/secure-registration-portal-7f9a2b3c5d8e">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:from-[#7c3aed] hover:via-[#db2777] hover:to-[#eab308] transition-all duration-500 text-white font-black py-6 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 text-xl border-2 border-white/20 hover:border-white/40"
                >
                  <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                  <span>REGÍSTRATE AHORA</span>
                  <ArrowRight className="w-6 h-6 ml-3 animate-bounce" />
                </Button>
              </Link>
            </div>

            {/* Mensaje de seguridad */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-300 font-semibold">Acceso Seguro Garantizado</span>
              </div>
              <p className="text-blue-200 text-sm">
                Tu enlace de registro es único y seguro. Guárdalo para acceder a tu cuenta premium de Flasti.
              </p>
            </div>

            {/* Footer profesional */}
            <div className="pt-8 border-t border-gray-700/50 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
                <span>¿Necesitas ayuda?</span>
                <a 
                  href="mailto:soporte@flasti.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  📧 soporte@flasti.com
                </a>
                <span className="hidden md:inline">|</span>
                <a 
                  href="https://wa.me/1234567890" 
                  className="text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  📱 WhatsApp Soporte
                </a>
              </div>
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} Flasti Inc. Todos los derechos reservados. | Plataforma segura y confiable.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Partículas flotantes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
          </div>
        ))}
      </div>
    </div>
  );
}