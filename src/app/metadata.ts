import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Ganancia colectiva",
  description: "Plataforma de afiliados y herramientas digitales para generar ingresos online.",
  icons: {
    icon: "/logo/isotipo.png",
    apple: "/logo/isotipo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flasti",
  },
  openGraph: {
    type: "website",
    siteName: "Flasti",
    title: "Flasti | Ganancia colectiva",
    description: "Plataforma de afiliados y herramientas digitales para generar ingresos online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flasti | Ganancia colectiva",
    description: "Plataforma de afiliados y herramientas digitales para generar ingresos online.",
  },
};