import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Pago Seguro",
  description: "Completa tu pago de forma segura para acceder a todas las funcionalidades de Flasti.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
