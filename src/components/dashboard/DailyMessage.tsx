'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

export default function DailyMessage() {
  const { profile, user } = useAuth();
  const { activeTheme } = useSeasonalTheme();
  const [message, setMessage] = useState('');
  const [messageVersion, setMessageVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRead, setIsRead] = useState(false);
  const [responseType, setResponseType] = useState<string | null>(null);

  useEffect(() => {
    loadMessage();

    // Suscripción en tiempo real para cambios de mensaje
    const channel = supabase
      .channel('daily_message_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'daily_message',
        },
        () => {
          loadMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, user]);

  const loadMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_message')
        .select('message, id, message_version')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        // Usar el mensaje tal cual, sin personalización dinámica
        setMessage(data.message);
        setMessageVersion(data.message_version || 1);

        // Verificar si el usuario ya leyó esta versión del mensaje
        if (user) {
          const { data: readData } = await supabase
            .from('user_message_reads')
            .select('response_type')
            .eq('user_id', user.id)
            .eq('message_id', data.message_version)
            .single();

          if (readData) {
            setIsRead(true);
            setResponseType(readData.response_type);
          } else {
            setIsRead(false);
            setResponseType(null);
          }
        }
      }
    } catch (error) {
      console.error('Error loading message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (type: 'thanks' | 'like') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_message_reads')
        .upsert({
          user_id: user.id,
          message_id: messageVersion,
          response_type: type,
          read_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsRead(true);
      setResponseType(type);
      toast.success(type === 'thanks' ? '¡Gracias por tu respuesta! 😊' : '¡Nos alegra que te guste! 👍');
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Error al guardar respuesta');
    }
  };

  if (loading) {
    return (
      <Card 
        className="relative backdrop-blur-2xl border border-white/10 h-full rounded-3xl"
        style={{ backgroundColor: 'rgba(11, 15, 23, 0.6)' }}
      >
        {/* Brillo superior glassmorphism */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <CardContent className="p-3 sm:p-4 lg:p-6 flex items-center justify-center h-full">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-[#191C3F]/40 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#191C3F] rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="relative backdrop-blur-2xl border border-white/10 h-full overflow-hidden rounded-3xl"
      style={{ backgroundColor: 'rgba(11, 15, 23, 0.6)' }}
    >
      {/* Brillo superior glassmorphism */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col h-full relative z-10">
        {/* Header con avatar de María */}
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          {/* Avatar de María */}
          <div className="relative flex-shrink-0">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 ${
              isRead ? 'border-gray-500/50' : 'border-blue-500/50'
            }`}>
              <Image
                src="/images/tutors/soporte-maria.png"
                alt="María - Asesora Flasti"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info de María - Centrada verticalmente */}
          <div className="flex-1 min-w-0 flex items-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white truncate">
                María
              </h3>
              <span className={`flex-shrink-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold inline-flex items-center justify-center ${
                isRead 
                  ? 'bg-gray-500/20 text-gray-300' 
                  : 'bg-white text-black'
              }`}>
                Asesora
              </span>
            </div>
          </div>

          {/* Indicador de actividad alineado con el nombre y etiqueta */}
          <div className={`flex-shrink-0 w-2 h-2 sm:w-2 sm:h-2 rounded-full mr-6 sm:mr-2 ${
            isRead ? 'bg-orange-400 animate-pulse-orange' : 'bg-green-400 animate-pulse-green'
          }`}></div>
        </div>

        {/* Mensaje en burbuja de chat */}
        <div className="flex-1 flex flex-col gap-2">
          <div className={`rounded-2xl rounded-tl-sm p-2.5 sm:p-3 lg:p-4 w-full ${
            isRead 
              ? 'bg-gradient-to-br from-gray-500/10 to-gray-600/10' 
              : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
          }`}>
            <p className={`text-xs sm:text-sm lg:text-base leading-relaxed ${
              isRead ? 'text-white/60' : 'text-white/90'
            }`}>
              {message}
            </p>
          </div>

          {/* Botones de respuesta */}
          {!isRead && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Responder:</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleResponse('thanks')}
                  size="sm"
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-white border-0 h-8 text-xs"
                >
                  😊 Gracias
                </Button>
                <Button
                  onClick={() => handleResponse('like')}
                  size="sm"
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-white border-0 h-8 text-xs"
                >
                  👍 Me gusta
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer con estado */}
        <div className="mt-2 sm:mt-3 flex items-center justify-center">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${
            isRead 
              ? 'bg-gray-500/10' 
              : 'bg-white'
          }`}>
            {isRead ? (
              <>
                <svg 
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-[10px] sm:text-xs font-medium text-gray-400">
                  Mensaje leído
                </span>
              </>
            ) : (
              <>
                <svg 
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black animate-swing" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                <span className="text-[10px] sm:text-xs font-bold text-black">
                  Nuevo mensaje
                </span>
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes swing {
            0%, 100% {
              transform: rotate(0deg);
            }
            10%, 30% {
              transform: rotate(14deg);
            }
            20%, 40% {
              transform: rotate(-14deg);
            }
            50% {
              transform: rotate(0deg);
            }
          }

          @keyframes pulse-green {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
            }
            50% {
              box-shadow: 0 0 0 6px rgba(74, 222, 128, 0);
            }
          }

          @keyframes pulse-orange {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.7);
            }
            50% {
              box-shadow: 0 0 0 6px rgba(251, 146, 60, 0);
            }
          }

          .animate-swing {
            animation: swing 2s ease-in-out infinite;
            transform-origin: top center;
          }

          .animate-pulse-green {
            animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .animate-pulse-orange {
            animation: pulse-orange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
