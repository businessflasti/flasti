import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Información Legal | Flasti",
  description: "Información legal y marco normativo que rige el uso de la plataforma Flasti. Conoce nuestras políticas y regulaciones.",
  alternates: {
    canonical: "https://flasti.com/informacion-legal",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InformacionLegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}