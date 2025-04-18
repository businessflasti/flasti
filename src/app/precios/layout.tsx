import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Precios",
  description: "Conoce nuestros planes y precios para acceder a todas las funcionalidades de Flasti.",
};

export default function PreciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
