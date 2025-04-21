"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
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
      logoHeight: 20,
      logoWidth: 20,
      textClass: "text-xl"
    },
    md: {
      logoHeight: 24,
      logoWidth: 24,
      textClass: "text-2xl"
    },
    lg: {
      logoHeight: 32,
      logoWidth: 32,
      textClass: "text-3xl"
    }
  };

  // Obtener dimensiones según el tamaño
  const { logoHeight, logoWidth, textClass } = sizes[size];

  // Determinar el color basado en el tema y la ruta del logo
  const textColor = isDark ? "text-white" : "text-gray-900";
  const logoPath = "/logo/isotipo.png";

  return (
    <Link href="/" className={`${className}`}>
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
    </Link>
  );
};

export default Logo;
