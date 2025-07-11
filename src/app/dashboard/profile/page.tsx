'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import Image from 'next/image';
import { FiEdit2 } from 'react-icons/fi';
import { ConfettiCheck } from '@/components/ui/confetti-check';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(profile?.avatar_url || '/images/profiles/profile1.jpg');
  const [color, setColor] = useState(profile?.accent_color || '#9333ea');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  // Permitir subir imagen personalizada
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    // Subir a Supabase Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      alert('Error al subir la imagen');
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatar(data.publicUrl);
    await updateProfile?.({ avatar_url: data.publicUrl });
    setUploading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 md:px-0 py-8">
      <ConfettiCheck show={showConfetti} onClose={() => setShowConfetti(false)} message="¡Perfil actualizado con éxito!" />
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-6 text-white">Mi Perfil</h1>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-40 w-full mb-6" />
        ) : (
          <Card className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={72}
                  height={72}
                  className="rounded-full border-4"
                  style={{ borderColor: color, background: color, transition: 'border-color 0.3s' }}
                />
                <button
                  className="absolute bottom-0 right-0 bg-[#232323] text-white p-1 rounded-full border border-[#b0b0b0] hover:bg-[#101010] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0]"
                  onClick={() => setEditing(true)}
                  aria-label="Editar avatar y color"
                  type="button"
                >
                  <FiEdit2 size={16} />
                </button>
                {/* Input para subir imagen personalizada */}
                {editing && (
                  <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="mt-2 text-xs text-white" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-white">{user?.email}</span>
                <span className="text-xs text-[#b0b0b0]">ID: {user?.id}</span>
              </div>
            </div>
            {editing && (
              <div className="flex flex-col gap-2 mb-2 animate-fade-in">
                <label className="text-sm font-medium text-white">Selecciona tu avatar:</label>
                <div className="flex gap-2">
                  {[1,2,3].map(n => (
                    <button
                      key={n}
                      className={`rounded-full border-2 ${avatar === `/images/profiles/profile${n}.jpg` ? 'border-[#b0b0b0]' : 'border-transparent'} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0]`}
                      onClick={() => setAvatar(`/images/profiles/profile${n}.jpg`)}
                      aria-label={`Avatar ${n}`}
                      type="button"
                    >
                      <Image src={`/images/profiles/profile${n}.jpg`} alt={`Avatar ${n}`} width={48} height={48} className="rounded-full" />
                    </button>
                  ))}
                </div>
                <label className="text-sm font-medium text-white mt-2">Color/acento:</label>
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-10 h-10 p-0 border-none rounded-full cursor-pointer"
                  aria-label="Color de acento"
                  style={{ background: color }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 rounded bg-[#232323] text-white hover:bg-[#101010] transition-colors"
                    onClick={async () => {
                      setSaving(true);
                      await updateProfile?.({ avatar_url: avatar, accent_color: color });
                      setEditing(false);
                      setSaving(false);
                      setShowConfetti(true);
                    }}
                    disabled={saving}
                    type="button"
                  >
                    Guardar
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-[#232323] text-white hover:bg-[#101010] transition-colors"
                    onClick={() => setEditing(false)}
                    type="button"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Nivel:</span>
              <Badge color="success">{profile?.level ?? '-'}</Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Registrado:</span>
              <span>{profile?.created_at ? new Date(profile.created_at).toLocaleString() : '-'}</span>
            </div>
            {/* Aquí puedes agregar más datos y opciones de edición */}
          </Card>
        )}
      </motion.div>
    </div>
  );
}
