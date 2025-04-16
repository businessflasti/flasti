'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedNotifications } from '@/contexts/EnhancedNotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar un enfoque más seguro para acceder al contexto
  let notificationContext = null;
  let contextError = null;

  try {
    // Intentar acceder al contexto
    notificationContext = useEnhancedNotifications();
  } catch (err) {
    console.error('Error al acceder al contexto de notificaciones:', err);
    contextError = 'No se pudieron cargar las notificaciones';
  }

  // Establecer el error si lo hay
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  // Extraer valores del contexto con valores por defecto
  const {
    notifications = [],
    unreadCount = 0,
    markAllAsRead = () => {},
    markAsRead = () => {},
    clearNotifications = () => {}
  } = notificationContext || {};

  const { language } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Formatear fecha relativa según el idioma
  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'es' ? es : undefined
    });
  };

  // Obtener icono según la categoría
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'affiliate':
        return <div className="w-2 h-2 rounded-full bg-[#ec4899]"></div>;
      case 'payment':
        return <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>;
      case 'chat':
        return <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>;
      case 'admin':
        return <div className="w-2 h-2 rounded-full bg-[#f97316]"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-[#9333ea]"></div>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ec4899] text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card shadow-lg rounded-lg border border-border/50 z-50 overflow-hidden">
          <div className="p-3 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-medium">Notificaciones</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={markAllAsRead}
                >
                  <Check size={14} className="mr-1" />
                  Marcar todo como leído
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive/80"
                  onClick={clearNotifications}
                >
                  <Trash2 size={14} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-foreground/60">
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-foreground/5 transition-colors ${!notification.read ? 'bg-foreground/5' : ''}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getCategoryIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {notification.title && (
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                        )}
                        <p className="text-sm text-foreground/80 break-words">{notification.message}</p>
                        <p className="text-xs text-foreground/60 mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-[#ec4899] mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
