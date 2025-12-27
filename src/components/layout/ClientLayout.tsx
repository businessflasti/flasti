'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { EnhancedNotificationProvider } from "@/contexts/EnhancedNotificationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BalanceVisibilityProvider } from "@/contexts/BalanceVisibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { Toaster as HotToaster } from "@/components/ui/Toaster";
import CopyProtection from "@/components/security/CopyProtection";
import AffiliateClickRecorder from "@/components/affiliate/AffiliateClickRecorder";
import HydrationFix from "@/components/utils/HydrationFix";
import AppLoader from "@/components/ui/AppLoader";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import ThemeApplier from "@/components/themes/ThemeApplier";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          {/* AppLoader dentro de AuthProvider para acceder a dataReady */}
          <AppLoader />
          <LanguageProvider>
            <BalanceVisibilityProvider>
              <OnboardingProvider>
                <EnhancedNotificationProvider>
                  <ThemeApplier />
                  <Toaster position="top-right" richColors />
                  <HotToaster />
                  <CopyProtection />
                  <AffiliateClickRecorder />
                  <HydrationFix />
                  {children}
                </EnhancedNotificationProvider>
              </OnboardingProvider>
            </BalanceVisibilityProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
