"use client";

import { useState, useEffect } from 'react';
import { Bell, X, DollarSign, MousePointer, User, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Notification {
  id: string;
  type: 'click' | 'sale' | 'commission' | 'level_up' | 'system';
  title: string;
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
}

export default function LiveNotifications() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Crear notificación de bienvenida estática
  useEffect(() => {
    // Crear notificación de bienvenida
    const welcomeNotification: Notification = {
      id: `welcome-${Date.now()}`,
      type: 'system',
      title: t('bienvenidoFlasti'),
      message: t('emocionadosTenerte'),
      timestamp: new Date(),
      read: false
    };

    // Añadir a las notificaciones y actualizar contador
    setNotifications([welcomeNotification]);
    setUnreadCount(1);
  }, [t]);

  // Actualizar contador de no leídas
  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    try {
      // Actualizar estado local
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);

      toast.success(t('todasNotificacionesLeidas'));
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      toast.error('Error al actualizar notificaciones');
    }
  };

  // Marcar una notificación como leída
  const markAsRead = (id: string) => {
    try {
      // Actualizar estado local
      const updatedNotifications = notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      updateUnreadCount(updatedNotifications);
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'click':
        return <MousePointer size={16} className="text-[#9333ea]" />;
      case 'sale':
        return <DollarSign size={16} className="text-[#ec4899]" />;
      case 'commission':
        return <DollarSign size={16} className="text-[#facc15]" />;
      case 'level_up':
        return <User size={16} className="text-[#3b82f6]" />;
      case 'system':
        return <Bell size={16} className="text-[#3b82f6]" />;
      default:
        return <Bell size={16} className="text-primary" />;
    }
  };

  // Formatear tiempo relativo
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seg`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
    return `${Math.floor(diffInSeconds / 86400)} d`;
  };

  return (
    <>
      {/* Botón de notificaciones */}
      <button
        className="relative p-2 rounded-full hover:bg-foreground/10 transition-colors mobile-touch-friendly hardware-accelerated notifications-icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={22} className="text-foreground/70" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-card/95 backdrop-blur-md rounded-xl border border-border/30 shadow-xl z-50 animate-fadeInUp mobile-smooth-scroll">
          <div className="p-3 border-b border-border/20 flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md hardware-accelerated">
            <h3 className="font-semibold">{t('notificaciones')}</h3>
            {unreadCount > 0 && (
              <button
                className="text-xs text-primary hover:text-primary/80 transition-colors"
                onClick={markAllAsRead}
              >
                {t('marcarTodasLeidas')}
              </button>
            )}
          </div>

          <div className="divide-y divide-border/10">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-foreground/60">
                <p>{t('noTienesNotificaciones')}</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-foreground/5 transition-colors mobile-touch-friendly ${!notification.read ? 'bg-primary/5' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full bg-${notification.type === 'click' ? '[#9333ea]' : notification.type === 'sale' ? '[#ec4899]' : notification.type === 'commission' ? '[#facc15]' : notification.type === 'system' ? '[#3b82f6]' : '[#3b82f6]'}/10 flex items-center justify-center mt-0.5 hardware-accelerated`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-foreground/60 whitespace-nowrap ml-2">
                          {formatRelativeTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 mt-0.5">{notification.message}</p>
                      {notification.amount && (
                        <p className="text-sm font-semibold text-green-400 mt-1">+${notification.amount.toFixed(2)} USD</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-border/20 text-center sticky bottom-0 bg-card/95 backdrop-blur-md hardware-accelerated">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors mobile-touch-friendly">
              {t('verTodasNotificaciones')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
