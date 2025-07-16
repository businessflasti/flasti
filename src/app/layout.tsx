import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import ClientLayout from "@/components/layout/ClientLayout";
import YandexMetrica from "@/components/analytics/YandexMetrica";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import { NavbarDemo } from "@/components/ui/resizable-navbar-demo";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flasti | Ganancia colectiva",
  description: "Genera ingresos completando microtrabajos en línea. Accede a la plataforma y comienza a trabajar desde casa sin experiencia previa.",
  icons: {
    icon: "/logo/isotipo.svg",
    apple: "/logo/isotipo.svg",
  },
  metadataBase: new URL('https://flasti.net'),
  other: {
    'link': [
      {
        rel: 'preload',
        href: '/logo/isotipo.svg',
        as: 'image',
        type: 'image/svg+xml'
      }
    ]
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
        {/* Yandex Metrica - Colocado lo más cerca posible del head */}
        <YandexMetrica />

        {/* Facebook Pixel - Colocado después de Yandex Metrica */}
        <FacebookPixel />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8330194041691289"
          crossOrigin="anonymous"
        ></script>

        {/* Configuración para AdSense: Deshabilitar anuncios superpuestos (vignettes) */}
        <script dangerouslySetInnerHTML={{ __html: `
          (window.adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-8330194041691289",
            overlays: {bottom: false}
          });
        `}} />

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
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientLayout>
          <ConditionalNavbar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
