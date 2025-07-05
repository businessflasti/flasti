"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTextWhenExpanded?: boolean;
}

const Logo = ({ className = "", size = "md", showTextWhenExpanded = true }: LogoProps) => {
  const { theme } = useTheme();
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
  const logoPath = typeof window !== "undefined" && window.location && window.location.pathname ?
    (window.location.pathname.includes("footer") ? "/logo/isoblanco.svg" : "/logo/isotipo.png") : "/logo/isotipo.png";

  return (
    <div className={`${className}`} tabIndex={-1} style={{ cursor: "default" }}>
      <div className="flex items-center gap-2">
        {/* Logo SVG */}
        <div className="relative flex items-center justify-center" style={{ height: logoHeight, width: logoWidth }}>
          <Image
            src={logoPath}
            alt="flasti logo"
            width={logoWidth}
            height={logoHeight}
            className="object-contain"
            priority
            unoptimized={true}
          />
        </div>

        {/* Texto del logo */}
        {showTextWhenExpanded && (
          <span
            className={`${textColor} ${textClass} transform -translate-y-px`}
            style={{
              fontFamily: "'Söhne', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 600,
              letterSpacing: '-0.01em'
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
