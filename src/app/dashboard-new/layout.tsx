import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flasti | Panel personal",
  description: "Accede a tu panel personal de Flasti para gestionar tus ganancias y actividades.",
};

export default function DashboardNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
