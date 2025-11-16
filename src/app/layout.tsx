import { Inter } from "next/font/google";
import "./globals.css";
import "./globals-premium-theme.css";
import { Metadata } from "next";
import ClientLayout from "@/components/layout/ClientLayout";
import YandexMetrica from "@/components/analytics/YandexMetrica";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import StructuredData from "@/components/seo/StructuredData";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flasti | Microtareas en línea",
  description: "Genera ingresos completando microtareas en línea. Trabajo desde casa sin experiencia previa y gana de $1 a $20 USD por tarea. Únete a más de 100K usuarios en más de 20 países.",
  keywords: [
    "ganar dinero online",
    "trabajo en línea",
    "microtareas pagadas",
    "como ganar dinero en internet",
    "trabajo desde casa",
    "ingresos extra online",
    "ganar dinero sin experiencia",
    "plataforma de microtareas",
    "generar ingresos por internet",
    "trabajo remoto flexible",
    "ganar dinero desde casa",
    "trabajos online pagados",
    "microtareas remuneradas",
    "ingresos pasivos online",
    "trabajar por internet"
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo/isotipo-web.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/isotipo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo/isotipo-web.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL('https://flasti.com'),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'msvalidate.01': 'bing-verification-code',
    },
  },
  category: 'technology',
  classification: 'Online Platform, Microtasks, Remote Work, Income Generation',
  other: {
    'link': [
      {
        rel: 'preload',
        href: '/logo/isotipo-web.png',
        as: 'image',
        type: 'image/png'
      }
    ],
    'googlebot': 'index, follow, noimageindex',
    'bingbot': 'index, follow, noimageindex',
    'robots': 'index, follow, noimageindex',
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flasti",
  },
  openGraph: {
    type: "website",
    siteName: "Flasti",
    title: "Flasti | Microtareas en línea",
    description: "Genera ingresos completando microtareas en línea. Trabajo desde casa sin experiencia previa",
    url: "https://flasti.com",
    locale: "es_ES",
    images: [
      {
        url: "https://flasti.com/logo/logo-web.png",
        width: 1067,
        height: 372,
        alt: "Flasti - Plataforma de microtareas pagadas para ganar dinero online",
        type: "image/png",
      },
      {
        url: "https://flasti.com/logo/isotipo-web.png",
        width: 360,
        height: 354,
        alt: "Flasti Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@flasti",
    creator: "@flasti",
    title: "Flasti | Microtareas en línea",
    description: "Genera ingresos completando microtareas en línea. Trabajo desde casa sin experiencia previa",
    images: ["https://flasti.com/logo/logo-web.png"],
  },
  alternates: {
    canonical: "https://flasti.com",
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
        {/* Structured Data for SEO */}
        <StructuredData />

        {/* Google Analytics */}
        <GoogleAnalytics />

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
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
