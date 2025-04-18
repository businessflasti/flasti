import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Recuperar Contraseña",
  description: "Recupera el acceso a tu cuenta de Flasti restableciendo tu contraseña.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
