'use client';

import { useState, useEffect, useRef } from 'react';
import { getRandomUserByCountry, getRandomUser } from '@/data/fomo-users-index';
import { FomoUser } from '@/data/fomo-users-types';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, UserPlus } from 'lucide-react';
import Image from 'next/image';

// Tipos de notificaciones
type NotificationType = 'registration' | 'withdrawal';

// Interfaz para las notificaciones
interface FomoNotification {
  id: string;
  type: NotificationType;
  user: FomoUser;
  amount?: string; // Ahora es string para manejar decimales
  timestamp: Date;
}

// Componente principal de notificaciones FOMO
export default function FomoNotifications() {
  // Estado para la notificación actual que se muestra
  const [currentNotification, setCurrentNotification] = useState<FomoNotification | null>(null);
  // Estado para el país del usuario
  const [userCountry, setUserCountry] = useState<string | null>(null);
  // Estado para controlar si se está mostrando una notificación
  const [isVisible, setIsVisible] = useState(false);
  // Referencia para almacenar las notificaciones ya mostradas
  const shownNotificationsRef = useRef<Set<string>>(new Set());
  // Referencia para almacenar las notificaciones generadas para esta sesión
  const sessionNotificationsRef = useRef<FomoNotification[]>([]);
  // Referencia para controlar si el componente está montado
  const isMountedRef = useRef(true);

  // Efecto para inicializar la referencia de montaje y verificar si el usuario ha completado un pago
  useEffect(() => {
    isMountedRef.current = true;

    // Verificar si el usuario ha completado un pago
    const hasCompletedPayment = localStorage.getItem('flastiCompletedPayment') === 'true';

    // Si el usuario ha completado un pago, no mostrar más notificaciones
    if (hasCompletedPayment) {
      console.log('El usuario ya ha completado un pago, no se mostrarán notificaciones FOMO');
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Efecto para detectar el país del usuario
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Primero verificar si ya tenemos la información guardada en localStorage
        const savedCountry = localStorage.getItem('flastiUserCountry');

        if (savedCountry) {
          setUserCountry(savedCountry);
          return;
        }

        // Si no hay información guardada, usar el servicio de geolocalización
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        // Guardar el país en localStorage para futuras visitas
        localStorage.setItem('flastiUserCountry', data.country_code);
        setUserCountry(data.country_code);
      } catch (error) {
        console.error('Error al detectar el país:', error);
        // Si hay un error, usar un país por defecto o mostrar notificaciones aleatorias
        setUserCountry('RANDOM');
      }
    };

    // Detectar el país solo en el cliente
    if (typeof window !== 'undefined') {
      detectCountry();
    }
  }, []);

  // Función para generar una notificación aleatoria
  const generateRandomNotification = (): FomoNotification => {
    // Determinar el tipo de notificación (registro o retiro) - 70% retiros, 30% registros
    const type: NotificationType = Math.random() > 0.3 ? 'withdrawal' : 'registration';

    // Obtener un usuario aleatorio del país del usuario o cualquier país si es RANDOM
    const user = userCountry === 'RANDOM'
      ? getRandomUser()
      : getRandomUserByCountry(userCountry) || getRandomUser();

    // Generar un monto aleatorio para retiros con variedad natural y montos más bajos
    let amount;
    if (type === 'withdrawal') {
      // Distribución de montos más variada
      const amountDistribution = Math.random();
      let baseAmount;

      if (amountDistribution < 0.25) {
        // 25% de probabilidad: montos muy bajos (entre 2 y 5 USD)
        baseAmount = Math.random() * 3 + 2;
      } else if (amountDistribution < 0.55) {
        // 30% de probabilidad: montos bajos (entre 5 y 10 USD)
        baseAmount = Math.random() * 5 + 5;
      } else if (amountDistribution < 0.85) {
        // 30% de probabilidad: montos medios (entre 10 y 25 USD)
        baseAmount = Math.random() * 15 + 10;
      } else {
        // 15% de probabilidad: montos altos (entre 25 y 50 USD)
        baseAmount = Math.random() * 25 + 25;
      }

      // Decidir aleatoriamente si mostrar un número redondo, con 1 decimal o con 2 decimales
      const formatType = Math.random();

      if (formatType < 0.3) {
        // 30% de probabilidad: número redondo (sin decimales)
        amount = Math.round(baseAmount).toString();
      } else if (formatType < 0.6) {
        // 30% de probabilidad: 1 decimal
        amount = baseAmount.toFixed(1);
      } else {
        // 40% de probabilidad: 2 decimales
        amount = baseAmount.toFixed(2);
      }
    }

    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      user,
      amount,
      timestamp: new Date()
    };
  };

  // Efecto para cargar o generar las notificaciones de la sesión
  useEffect(() => {
    if (!userCountry) return;

    // Verificar si ya tenemos notificaciones generadas en sessionStorage
    const loadSessionNotifications = () => {
      try {
        const savedNotifications = sessionStorage.getItem('flastiSessionNotifications');
        if (savedNotifications) {
          const parsed = JSON.parse(savedNotifications);
          // Convertir las fechas de string a Date
          const formatted = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));

          // Verificar si es una nueva sesión del navegador
          const lastSessionId = localStorage.getItem('flastiSessionId');
          const currentSessionId = Date.now().toString();

          if (!lastSessionId) {
            // Primera vez que el usuario visita el sitio
            localStorage.setItem('flastiSessionId', currentSessionId);
            sessionNotificationsRef.current = formatted;
          } else if (sessionStorage.getItem('flastiCurrentSessionId') !== lastSessionId) {
            // Nueva sesión del navegador (el usuario cerró y volvió a abrir)
            // Mezclar las notificaciones para que aparezcan en orden diferente
            sessionNotificationsRef.current = shuffleArray([...formatted]);

            // Guardar las notificaciones mezcladas
            try {
              sessionStorage.setItem('flastiSessionNotifications',
                JSON.stringify(sessionNotificationsRef.current));
            } catch (error) {
              console.error('Error al guardar notificaciones mezcladas:', error);
            }

            // Actualizar el ID de sesión
            localStorage.setItem('flastiSessionId', currentSessionId);
            sessionStorage.setItem('flastiCurrentSessionId', currentSessionId);
          } else {
            // Misma sesión, mantener el orden actual
            sessionNotificationsRef.current = formatted;
          }
        } else {
          // Generar nuevas notificaciones para esta sesión
          generateSessionNotifications();

          // Guardar el ID de sesión
          const sessionId = Date.now().toString();
          localStorage.setItem('flastiSessionId', sessionId);
          sessionStorage.setItem('flastiCurrentSessionId', sessionId);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones de la sesión:', error);
        // Si hay un error, generar nuevas notificaciones
        generateSessionNotifications();

        // Guardar el ID de sesión
        const sessionId = Date.now().toString();
        localStorage.setItem('flastiSessionId', sessionId);
        sessionStorage.setItem('flastiCurrentSessionId', sessionId);
      }
    };

    // Función para generar todas las notificaciones de la sesión
    const generateSessionNotifications = () => {
      const notifications: FomoNotification[] = [];
      // Generar 150 notificaciones aleatorias
      for (let i = 0; i < 150; i++) {
        notifications.push(generateRandomNotification());
      }

      // Mezclar aleatoriamente las notificaciones para que aparezcan en orden diferente cada vez
      const shuffledNotifications = shuffleArray([...notifications]);

      // Guardar en la referencia
      sessionNotificationsRef.current = shuffledNotifications;

      // Guardar en sessionStorage para mantener continuidad entre páginas
      try {
        sessionStorage.setItem('flastiSessionNotifications', JSON.stringify(shuffledNotifications));
      } catch (error) {
        console.error('Error al guardar notificaciones en sessionStorage:', error);
      }
    };

    // Función para mezclar un array aleatoriamente (algoritmo Fisher-Yates)
    const shuffleArray = <T,>(array: T[]): T[] => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    // Cargar o generar las notificaciones de la sesión
    loadSessionNotifications();
  }, [userCountry]);

  // Efecto para mostrar las notificaciones
  useEffect(() => {
    if (!userCountry || sessionNotificationsRef.current.length === 0) return;

    // Verificar si es la primera visita del usuario
    const isFirstVisit = localStorage.getItem('flastiFirstVisit') !== 'false';

    // Verificar si el usuario ha completado un pago
    const hasCompletedPayment = localStorage.getItem('flastiCompletedPayment') === 'true';

    // Cargar las notificaciones ya mostradas desde sessionStorage
    try {
      const shownNotificationsString = sessionStorage.getItem('flastiShownNotifications');
      if (shownNotificationsString) {
        const shownNotificationsArray = JSON.parse(shownNotificationsString);
        // Convertir el array a un Set
        shownNotificationsRef.current = new Set(shownNotificationsArray);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones mostradas:', error);
    }

    // Si no es la primera visita o el usuario ha completado un pago, no mostrar notificaciones
    if (!isFirstVisit || hasCompletedPayment) {
      console.log('No se mostrarán notificaciones FOMO: no es primera visita o ya completó pago');
      return;
    }

    // Si ya se han mostrado 50 notificaciones, no mostrar más
    if (shownNotificationsRef.current.size >= 50) {
      console.log('Ya se han mostrado 50 notificaciones, no se mostrarán más');
      return;
    }

    let showTimer: NodeJS.Timeout | null = null;
    let hideTimer: NodeJS.Timeout | null = null;

    // Función para mostrar una notificación
    const showNotification = () => {
      if (!isMountedRef.current) return;

      // Obtener el índice de la siguiente notificación a mostrar
      const nextIndex = shownNotificationsRef.current.size % sessionNotificationsRef.current.length;
      const nextNotification = sessionNotificationsRef.current[nextIndex];

      // Marcar esta notificación como mostrada
      shownNotificationsRef.current.add(nextNotification.id);

      // Guardar en sessionStorage para mantener el estado entre páginas
      try {
        sessionStorage.setItem('flastiShownNotifications',
          JSON.stringify(Array.from(shownNotificationsRef.current)));
      } catch (error) {
        console.error('Error al guardar notificaciones mostradas:', error);
      }

      // Si ya se han mostrado 50 notificaciones, detener el flujo
      if (shownNotificationsRef.current.size >= 50) {
        console.log('Se han mostrado 50 notificaciones, deteniendo el flujo');
        return;
      }

      // Mostrar la notificación
      setCurrentNotification(nextNotification);
      setIsVisible(true);

      // Programar el ocultamiento después de exactamente 8 segundos
      hideTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setIsVisible(false);
        }
      }, 8000);
    };

    // Función para programar la siguiente notificación
    const scheduleNextNotification = () => {
      if (!isMountedRef.current) return;

      // Programar la siguiente notificación después de 60-120 segundos
      const randomInterval = Math.floor(Math.random() * 61000) + 60000; // Entre 60 y 120 segundos
      showTimer = setTimeout(() => {
        showNotification();
        // Después de mostrar, programar la siguiente
        scheduleNextNotification();
      }, randomInterval);
    };

    // Mostrar la primera notificación exactamente a los 120 segundos (2 minutos exactos) - siempre de tipo retiro
    const initialTimer = setTimeout(() => {
      // Crear una notificación de retiro para la primera notificación
      const firstWithdrawalNotification = (): FomoNotification => {
        // Obtener un usuario aleatorio del país del usuario o cualquier país si es RANDOM
        const user = userCountry === 'RANDOM'
          ? getRandomUser()
          : getRandomUserByCountry(userCountry) || getRandomUser();

        // Generar un monto aleatorio para el retiro con variedad natural y montos más bajos
        let amount;
        // Distribución de montos más variada
        const amountDistribution = Math.random();
        let baseAmount;

        if (amountDistribution < 0.25) {
          // 25% de probabilidad: montos muy bajos (entre 2 y 5 USD)
          baseAmount = Math.random() * 3 + 2;
        } else if (amountDistribution < 0.55) {
          // 30% de probabilidad: montos bajos (entre 5 y 10 USD)
          baseAmount = Math.random() * 5 + 5;
        } else if (amountDistribution < 0.85) {
          // 30% de probabilidad: montos medios (entre 10 y 25 USD)
          baseAmount = Math.random() * 15 + 10;
        } else {
          // 15% de probabilidad: montos altos (entre 25 y 50 USD)
          baseAmount = Math.random() * 25 + 25;
        }

        // Decidir aleatoriamente si mostrar un número redondo, con 1 decimal o con 2 decimales
        const formatType = Math.random();

        if (formatType < 0.3) {
          // 30% de probabilidad: número redondo (sin decimales)
          amount = Math.round(baseAmount).toString();
        } else if (formatType < 0.6) {
          // 30% de probabilidad: 1 decimal
          amount = baseAmount.toFixed(1);
        } else {
          // 40% de probabilidad: 2 decimales
          amount = baseAmount.toFixed(2);
        }

        return {
          id: `withdrawal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'withdrawal',
          user,
          amount,
          timestamp: new Date()
        };
      };

      // Mostrar la primera notificación (siempre de tipo retiro)
      const firstNotification = firstWithdrawalNotification();
      setCurrentNotification(firstNotification);
      setIsVisible(true);

      // Marcar esta notificación como mostrada
      shownNotificationsRef.current.add(firstNotification.id);

      // Guardar en sessionStorage para mantener el estado entre páginas
      try {
        sessionStorage.setItem('flastiShownNotifications',
          JSON.stringify(Array.from(shownNotificationsRef.current)));
      } catch (error) {
        console.error('Error al guardar notificaciones mostradas:', error);
      }

      // Programar el ocultamiento después de exactamente 8 segundos
      const hideTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setIsVisible(false);
        }
      }, 8000);

      // Programar las siguientes notificaciones
      scheduleNextNotification();

      // Marcar que ya no es la primera visita para futuras visitas
      localStorage.setItem('flastiFirstVisit', 'false');
    }, 120000); // Exactamente 120000 ms = 120 segundos = 2 minutos exactos

    // Limpiar temporizadores al desmontar
    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [userCountry]);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          key={currentNotification.id}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.5
          }}
          className="fixed bottom-4 left-1/2 sm:left-4 -translate-x-1/2 sm:translate-x-0 z-50 w-[280px] sm:w-[320px] md:w-[360px] fomo-notification"
        >
          <div className={`
            backdrop-blur-sm text-white rounded-lg shadow-xl p-2.5 flex items-center gap-3
            ${currentNotification.type === 'registration'
              ? 'bg-gradient-to-r from-[#0f172a]/95 to-[#1e293b]/95 border border-[#3b82f6]/30 glow-blue-subtle'
              : 'bg-gradient-to-r from-[#0f172a]/95 to-[#1e293b]/95 border border-[#10b981]/30 glow-green-subtle'}
          `}>
            <div className="flex-shrink-0 relative">
              {/* Logo de Flasti */}
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                {/* Usar una imagen estática directamente */}
                <img
                  src="/logo/isotipo.png"
                  alt="Flasti"
                  width={18}
                  height={18}
                  className="object-contain"
                  style={{ width: '18px', height: '18px' }}
                  onError={(e) => {
                    // Fallback a una imagen estática si la carga falla
                    const target = e.currentTarget;
                    target.onerror = null; // Prevenir bucle infinito
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bTAtMTRjLTMuMzEgMC02IDIuNjktNiA2czIuNjkgNiA2IDYgNi0yLjY5IDYtNi0yLjY5LTYtNi02em0wIDEwYy0yLjIxIDAtNC0xLjc5LTQtNHMxLjc5LTQgNC00IDQgMS43OSA0IDQtMS43OSA0LTQgNHoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=';
                  }}
                />
              </div>

              {/* Indicador de tipo de notificación */}
              <div className={`
                absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center
                ${currentNotification.type === 'registration'
                  ? 'bg-[#3b82f6]'
                  : 'bg-[#10b981]'}
              `}>
                {currentNotification.type === 'registration' ? (
                  <UserPlus size={10} className="text-white" />
                ) : (
                  <DollarSign size={10} className="text-white" />
                )}
              </div>
            </div>
            <div className="flex-1">
              {currentNotification.type === 'registration' ? (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white truncate max-w-[180px]">
                      {currentNotification.user.firstName} {currentNotification.user.lastName}
                    </p>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6] mr-1.5"></div>
                      <p className="text-xs text-[#3b82f6] font-medium whitespace-nowrap">Nuevo miembro</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-0.5 min-w-0">
                    <span className="mr-1 text-sm flex-shrink-0">{currentNotification.user.flag}</span>
                    <p className="text-xs text-white/70 truncate">
                      {currentNotification.user.city}, {currentNotification.user.country}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white truncate max-w-[180px]">
                      {currentNotification.user.firstName} {currentNotification.user.lastName}
                    </p>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#10b981] mr-1.5"></div>
                      <p className="text-xs text-[#10b981] font-medium whitespace-nowrap">Nuevo retiro</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-center min-w-0 flex-shrink">
                      <span className="mr-1 text-sm flex-shrink-0">{currentNotification.user.flag}</span>
                      <p className="text-xs text-white/70 truncate">
                        {currentNotification.user.city}, {currentNotification.user.country}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-[#10b981]">
                      ${currentNotification.amount} USD
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
