import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Aplicaciones",
  description: "Explora nuestra selección de aplicaciones disponibles en Flasti.",
};

export default function AplicacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
