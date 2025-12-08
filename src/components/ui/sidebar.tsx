"use client";
import { useState, useEffect, memo, useCallback } from "react";
import { usePathname } from 'next/navigation';
import { FiUser, FiLogOut, FiSettings, FiDollarSign, FiClock, FiHome, FiAward, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const sidebarItems = [
  { name: "Inicio", icon: <FiHome />, href: "/dashboard", tooltip: "Inicio" },
  { name: "Historial de Retiros", icon: <FiClock />, href: "/dashboard/withdrawals-history", tooltip: "Historial de retiros" },
  { name: "Perfil", icon: <FiUser />, href: "/dashboard/perfil", tooltip: "Tu perfil" },
  { name: "Recompensas", icon: <FiAward />, href: "/dashboard/rewards-history", tooltip: "Historial de recompensas" },
  { name: "Retiros", icon: <FiDollarSign />, href: "/dashboard/withdrawals", tooltip: "Solicitar retiro" },
  { name: "Soporte", icon: <FiMessageCircle />, href: "/dashboard/support", tooltip: "Soporte y ayuda" },
  { name: "Salir", icon: <FiLogOut />, href: "/logout", tooltip: "Cerrar sesión", isLogout: true },
];

// Funciones helper fuera del componente para evitar recreación
const getInitials = (email: string | undefined, name: string | undefined) => {
  if (name) return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  if (email) return email.split('@')[0].substring(0, 2).toUpperCase();
  return 'U';
};

const getAvatarColor = () => {
  return '#85C1E9';
};

function SidebarComponent({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
  const { profile, user, signOut, updateAvatar } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const pathname = usePathname();
  
  const userEmail = user?.email || profile?.email || '';
  const userName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : (profile?.full_name || user?.user_metadata?.full_name);
  const avatarColor = getAvatarColor();
  const hasCustomAvatar = profile?.avatar_url;
  
  // Handler optimizado para subir avatar
  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona una imagen válida');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB');
      return;
    }
    
    try {
      const timestamp = Date.now();
      const fileName = `avatar-${user.id}-${timestamp}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '0', upsert: true });
      if (error) { alert(`Error: ${error.message}`); return; }
      
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      if (!urlData?.publicUrl) { alert('No se pudo obtener la URL'); return; }
      
      const { error: updateError } = await updateAvatar(`${urlData.publicUrl}?t=${timestamp}`);
      if (updateError) { alert(`Error: ${updateError.message}`); return; }
      
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      alert(`Error: ${error.message || 'Intenta de nuevo'}`);
    }
    
    if (e.target) e.target.value = '';
  }, [user, updateAvatar]);

  // Handler para logout
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    if (typeof window !== 'undefined' && window.innerWidth < 768) setOpen(false);
    
    try { await signOut(); } catch (e) { console.error(e); }
    
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/login');
    }
  }, [isLoggingOut, setOpen, signOut]);

  return (
    <>
      {/* Sidebar - CSS transitions en lugar de framer-motion */}
      <aside
        id="sidebar-menu"
        className={`fixed top-0 left-0 z-40 h-screen w-56 bg-[#0A0A0A] flex flex-col items-center py-8 gap-2 overflow-y-auto transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ contain: 'layout style paint' }}
        aria-label="Menú lateral"
        role="navigation"
      >

        {/* Avatar - Optimizado */}
        <div className="mb-8 flex flex-col items-center relative">
          <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          
          <button
            onClick={() => document.getElementById('avatar-upload')?.click()}
            className="relative w-20 h-20 rounded-full p-[3px] cursor-pointer bg-[#121212]"
          >
            <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-[#101010]">
              {hasCustomAvatar ? (
                <Image 
                  key={`sidebar-avatar-${refreshKey}`}
                  src={`${profile.avatar_url}?t=${refreshKey}`}
                  alt="Avatar" 
                  width={80} 
                  height={80} 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: avatarColor }}>
                  <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>
            {!hasCustomAvatar && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Subir foto
              </div>
            )}
          </button>
        </div>

        {/* Badge nombre usuario */}
        {userName && (
          <div className="w-full flex justify-center mb-6">
            <span className="text-white text-xs font-bold px-4 py-2 rounded-full bg-[#121212] tracking-wide">
              {userName}
            </span>
          </div>
        )}

        {/* Navegación */}
        <nav className="flex flex-col gap-1 w-full px-3" role="menu">
          {sidebarItems.map((item) => (
            item.isLogout ? (
              <button
                key={item.name}
                type="button"
                disabled={isLoggingOut}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left ${
                  isLoggingOut ? 'bg-[#121212] text-gray-600' : 'text-gray-400 hover:bg-[#121212] hover:text-white'
                }`}
                onClick={handleLogout}
              >
                <span className="text-xl">{isLoggingOut ? <FiSettings className="animate-spin" /> : item.icon}</span>
                <span className="text-sm font-semibold">{isLoggingOut ? "Cerrando..." : item.name}</span>
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${
                  pathname === item.href ? 'bg-[#121212] text-white font-bold' : 'text-gray-400 hover:bg-[#121212] hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    if (window.innerWidth < 768) setOpen(false);
                    window.location.href = item.href;
                  }
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            )
          ))}
        </nav>
        
        <div className="flex-1" />

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} Flasti LLC.
        </div>
      </aside>

      {/* Overlay móvil - CSS transition */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

// Exportar componente memoizado
export const Sidebar = memo(SidebarComponent);
