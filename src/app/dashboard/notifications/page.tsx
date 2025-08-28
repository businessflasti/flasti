"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Notification } from '@/components/ui/Notification';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/notifications?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 md:px-0 py-8">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Notificaciones</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-gray-600 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            </div>
            <p className="text-gray-400 font-medium">Cargando notificaciones...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg mb-2">📬</div>
                <p className="text-gray-400 font-medium">No tienes notificaciones aún</p>
                <p className="text-gray-500 text-sm mt-1">Las notificaciones aparecerán aquí cuando completes tareas o realices retiros</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((n: any) => (
                  <div key={n.id} className={`bg-[#232323] border border-white/10 rounded-lg p-4 ${n.read ? 'opacity-60' : ''}`}>
                    <Notification
                      title={n.title}
                      message={n.message}
                      type={n.type === 'success' ? 'success' : n.type === 'error' ? 'error' : 'info'}
                      className="mb-0"
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(n.created_at).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
