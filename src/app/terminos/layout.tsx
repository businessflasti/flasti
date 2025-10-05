import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Flasti",
  description: "Lee los términos y condiciones de uso de la plataforma Flasti. Conoce tus derechos y obligaciones al usar nuestros servicios de microtareas pagadas.",
  alternates: {
    canonical: "https://flasti.com/terminos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TerminosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
