import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Flasti",
  description: "Conoce más sobre Flasti, nuestra misión, visión y el equipo detrás de la plataforma.",
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
