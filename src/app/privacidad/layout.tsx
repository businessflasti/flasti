import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Flasti",
  description: "Conoce cómo Flasti protege tus datos personales. Política de privacidad y protección de datos de nuestra plataforma de microtareas.",
  alternates: {
    canonical: "https://flasti.com/privacidad",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}