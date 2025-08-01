import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Política de Privacidad",
  description: "Política de privacidad y protección de datos de la plataforma Flasti.",
};

export default function PrivacidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}