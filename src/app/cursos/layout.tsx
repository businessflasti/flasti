import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Cursos",
  description: "Explora nuestra selección de cursos y aplicaciones disponibles en Flasti.",
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
