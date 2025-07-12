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
  { name: "Balance", icon: <FiDollarSign />, href: "/dashboard/balance", tooltip: "Tu balance" },
  { name: "Historial de Retiros", icon: <FiClock />, href: "/dashboard/withdrawals-history", tooltip: "Historial de retiros" },
  { name: "Perfil", icon: <FiUser />, href: "/dashboard/profile", tooltip: "Tu perfil" },
  { name: "Recompensas", icon: <FiAward />, href: "/dashboard/rewards-history", tooltip: "Historial de recompensas" },
  { name: "Retiros", icon: <FiGift />, href: "/dashboard/withdrawals", tooltip: "Solicitar retiro" },
  { name: "Notificaciones", icon: <FiBell />, href: "/dashboard/notifications", tooltip: "Tus notificaciones" },
  { name: "Soporte", icon: <FiMessageCircle />, href: "/contacto", tooltip: "Soporte y ayuda" },
  { name: "Salir", icon: <FiLogOut />, href: "/logout", tooltip: "Cerrar sesión", isLogout: true },
];

export function Sidebar({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
  const { profile, user } = useAuth();
  const avatar = profile?.avatar_url || '/images/profiles/profile1.jpg';
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
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2" style={{ borderColor: color, background: color, transition: 'border-color 0.3s' }}>
                <Image src={avatar} alt="Avatar del usuario" width={56} height={56} className="rounded-full" />
              </div>
              <span className="text-white font-semibold text-base" aria-label="Bienvenida">Bienvenido</span>
            </div>
            <nav className="flex flex-col gap-2 w-full" aria-label="Navegación lateral" role="menu">
              {sidebarItems.map((item, idx) => (
                <div key={item.name} className="relative">
                  {item.isLogout ? (
                    <button
                      type="button"
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0] group w-full text-left ${pathname === item.href ? 'bg-[#3c66ce] text-white font-bold shadow-md' : 'text-[#b0b0b0] hover:bg-[#232323] hover:text-white'}`}
                      data-tooltip-id={`sidebar-${item.name}`}
                      data-tooltip-content={item.tooltip}
                      tabIndex={0}
                      role="menuitem"
                      aria-label={item.tooltip}
                      onClick={async () => {
                        const { signOut } = await import('@/contexts/AuthContext');
                        if (typeof signOut === 'function') await signOut();
                        window.location.href = '/login';
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setOpen(false);
                        }
                      }}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform" aria-hidden="true">{item.icon}</span>
                      <span className="text-sm font-medium">{item.name}</span>
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
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setOpen(false);
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
                Cuenta Ilimitada
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
