"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Suspense } from "react";

function PayPalWithdrawalSuccessContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const amount = searchParams.get("amount") || "0";
  const email = searchParams.get("email") || "tu cuenta de PayPal";

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header visible only in this page */}
      <header className="w-full py-4 border-b border-border/20 bg-card/70 backdrop-blur-md">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-primary font-bold text-xl">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="glow-effect">
                <path fillRule="evenodd" clipRule="evenodd" d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="url(#paint0_linear)" />
                <path d="M21.5253 15.535V10.3622H18.0229V15.535H13.9517V19.0425H18.0229V25.6486H21.5253V19.0425H25.5966V15.535H21.5253Z" fill="white" />
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9333ea" />
                    <stop offset="0.33" stopColor="#ec4899" />
                    <stop offset="0.66" stopColor="#f97316" />
                    <stop offset="1" stopColor="#facc15" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
            <h1 className="font-semibold text-xl hidden sm:block">Flow State</h1>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white font-bold relative">
              U
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-background"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom mt-12">
        <div className="max-w-3xl mx-auto">
          <Card className="glass-card p-8 mb-8">
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-20 h-20 rounded-full bg-[#10b981]/20 flex items-center justify-center mb-6">
                <CheckCircle className="text-[#10b981]" size={42} />
              </div>

              <h1 className="text-4xl font-bold mb-4">{t('solicitudExitosa') as string}</h1>

              <div className="mb-8 w-full max-w-md">
                <div className="h-2 w-full bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] rounded-full mb-8"></div>

                <p className="text-foreground/70 text-lg mb-6">
                  {t('solicitudRetiro') as string} <span className="font-bold text-gradient">${amount} USD</span> {t('aTravesDe') as string}
                </p>

                <div className="bg-card/60 border border-border/20 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">{t('detallesTransaccion') as string}</h3>
                  <ul className="text-sm text-foreground/80 space-y-2">
                    <li className="flex justify-between">
                      <span>{t('metodo') as string}</span>
                      <span className="font-medium">PayPal</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('monto') as string}</span>
                      <span className="font-medium">${amount} USD</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('correoElectronico') as string}</span>
                      <span className="font-medium">{email}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('estado') as string}</span>
                      <span className="text-[#10b981] font-medium">{t('procesando') as string}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('tiempoEstimado') as string}</span>
                      <span className="font-medium">{t('diasHabiles') as string}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button
                    className="bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity px-8 py-6 h-auto"
                  >
                    {t('volverDashboard') as string}
                  </Button>
                </Link>
                <Link href="/dashboard/withdrawals">
                  <Button variant="outline" className="px-8 py-6 h-auto">
                    {t('volverOpciones') as string}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="p-4 border border-[#009cde]/30 bg-[#009cde]/10 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="bg-[#009cde]/20 p-2 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#009cde" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-[#009cde]">{t('informacionImportante') as string}</h4>
                <p className="text-sm text-foreground/80">
                  {t('recibirasCorreo') as string}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayPalWithdrawalSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-primary mb-2">⟳</div><p className="ml-2">Cargando...</p></div>}>
      <PayPalWithdrawalSuccessContent />
    </Suspense>
  );
}
