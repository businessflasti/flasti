"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTextWhenExpanded?: boolean;
}

const Logo = ({ className = "", size = "md", showTextWhenExpanded = true }: LogoProps) => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isDark = theme === "dark";

  // Tamaños basados en el prop size - ajustados para logo completo
  const sizes = {
    sm: {
      logoHeight: 22,
      logoWidth: 80, // Ancho ajustado para logo completo
      textClass: "text-xl"
    },
    md: {
      logoHeight: 32,
      logoWidth: 110, // Ancho ajustado para logo completo - sutilmente más grande
      textClass: "text-2xl"
    },
    lg: {
      logoHeight: 36,
      logoWidth: 130, // Ancho ajustado para logo completo
      textClass: "text-3xl"
    }
  };

  // Obtener dimensiones según el tamaño
  const { logoHeight, logoWidth, textClass } = sizes[size];

  // Determinar qué logo usar
  const isLoginPage = pathname === "/login";
  let logoPath: string;
  
  {
    // Usar isotipo en login, logo completo en otras páginas
    logoPath = isLoginPage ? "/logo/isotipo-web.png" : "/logo/logo-web.png";
  }
  
  // Ajustar tamaños para isotipo en login (cuadrado)
  const finalWidth = isLoginPage ? logoHeight : logoWidth;
  const finalHeight = logoHeight;

  return (
    <div className={`${className} flex justify-center`} tabIndex={-1} style={{ cursor: "default" }}>
      <div className="flex items-center justify-center">
        {/* Logo completo o isotipo según la página */}
        <div className="relative flex items-center justify-center" style={{ height: finalHeight, width: finalWidth }}>
          <Image
            src={logoPath}
            alt="Flasti Logo"
            width={finalWidth}
            height={finalHeight}
            className="object-contain"
            priority
            loading="eager"
            sizes={isLoginPage ? "(max-width: 640px) 22px, (max-width: 768px) 32px, 36px" : "(max-width: 640px) 80px, (max-width: 768px) 110px, 130px"}
            quality={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Logo;
