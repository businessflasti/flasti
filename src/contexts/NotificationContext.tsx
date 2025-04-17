"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Comprobar al inicio
    checkMobile();

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto dismiss after duration
    setTimeout(() => {
      dismissNotification(id);
    }, newNotification.duration);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, dismissNotification }}>
      {children}
      {/* Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4 sm:gap-2">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{ marginBottom: index > 0 && isMobile ? '60px' : '0' }}
            className={`
              min-w-[300px] max-w-md p-4 rounded-lg shadow-lg
              animate-slide-in-right
              ${notification.type === 'success' ? 'bg-[#10b981]/90 text-white' :
                notification.type === 'error' ? 'bg-red-500/90 text-white' :
                notification.type === 'warning' ? 'bg-amber-500/90 text-white' :
                'bg-blue-500/90 text-white'
              }
            `}
          >
            {notification.title && (
              <h4 className="font-medium mb-1">{notification.title}</h4>
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
        ))
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};