import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regístrate Gratis | Flasti - Ganar Dinero Online",
  description: "Regístrate gratis en Flasti y comienza a ganar dinero completando microtareas en línea. Sin experiencia previa. Únete a más de 100K usuarios. Gana de $0.50 a $10 USD por tarea.",
  keywords: ["registrarse flasti", "crear cuenta flasti", "registro gratis", "ganar dinero online gratis", "registro microtareas"],
  alternates: {
    canonical: "https://flasti.com/register",
  },
  openGraph: {
    title: "Regístrate Gratis en Flasti - Comienza a Ganar Dinero Online",
    description: "Únete a Flasti gratis y empieza a generar ingresos completando microtareas desde casa.",
    url: "https://flasti.com/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
