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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Notificaciones</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-48 w-full mb-6 rounded-2xl" />
        ) : (
          <Card className="p-0 overflow-hidden border-0 shadow-xl bg-[#18181b] relative">
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-primary/40 animate-pulse-slow" style={{zIndex:0, filter:'blur(1px)', opacity:0.15}}></div>
            <div className="p-8 relative z-10">
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
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
