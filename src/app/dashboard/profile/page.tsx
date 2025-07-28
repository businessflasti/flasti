'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import Image from 'next/image';
import { FiEdit2 } from 'react-icons/fi';
import { ConfettiCheck } from '@/components/ui/confetti-check';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState(profile?.accent_color || '#9333ea');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 md:px-0 py-8">
      <ConfettiCheck show={showConfetti} onClose={() => setShowConfetti(false)} message="¡Perfil actualizado con éxito!" />
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" stroke="currentColor" strokeWidth="2"/><path d="M6 18c1.5-2 4.5-2 6 0" stroke="currentColor" strokeWidth="2"/></svg>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Mi Perfil</h1>
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
            <p className="text-gray-400 font-medium">Cargando perfil...</p>
          </div>
        ) : (
          <div className="bg-[#232323] border border-white/10 rounded-lg">
            <div className="flex flex-col items-center gap-6 p-8">
              <AvatarUpload />
              <span className="font-semibold text-white">{user?.email}</span>
              <div className="flex items-center gap-2 mb-2 text-gray-300">
                <span className="font-semibold">Registrado:</span>
                <span>{profile?.created_at ? new Date(profile.created_at).toLocaleString() : '-'}</span>
              </div>
              {/* Aquí puedes agregar más datos y opciones de edición */}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
