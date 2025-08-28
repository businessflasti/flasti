"use client";

import { usePathname } from "next/navigation";
import { NavbarDemo } from "@/components/ui/resizable-navbar-demo";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Oculta el header en /login y dashboard
  const hideNavbar = !pathname || pathname === "/login" || pathname.startsWith("/dashboard");
  if (hideNavbar) return null;
  return <NavbarDemo />;
}
