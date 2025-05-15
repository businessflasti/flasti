import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Ganancia colectiva",
  description: "Genera ingresos completando microtrabajos en línea. Accede a la plataforma y comienza a trabajar desde casa sin experiencia previa.",
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
    description: "Genera ingresos completando microtrabajos en línea. Accede a la plataforma y comienza a trabajar desde casa sin experiencia previa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flasti | Ganancia colectiva",
    description: "Genera ingresos completando microtrabajos en línea. Accede a la plataforma y comienza a trabajar desde casa sin experiencia previa.",
  },
};