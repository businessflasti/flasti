import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti",
  description: "Plataforma de afiliados y herramientas digitales para generar ingresos online.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flasti",
  },
  openGraph: {
    type: "website",
    siteName: "Flasti",
    title: "Flasti",
    description: "Plataforma de afiliados y herramientas digitales para generar ingresos online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flasti",
    description: "Plataforma de afiliados y herramientas digitales para generar ingresos online.",
  },
};