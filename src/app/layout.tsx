import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          // Script adicional de protección contra copia
          document.addEventListener('DOMContentLoaded', function() {
            // Deshabilitar el menú contextual en imágenes
            const images = document.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
              // Solo bloquear el menú contextual (clic derecho)
              images[i].oncontextmenu = function() { return false; };
            }
          });
        ` }} />

        {/* Script para solucionar problemas de hidratación */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Eliminar atributos problemáticos antes de la hidratación
          (function() {
            function cleanupAttributes() {
              if (document.body) {
                if (document.body.hasAttribute('cz-shortcut-listen')) {
                  document.body.removeAttribute('cz-shortcut-listen');
                }
              }
            }
            // Ejecutar inmediatamente
            cleanupAttributes();
            // Ejecutar cuando el DOM esté listo
            document.addEventListener('DOMContentLoaded', cleanupAttributes);
          })();
        ` }} />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
