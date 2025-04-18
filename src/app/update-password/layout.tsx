import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Actualizar Contraseña",
  description: "Actualiza la contraseña de tu cuenta de Flasti para mayor seguridad.",
};

export default function UpdatePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
