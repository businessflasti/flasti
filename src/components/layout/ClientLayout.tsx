'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { EnhancedNotificationProvider } from "@/contexts/EnhancedNotificationContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BalanceVisibilityProvider } from "@/contexts/BalanceVisibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { Toaster as HotToaster } from "@/components/ui/Toaster";
import CopyProtection from "@/components/security/CopyProtection";
import AffiliateClickRecorder from "@/components/affiliate/AffiliateClickRecorder";
import HydrationFix from "@/components/utils/HydrationFix";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BalanceVisibilityProvider>
            {/* Activado el onboarding para nuevos usuarios */}
            <OnboardingProvider>
              <EnhancedNotificationProvider>
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
  );
}
