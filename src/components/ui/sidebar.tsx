"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiGift, FiBell, FiLogOut, FiBarChart2, FiSettings, FiDollarSign, FiClock, FiHome, FiAward, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const sidebarItems = [
  { name: "Inicio", icon: <FiHome />, href: "/dashboard", tooltip: "Inicio" },
  { name: "Historial de Retiros", icon: <FiClock />, href: "/dashboard/withdrawals-history", tooltip: "Historial de retiros" },
  { name: "Perfil", icon: <FiUser />, href: "/dashboard/perfil", tooltip: "Tu perfil" },
  { name: "Recompensas", icon: <FiAward />, href: "/dashboard/rewards-history", tooltip: "Historial de recompensas" },
  { name: "Retiros", icon: <FiDollarSign />, href: "/dashboard/withdrawals", tooltip: "Solicitar retiro" },
  { name: "Notificaciones", icon: <FiBell />, href: "/dashboard/notifications", tooltip: "Tus notificaciones" },
  { name: "Soporte", icon: <FiMessageCircle />, href: "/contacto", tooltip: "Soporte y ayuda" },
  { name: "Salir", icon: <FiLogOut />, href: "/logout", tooltip: "Cerrar sesión", isLogout: true },
];

export function Sidebar({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
  const { profile, user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
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
  const userName = profile?.full_name || user?.user_metadata?.full_name;
  const initials = getInitials(userEmail, userName);
  const avatarColor = getAvatarColor(userEmail || userName || 'default');
  
  const hasCustomAvatar = profile?.avatar_url;
  const color = '#232323';
  const pathname = usePathname();
  // Eliminar el botón flotante, solo sidebar y overlay
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
            className="fixed top-0 left-0 z-40 h-full w-56 bg-[#101010] border-r border-[#232323] flex flex-col items-center py-8 gap-2 shadow-xl lg:translate-x-0 lg:opacity-100"
            aria-label="Menú lateral"
            role="navigation"
            tabIndex={-1}
          >
            <div className="mb-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden" style={{ borderColor: color, transition: 'border-color 0.3s' }}>
                {hasCustomAvatar ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt="Avatar del usuario" 
                    width={80} 
                    height={80} 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </div>
            <nav className="flex flex-col gap-2 w-full" aria-label="Navegación lateral" role="menu">
              {sidebarItems.map((item, idx) => (
                <div key={item.name} className="relative">
                  {item.isLogout ? (
                    <button
                      type="button"
                      disabled={isLoggingOut}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0] group w-full text-left ${
                        isLoggingOut 
                          ? 'bg-[#232323] text-[#666] cursor-not-allowed' 
                          : pathname === item.href 
                            ? 'bg-[#3c66ce] text-white font-bold shadow-md' 
                            : 'text-[#b0b0b0] hover:bg-[#232323] hover:text-white'
                      }`}
                      data-tooltip-id={`sidebar-${item.name}`}
                      data-tooltip-content={isLoggingOut ? "Cerrando sesión..." : item.tooltip}
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
                      <span className={`text-lg transition-transform ${isLoggingOut ? 'animate-spin' : 'group-hover:scale-110'}`} aria-hidden="true">
                        {isLoggingOut ? <FiSettings /> : item.icon}
                      </span>
                      <span className="text-sm font-medium">
                        {isLoggingOut ? "Cerrando..." : item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0] group ${pathname === item.href ? 'bg-[#3c66ce] text-white font-bold shadow-md' : 'text-[#b0b0b0] hover:bg-[#232323] hover:text-white'}`}
                      data-tooltip-id={`sidebar-${item.name}`}
                      data-tooltip-content={item.tooltip}
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
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  )}
                  <Tooltip id={`sidebar-${item.name}`} place="right" />
                </div>
              ))}
            </nav>
            <div className="flex-1" />
            {/* Etiqueta de usuario premium */}
            <div className="w-full flex justify-center mb-2">
              <span className="inline-block bg-[#ec3f7c] text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md border border-[#232323] uppercase tracking-wide animate-pulse-slow">
                Cuenta Premium
              </span>
            </div>
            <div className="text-xs text-[#b0b0b0] opacity-60 mt-8" aria-label="Copyright">© {new Date().getFullYear()} Flasti Inc.</div>
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
