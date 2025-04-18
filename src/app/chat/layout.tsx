import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Chat",
  description: "Comunícate con nuestro equipo de soporte a través del chat de Flasti.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
