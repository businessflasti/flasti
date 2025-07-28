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

  // Tamaños basados en el prop size
  const sizes = {
    sm: {
      logoHeight: 22,
      logoWidth: 22,
      textClass: "text-xl"
    },
    md: {
      logoHeight: 28,
      logoWidth: 28,
      textClass: "text-2xl"
    },
    lg: {
      logoHeight: 36,
      logoWidth: 36,
      textClass: "text-3xl"
    }
  };

  // Obtener dimensiones según el tamaño
  const { logoHeight, logoWidth, textClass } = sizes[size];

  // Determinar el color basado en el tema y la ruta del logo
  const textColor = isDark ? "text-white" : "text-gray-900";
  // Si el logo se usa en el footer, usar isoblanco.svg
  const logoPath = pathname?.includes("footer") ? "/logo/isoblanco.svg" : "/logo/isotipo.svg";

  // Mostrar texto solo si no estamos en la página de login
  const showText = pathname !== "/login";

  return (
    <div className={`${className} flex justify-center`} tabIndex={-1} style={{ cursor: "default" }}>
      <div className="flex items-center justify-center">
        {/* Logo SVG */}
        <div className="relative flex items-center justify-center" style={{ height: logoHeight, width: logoWidth }}>
          <Image
            src={logoPath}
            alt="Flasti Logo"
            width={logoWidth}
            height={logoHeight}
            className="object-contain"
            priority
            loading="eager"
            sizes="(max-width: 640px) 22px, (max-width: 768px) 28px, 36px"
            quality={100}
          />
        </div>
        {/* Texto del logo */}
        {showText && (
          <span
            className={`ml-2 font-bold ${textClass} ${textColor}`}
            style={{
              fontFamily: "'Söhne', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 600,
              letterSpacing: '-0.01em',
              userSelect: 'none',
              lineHeight: 1
            }}
          >
            flasti
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
