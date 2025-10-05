import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Flasti - Plataforma Global de Microtareas",
  description: "Conoce la historia de Flasti, plataforma global con más de 100K usuarios en 20+ países. Nuestra misión es democratizar el acceso a oportunidades digitales para generar ingresos.",
  keywords: ["sobre flasti", "historia flasti", "misión flasti", "plataforma microtareas", "quienes somos"],
  alternates: {
    canonical: "https://flasti.com/nosotros",
  },
  openGraph: {
    title: "Sobre Nosotros - Flasti",
    description: "Descubre cómo Flasti está transformando la forma en que las personas generan ingresos en línea.",
    url: "https://flasti.com/nosotros",
  },
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
