import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Aplicaciones",
  description: "Descubre todas las aplicaciones disponibles en la plataforma Flasti.",
};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
