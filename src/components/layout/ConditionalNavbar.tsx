"use client";

import { usePathname } from "next/navigation";
import { NavbarDemo } from "@/components/ui/resizable-navbar-demo";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Oculta el header en /login y cualquier ruta bajo /checkout
  const hideNavbar = pathname === "/login" || pathname.startsWith("/checkout");
  if (hideNavbar) return null;
  return <NavbarDemo />;
}
