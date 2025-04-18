import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Confirmar Nueva Contraseña",
  description: "Establece una nueva contraseña para tu cuenta de Flasti.",
};

export default function ResetPasswordConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
