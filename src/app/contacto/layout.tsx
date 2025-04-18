import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Contacto",
  description: "Ponte en contacto con nuestro equipo de soporte para resolver tus dudas.",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
