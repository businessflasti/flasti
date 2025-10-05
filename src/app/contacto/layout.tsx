import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Flasti - Soporte y Ayuda",
  description: "¿Tienes dudas sobre cómo ganar dinero con Flasti? Contacta con nuestro equipo de soporte. Estamos aquí para ayudarte a generar ingresos online.",
  keywords: ["contacto flasti", "soporte flasti", "ayuda flasti", "contactar flasti"],
  alternates: {
    canonical: "https://flasti.com/contacto",
  },
  openGraph: {
    title: "Contacto - Flasti",
    description: "Ponte en contacto con el equipo de Flasti para resolver tus dudas.",
    url: "https://flasti.com/contacto",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
