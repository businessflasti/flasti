"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'info' | 'warning';
type NotificationCategory = 'system' | 'affiliate' | 'payment' | 'chat' | 'admin';

interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  message: string;
  title?: string;
  duration?: number;
  data?: any;
  read?: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  dismissNotification: (id: string) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const EnhancedNotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const EnhancedNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const supabaseChannelRef = useRef<any>(null);

  // Cargar notificaciones al iniciar y cuando cambia el usuario
  useEffect(() => {
    if (user) {
      loadUserNotifications();
      subscribeToRealTimeNotifications();
    } else {
      // Limpiar notificaciones cuando no hay usuario
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      if (supabaseChannelRef.current) {
        supabaseChannelRef.current.unsubscribe();
      }
    };
  }, [user]);

  // Cargar notificaciones del usuario desde la base de datos
  const loadUserNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        const formattedNotifications = data.map(notification => ({
          id: notification.id,
          type: notification.type as NotificationType,
          category: notification.category as NotificationCategory,
          message: notification.message,
          title: notification.title,
          data: notification.data,
          read: notification.read,
          createdAt: new Date(notification.created_at)
        }));

        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Suscribirse a notificaciones en tiempo real
  const subscribeToRealTimeNotifications = () => {
    if (!user) return;

    // Suscribirse a nuevas notificaciones
    const channel = supabase
      .channel(`user-notifications-${user.id}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            type: payload.new.type as NotificationType,
            category: payload.new.category as NotificationCategory,
            message: payload.new.message,
            title: payload.new.title,
            data: payload.new.data,
            read: payload.new.read,
            createdAt: new Date(payload.new.created_at)
          };

          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Mostrar notificación en pantalla
          showToastNotification(newNotification);
        }
      )
      .subscribe();

    supabaseChannelRef.current = channel;
  };

  // Mostrar notificación en pantalla (toast)
  const showToastNotification = (notification: Notification) => {
    // Mostrar toast según el tipo de notificación
    switch (notification.type) {
      case 'success':
        toast.success(notification.message, {
          id: notification.id,
          description: notification.title
        });
        break;
      case 'error':
        toast.error(notification.message, {
          id: notification.id,
          description: notification.title
        });
        break;
      case 'warning':
        toast.warning(notification.message, {
          id: notification.id,
          description: notification.title
        });
        break;
      default:
        toast.info(notification.message, {
          id: notification.id,
          description: notification.title
        });
    }
  };

  const showNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;

    const id = Math.random().toString(36).substring(7);
    const now = new Date();

    const newNotification = {
      ...notification,
      id,
      createdAt: now,
      read: false
    };

    // Añadir a la lista local
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Mostrar toast
    showToastNotification(newNotification);

    // Guardar en la base de datos
    try {
      await supabase.from('notifications').insert({
        id: newNotification.id,
        user_id: user.id,
        type: newNotification.type,
        category: newNotification.category,
        message: newNotification.message,
        title: newNotification.title,
        data: newNotification.data,
        read: false,
        created_at: now.toISOString()
      });
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = async (id: string) => {
    if (!user) return;

    // Actualizar localmente
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );

    // Actualizar contador de no leídos
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Actualizar en la base de datos
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    // Actualizar localmente
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    // Actualizar contador
    setUnreadCount(0);

    // Actualizar en la base de datos
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = async () => {
    if (!user || notifications.length === 0) return;

    // Limpiar localmente
    setNotifications([]);
    setUnreadCount(0);

    // Eliminar de la base de datos
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <EnhancedNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showNotification,
        dismissNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </EnhancedNotificationContext.Provider>
  );
};

export const useEnhancedNotifications = () => {
  const context = useContext(EnhancedNotificationContext);
  if (context === undefined) {
    throw new Error('useEnhancedNotifications must be used within a EnhancedNotificationProvider');
  }
  return context;
};
