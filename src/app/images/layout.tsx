import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Imágenes",
  description: "Genera imágenes impresionantes con inteligencia artificial en Flasti.",
};

export default function ImagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
