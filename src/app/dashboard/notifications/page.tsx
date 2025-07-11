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
      <h1 className="text-2xl font-bold mb-6 text-white">Notificaciones</h1>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-40 w-full mb-6" />
        ) : (
          <Card>
            {notifications.length === 0 ? (
              <div className="text-[#b0b0b0] py-8 text-center">No tienes notificaciones aún.</div>
            ) : (
              <ul className="space-y-4">
                {notifications.map((n: any) => (
                  <li key={n.id} className={n.read ? 'opacity-60' : ''}>
                    <Notification
                      title={n.title}
                      message={n.message}
                      type={n.type === 'retiro' ? 'info' : n.type === 'recompensa' ? 'success' : 'info'}
                      className="mb-0"
                    />
                    <div className="text-xs text-[#b0b0b0] mt-1">{new Date(n.created_at).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  );
}
