import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Flasti - Accede a tu Cuenta",
  description: "Inicia sesión en tu cuenta de Flasti para acceder a microtareas pagadas y comenzar a ganar dinero online desde casa.",
  keywords: ["login flasti", "iniciar sesión flasti", "acceder cuenta flasti"],
  alternates: {
    canonical: "https://flasti.com/login",
  },
  openGraph: {
    title: "Iniciar Sesión en Flasti",
    description: "Accede a tu cuenta de Flasti y comienza a ganar dinero con microtareas.",
    url: "https://flasti.com/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
