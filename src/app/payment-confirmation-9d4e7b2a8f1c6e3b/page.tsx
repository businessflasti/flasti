'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CheckCircle, ArrowRight, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import facebookEventDeduplication from '@/lib/facebook-event-deduplication';

export default function GraciasPorTuPagoPage() {
  const [mounted, setMounted] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    
    // 4. Purchase - Disparar cuando se visita la página payment-confirmation-9d4e7b2a8f1c6e3b
    const trackPurchase = async () => {
      try {
        const { default: unifiedTrackingService } = await import('@/lib/unified-tracking-service');
        await unifiedTrackingService.trackPurchase({
          transaction_id: 'flasti_purchase_' + Date.now(),
          value: 7,
          currency: 'USD',
          payment_method: 'completed',
          content_name: 'Flasti Access'
        });
      } catch (error) {
        console.error('❌ Error al enviar evento Purchase:', error);
      }
    };

    // Ejecutar tracking después de un pequeño delay
    const timer = setTimeout(trackPurchase, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Función para activar premium y redirigir al dashboard
  const handleGoToDashboard = async () => {
    setIsActivating(true);
    
    try {
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        // Actualizar is_premium a true en user_profiles
        const { error } = await supabase
          .from('user_profiles')
          .update({ is_premium: true })
          .eq('user_id', session.user.id);
        
        if (error) {
          console.error('Error activando premium:', error);
        }
      }
    } catch (error) {
      console.error('Error en activación premium:', error);
    }
    
    // Redirigir al dashboard (incluso si hubo error, el pago ya está hecho)
    window.location.href = '/dashboard';
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101010] via-[#1a1a1a] to-[#101010]">

      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="bg-[#1a1a1a]/90 backdrop-blur-xl border-gray-800/50 shadow-2xl overflow-hidden">
            {/* Layout horizontal para desktop, vertical para móvil */}
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              
              {/* Sección izquierda - Contenido principal */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                {/* Logo */}
                <div className="flex justify-center lg:justify-start mb-8">
                  <Image
                    src="/logo/isotipo-web.png"
                    alt="Logo Flasti"
                    width={60}
                    height={60}
                    className="h-12 w-12 lg:h-15 lg:w-15"
                    priority
                  />
                </div>

                {/* Contenido principal */}
                <div className="text-center lg:text-left space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                      Pago procesado
                      <span className="block text-white">
                        exitosamente
                      </span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-300 font-medium">
                      Gracias por confiar en Flasti
                    </p>
                  </div>

                  <div className="space-y-4 text-gray-400 max-w-2xl">
                    <p className="text-lg leading-relaxed">
                      Su transacción ha sido completada con éxito. Ahora tiene acceso completo a todas las funcionalidades premium de nuestra plataforma.
                    </p>
                    <p className="text-base">
                      Nuestro equipo está comprometido en brindarle las mejores herramientas para maximizar su rendimiento y alcanzar sus objetivos financieros.
                    </p>
                  </div>

                  {/* Características destacadas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                    <div className="bg-[#232323]/50 rounded-lg p-4 border border-gray-700/30">
                      <div className="flex justify-center lg:justify-start">
                        <Shield className="w-6 h-6 text-[#9333ea] mb-3" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1 text-center lg:text-left">Acceso Completo</h3>
                      <p className="text-xs text-gray-400 text-center lg:text-left">Todas las funciones premium</p>
                    </div>
                    <div className="bg-[#232323]/50 rounded-lg p-4 border border-gray-700/30">
                      <div className="flex justify-center lg:justify-start">
                        <Users className="w-6 h-6 text-[#facc15] mb-3" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1 text-center lg:text-left">Soporte Prioritario</h3>
                      <p className="text-xs text-gray-400 text-center lg:text-left">Atención especializada</p>
                    </div>
                  </div>

                  {/* Botón de inicio para móvil */}
                  <div className="pt-6 lg:hidden">
                    <p className="text-white font-medium mb-4 text-lg">
                      Accede a tu panel profesional
                    </p>
                    <Button 
                      size="lg"
                      className="bg-white hover:bg-gray-100 text-[#101010] font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-base"
                      onClick={handleGoToDashboard}
                      disabled={isActivating}
                    >
                      {isActivating ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          <span>Desbloqueando microtareas...</span>
                        </>
                      ) : (
                        <>
                          <span>Ir a inicio</span>
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sección derecha - Visual de confirmación */}
              <div className="flex-1 bg-gradient-to-br from-[#232323]/50 to-[#1a1a1a]/50 p-8 lg:p-12 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l border-gray-700/30">
                <div className="text-center space-y-8">
                  {/* Ícono de éxito */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/40">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                      </div>
                    </div>
                  </div>

                  {/* Estado de la transacción */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                      Transacción Confirmada
                    </h3>
                    <div className="bg-[#1a1a1a]/80 rounded-lg p-6 border border-gray-700/30">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Estado:</span>
                          <span className="text-green-400 font-semibold">Completado</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Plan:</span>
                          <span className="text-white">Premium</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de inicio para desktop */}
                  <div className="hidden lg:block pt-6">
                    <p className="text-white font-medium mb-4 text-lg">
                      Accede a tu panel profesional
                    </p>
                    <Button 
                      size="lg"
                      className="bg-white hover:bg-gray-100 text-[#101010] font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-base"
                      onClick={handleGoToDashboard}
                      disabled={isActivating}
                    >
                      {isActivating ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          <span>Desbloqueando microtareas...</span>
                        </>
                      ) : (
                        <>
                          <span>Ir a inicio</span>
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer corporativo */}
            <div className="bg-[#101010]/80 border-t border-gray-700/30 p-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <p className="text-gray-400 text-sm">
                    ¿Necesita asistencia? Contáctenos en{' '}
                    <a href="mailto:access@flasti.com" className="text-white hover:text-gray-300 transition-colors">
                      access@flasti.com
                    </a>
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-500 text-xs">
                    © {new Date().getFullYear()} Flasti LLC. Todos los derechos reservados.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}