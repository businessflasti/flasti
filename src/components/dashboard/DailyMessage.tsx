'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { toast } from 'sonner';

const DailyMessage = memo(function DailyMessage() {
  const { profile, user } = useAuth();
  const [message, setMessage] = useState('');
  const [messageVersion, setMessageVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRead, setIsRead] = useState(false);
  const [responseType, setResponseType] = useState<string | null>(null);

  const loadMessage = useCallback(async () => {
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
  }, [user]);

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
  }, [loadMessage]);

  const handleResponse = useCallback(async (type: 'thanks' | 'like') => {
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
  }, [user, messageVersion]);

  if (loading) {
    return (
      <Card 
        className="relative border-0 h-full rounded-3xl"
        style={{ backgroundColor: '#585C6C' }}
      >
        <CardContent className="p-2.5 sm:p-3 lg:p-4 flex items-center justify-center h-full">
          <div 
            className="w-8 h-8 rounded-full animate-spin"
            style={{ 
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#fff'
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="relative border-0 h-full overflow-hidden rounded-3xl"
      style={{ backgroundColor: '#585C6C' }}
    >
      
      <CardContent className="p-2.5 sm:p-3 lg:p-5 flex flex-col h-full relative z-10">
        {/* Header con avatar de María */}
        <div className="flex items-center gap-2 lg:gap-3 mb-1.5 sm:mb-2 lg:mb-3">
          {/* Avatar de María */}
          <div className="relative flex-shrink-0">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-11 lg:h-11 rounded-full overflow-hidden transition-all duration-300 ${
              isRead ? 'opacity-70' : ''
            }`}>
              <Image
                src="/images/tutors/soporte-maria.png"
                alt="María - Asesora Flasti"
                width={44}
                height={44}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isRead ? 'grayscale opacity-80' : ''
                }`}
              />
            </div>
          </div>

          {/* Info de María - Centrada verticalmente */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-[11px] sm:text-xs lg:text-sm font-bold text-white truncate leading-tight">
              Laura Martínez
            </h3>
            <p className="text-[9px] sm:text-[10px] lg:text-xs transition-all duration-300 truncate text-white/80 leading-tight">
              Guía de Flasti
            </p>
          </div>

          {/* Indicador de actividad alineado con el nombre y etiqueta */}
          <div className={`flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-4 sm:mr-1 ${
            isRead ? 'bg-orange-400 animate-pulse-orange' : 'bg-green-400 animate-pulse-green'
          }`}></div>
        </div>

        {/* Mensaje en burbuja de chat */}
        <div className="flex-1 flex flex-col gap-3 lg:gap-3.5">
          <div 
            className="rounded-xl rounded-tl-sm p-2 sm:p-2.5 lg:p-3.5 w-full bg-transparent"
            style={{ border: '1px solid #7A7E8C' }}
          >
            <p className={`text-[10px] sm:text-xs lg:text-sm leading-snug lg:leading-relaxed ${
              isRead ? 'text-white/65' : 'text-white/95'
            }`}>
              {message}
            </p>
          </div>

          {/* Botones de respuesta */}
          {!isRead && (
            <div className="flex flex-col gap-3 lg:gap-3.5">
              <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 font-medium">Responder:</p>
              <div className="flex gap-1.5 lg:gap-2">
                <button
                  onClick={() => handleResponse('thanks')}
                  className="flex-1 h-6 sm:h-7 lg:h-8 text-[10px] sm:text-xs hover:opacity-90 rounded-md font-medium bg-white"
                  style={{ color: '#121212' }}
                >
                  😊 Gracias
                </button>
                <button
                  onClick={() => handleResponse('like')}
                  className="flex-1 h-6 sm:h-7 lg:h-8 text-[10px] sm:text-xs hover:opacity-90 rounded-md font-medium bg-white"
                  style={{ color: '#121212' }}
                >
                  👍 Me gusta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer con estado */}
        <div className="mt-1.5 sm:mt-2 flex items-center justify-center">
          {isRead ? (
            <div 
              className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ 
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <svg 
                className="w-3.5 h-3.5 text-white/60" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span className="text-[11px] sm:text-xs font-medium text-white/60">
                Mensaje leído
              </span>
            </div>
          ) : (
            <div 
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
              style={{ backgroundColor: '#656979' }}
            >
              <svg 
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white animate-swing" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-white">
                Nuevo mensaje
              </span>
            </div>
          )}
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
});

DailyMessage.displayName = 'DailyMessage';

export default DailyMessage;
