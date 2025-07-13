"use client";

import { usePathname } from "next/navigation";
import { NavbarDemo } from "@/components/ui/resizable-navbar-demo";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Oculta el header en /login, cualquier ruta bajo /checkout y dashboard
  const hideNavbar = !pathname || pathname === "/login" || pathname.startsWith("/checkout") || pathname.startsWith("/dashboard");
  if (hideNavbar) return null;
  return <NavbarDemo />;
}
