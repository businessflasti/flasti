'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { EnhancedNotificationProvider } from "@/contexts/EnhancedNotificationContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BalanceVisibilityProvider } from "@/contexts/BalanceVisibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import CopyProtection from "@/components/security/CopyProtection";
import AffiliateClickRecorder from "@/components/affiliate/AffiliateClickRecorder";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <BalanceVisibilityProvider>
                {/* Activado el onboarding para nuevos usuarios */}
                <OnboardingProvider>
                  <EnhancedNotificationProvider>
                    <Toaster position="top-right" richColors />
                    <CopyProtection />
                    <AffiliateClickRecorder />
                    {children}
                  </EnhancedNotificationProvider>
                </OnboardingProvider>
              </BalanceVisibilityProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
