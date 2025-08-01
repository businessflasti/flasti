import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Información Legal",
  description: "Información legal sobre el marco normativo que rige el uso de la plataforma Flasti.",
};

export default function InformacionLegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}