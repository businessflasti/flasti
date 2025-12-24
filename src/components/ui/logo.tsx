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
      logoHeight: 28,
      logoWidth: 100,
      textClass: "text-xl"
    },
    md: {
      logoHeight: 40,
      logoWidth: 140,
      textClass: "text-2xl"
    },
    lg: {
      logoHeight: 48,
      logoWidth: 170,
      textClass: "text-3xl"
    }
  };

  // Obtener dimensiones según el tamaño
  const { logoHeight, logoWidth, textClass } = sizes[size];

  // Determinar qué logo usar
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  let logoPath: string;
  
  if (isLoginPage || isRegisterPage) {
    logoPath = "/logo/logo-register.png";
  } else {
    logoPath = "/logo/logo-web.png";
  }
  
  const finalWidth = logoWidth;
  const finalHeight = logoHeight;

  return (
    <div className={`${className} flex justify-center`} tabIndex={-1} style={{ cursor: "default" }}>
      <div className="flex items-center justify-center">
        {/* Logo completo o isotipo según la página */}
        <div className="relative flex items-center justify-center" style={{ height: finalHeight, width: finalWidth }}>
          <Image
            src={logoPath}
            alt="Flasti Logo"
            width={finalWidth * 3}
            height={finalHeight * 3}
            className="object-contain"
            style={{ width: finalWidth, height: finalHeight }}
            priority
            loading="eager"
            quality={100}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default Logo;
