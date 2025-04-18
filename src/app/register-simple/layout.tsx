import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Bienvenido",
  description: "Regístrate en Flasti de forma rápida y sencilla para comenzar a generar ingresos.",
};

export default function RegisterSimpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
