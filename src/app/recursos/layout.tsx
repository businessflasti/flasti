import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Recursos",
  description: "Accede a recursos y materiales para promocionar las aplicaciones de Flasti.",
};

export default function RecursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
