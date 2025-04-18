import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Bienvenido",
  description: "Regístrate en Flasti y comienza a generar ingresos con nuestra plataforma.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
