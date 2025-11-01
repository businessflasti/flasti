"use client";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiGift, FiBell, FiLogOut, FiBarChart2, FiSettings, FiDollarSign, FiClock, FiHome, FiAward, FiMessageCircle } from "react-icons/fi";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

const sidebarItems = [
  { name: "Inicio", icon: <FiHome />, href: "/dashboard", tooltip: "Inicio" },
  { name: "Historial de Retiros", icon: <FiClock />, href: "/dashboard/withdrawals-history", tooltip: "Historial de retiros" },
  { name: "Perfil", icon: <FiUser />, href: "/dashboard/perfil", tooltip: "Tu perfil" },
  { name: "Recompensas", icon: <FiAward />, href: "/dashboard/rewards-history", tooltip: "Historial de recompensas" },
  { name: "Retiros", icon: <FiDollarSign />, href: "/dashboard/withdrawals", tooltip: "Solicitar retiro" },
  { name: "Notificaciones", icon: <FiBell />, href: "/dashboard/notifications", tooltip: "Tus notificaciones" },
  { name: "Soporte", icon: <FiMessageCircle />, href: "/dashboard/support", tooltip: "Soporte y ayuda" },
  { name: "Salir", icon: <FiLogOut />, href: "/logout", tooltip: "Cerrar sesión", isLogout: true },
];

export function Sidebar({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
  const { profile, user, signOut, updateAvatar } = useAuth();
  const { activeTheme } = useSeasonalTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentMonthYear, setCurrentMonthYear] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Función para obtener el mes y año actual en español
  const getCurrentMonthYear = () => {
    const now = new Date();
    const months = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `${month} ${year}`;
  };

  // Efecto para actualizar el mes y año cada minuto
  useEffect(() => {
    const updateMonthYear = () => {
      setCurrentMonthYear(getCurrentMonthYear());
    };
    
    // Actualizar inmediatamente
    updateMonthYear();
    
    // Actualizar cada minuto para detectar cambios de mes/año
    const interval = setInterval(updateMonthYear, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Función para obtener el color del borde según el tema
  const getThemeBorderColors = () => {
    switch (activeTheme) {
      case 'halloween':
        return {
          gradient: 'from-orange-500 via-purple-500 to-orange-600',
          glow: 'from-orange-400 via-purple-500 to-orange-600'
        };
      case 'christmas':
        return {
          gradient: 'from-red-500 via-green-500 to-red-600',
          glow: 'from-red-400 via-green-500 to-red-600'
        };
      default:
        return {
          gradient: 'from-blue-400 via-blue-500 to-blue-600',
          glow: 'from-blue-400 via-blue-500 to-blue-600'
        };
    }
  };

  // Función para obtener las iniciales del usuario
  const getInitials = (email: string | undefined, name: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.split('@')[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  // Función para generar un color basado en el email/nombre
  const getAvatarColor = (text: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  const userEmail = user?.email || profile?.email || '';
  const userName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : (profile?.full_name || user?.user_metadata?.full_name);
  const initials = getInitials(userEmail, userName);
  const avatarColor = getAvatarColor(userEmail || userName || 'default');
  
  const hasCustomAvatar = profile?.avatar_url;
  const pathname = usePathname();
  
  // Debug
  useEffect(() => {
    console.log('👤 Avatar URL:', profile?.avatar_url);
    console.log('👤 Has Custom Avatar:', hasCustomAvatar);
  }, [profile?.avatar_url, hasCustomAvatar]);
  
  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {(open || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <motion.aside
            id="sidebar-menu"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-40 h-full w-56 bg-[#0B1017] flex flex-col items-center py-8 gap-2 lg:translate-x-0 lg:opacity-100"
            aria-label="Menú lateral"
            role="navigation"
            tabIndex={-1}
          >

            {/* Avatar premium con anillo azul - Clickeable para subir foto */}
            <div className="mb-8 flex flex-col items-center relative">
              {/* Input oculto para subir foto */}
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !user) return;
                  
                  try {
                    // Validar tipo de archivo
                    if (!file.type.startsWith('image/')) {
                      alert('Por favor, selecciona una imagen válida');
                      return;
                    }
                    
                    // Validar tamaño (máximo 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      alert('La imagen es muy grande. Máximo 5MB');
                      return;
                    }
                    
                    // Subir a Supabase Storage
                    const timestamp = Date.now();
                    const fileName = `avatar-${user.id}-${timestamp}.${file.name.split('.').pop()}`;
                    
                    const { data, error } = await supabase.storage
                      .from('avatars')
                      .upload(fileName, file, {
                        cacheControl: '0',
                        upsert: true
                      });
                    
                    if (error) {
                      console.error('Error al subir a Supabase Storage:', error);
                      alert(`Error al subir la imagen: ${error.message}`);
                      return;
                    }
                    
                    // Obtener URL pública
                    const { data: urlData } = supabase.storage
                      .from('avatars')
                      .getPublicUrl(fileName);
                    
                    if (!urlData || !urlData.publicUrl) {
                      alert('No se pudo obtener la URL de la imagen');
                      return;
                    }
                    
                    const publicUrlWithTimestamp = `${urlData.publicUrl}?t=${timestamp}`;
                    
                    // Actualizar perfil usando el contexto de Auth (igual que en página perfil)
                    const { error: updateError } = await updateAvatar(publicUrlWithTimestamp);
                    
                    if (updateError) {
                      console.error('Error al actualizar el perfil:', updateError);
                      alert(`Error al actualizar el perfil: ${updateError.message}`);
                      return;
                    }
                    
                    // Actualizar refreshKey para forzar re-render
                    setRefreshKey(prevKey => prevKey + 1);
                    
                    console.log('✅ Foto de perfil actualizada correctamente');
                  } catch (error: any) {
                    console.error('Error al subir foto:', error);
                    alert(`Error al subir la foto: ${error.message || 'Intenta de nuevo'}`);
                  }
                  
                  // Limpiar el input
                  if (e.target) {
                    e.target.value = '';
                  }
                }}
              />
              
              {/* Avatar con borde - Color según tema - Clickeable */}
              <button
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="relative w-20 h-20 rounded-full p-[3px] cursor-pointer hover:scale-105 transition-transform group"
                style={{ 
                  background: activeTheme === 'halloween' 
                    ? '#ff6b00' 
                    : activeTheme === 'christmas'
                    ? '#c41e3a'
                    : '#141820',
                  filter: 'none', 
                  boxShadow: 'none' 
                }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-[#101010]">
                  {hasCustomAvatar ? (
                    <>
                      <Image 
                        key={`sidebar-avatar-${refreshKey}`}
                        src={`${profile.avatar_url}?t=${new Date().getTime()}-${refreshKey}`}
                        alt="Avatar del usuario" 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover rounded-full" 
                      />
                      {/* Overlay hover para cambiar foto */}
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <div 
                      className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl relative"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {/* Icono de cámara visible por defecto cuando no hay foto */}
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                {/* Brillo superior */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                
                {/* Badge "Subir foto" cuando no hay avatar */}
                {!hasCustomAvatar && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Subir foto
                  </div>
                )}
              </button>
            </div>

            {/* Badge premium con mes y año - Movido arriba */}
            <div className="w-full flex justify-center mb-6">
              <span className="inline-block text-white text-xs font-bold px-4 py-2 rounded-full bg-[#161b22]/80 backdrop-blur-xl border-0 shadow-lg capitalize tracking-wide">
                {currentMonthYear}
              </span>
            </div>

            <nav className="flex flex-col gap-2 w-full px-3" aria-label="Navegación lateral" role="menu">
              {sidebarItems.map((item, idx) => (
                <div key={item.name} className="relative">
                  {item.isLogout ? (
                    <button
                      type="button"
                      disabled={isLoggingOut}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group w-full text-left ${
                        isLoggingOut 
                          ? 'bg-[#161b22]/80 backdrop-blur-xl text-gray-600 cursor-not-allowed' 
                          : 'text-gray-400 hover:bg-[#161b22]/80 hover:backdrop-blur-xl hover:text-white'
                      }`}
                      tabIndex={0}
                      role="menuitem"
                      aria-label={isLoggingOut ? "Cerrando sesión..." : item.tooltip}
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (isLoggingOut) return;
                        
                        setIsLoggingOut(true);
                        
                        // Cerrar sidebar en móvil inmediatamente
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setOpen(false);
                        }
                        
                        try {
                          // Intentar cerrar sesión
                          await signOut();
                        } catch (error) {
                          console.error('Error al cerrar sesión:', error);
                        } finally {
                          // Siempre redirigir, independientemente del resultado
                          if (typeof window !== 'undefined') {
                            // Limpiar localStorage y sessionStorage
                            localStorage.clear();
                            sessionStorage.clear();
                            
                            // Forzar redirección
                            window.location.replace('/login');
                          }
                        }
                      }}
                    >
                      <span className={`text-xl transition-transform ${isLoggingOut ? 'animate-spin' : 'group-hover:scale-110'}`} aria-hidden="true">
                        {isLoggingOut ? <FiSettings /> : item.icon}
                      </span>
                      <span className="text-sm font-semibold">
                        {isLoggingOut ? "Cerrando..." : item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group relative overflow-hidden ${
                        pathname === item.href 
                          ? 'bg-[#161b22]/80 backdrop-blur-xl text-white font-bold shadow-lg' 
                          : 'text-gray-400 hover:bg-[#161b22]/80 hover:backdrop-blur-xl hover:text-white'
                      }`}
                      tabIndex={0}
                      role="menuitem"
                      aria-current={pathname === item.href ? 'page' : undefined}
                      aria-label={item.tooltip}
                      onClick={(e) => {
                        e.preventDefault(); // Prevenir la navegación normal
                        if (typeof window !== 'undefined') {
                          if (window.innerWidth < 768) {
                            setOpen(false);
                          }
                          // Navegar a la página y forzar la recarga
                          window.location.href = item.href;
                        }
                      }}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform" aria-hidden="true">{item.icon}</span>
                      <span className="text-sm font-semibold">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex-1" />

            {/* Footer premium */}
            <div className="text-xs text-gray-400 mt-2 flex items-center gap-1" aria-label="Copyright">
              <span className="text-blue-500/60">©</span>
              <span>{new Date().getFullYear()} Flasti LLC.</span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
            tabIndex={-1}
            role="presentation"
          />
        )}
      </AnimatePresence>
    </>
  );
}
