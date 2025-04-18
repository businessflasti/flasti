import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Términos y Condiciones",
  description: "Términos y condiciones de uso de la plataforma Flasti.",
};

export default function TerminosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
