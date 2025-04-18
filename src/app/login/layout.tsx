import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Iniciar sesión",
  description: "Inicia sesión en tu cuenta de Flasti para acceder a todas las funcionalidades.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
