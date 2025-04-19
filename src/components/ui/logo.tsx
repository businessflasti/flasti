"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Tamaños basados en el prop size
  const sizes = {
    sm: {
      logoHeight: 28,
      logoWidth: 28,
      textClass: "text-xl"
    },
    md: {
      logoHeight: 36,
      logoWidth: 36,
      textClass: "text-2xl"
    },
    lg: {
      logoHeight: 48,
      logoWidth: 48,
      textClass: "text-3xl"
    }
  };

  // Obtener dimensiones según el tamaño
  const { logoHeight, logoWidth, textClass } = sizes[size];

  // Determinar el color basado en el tema y la ruta del logo
  const textColor = isDark ? "text-white" : "text-gray-900";
  const logoPath = isDark ? "/logo/logotipo.svg" : "/logo/logotipoblack.png";

  return (
    <Link href="/" className={`${className}`}>
      <div className="flex items-center gap-1.5">
        {/* Logo SVG */}
        <div className="relative flex items-center justify-center" style={{ height: logoHeight, width: logoWidth }}>
          <Image
            src={logoPath}
            alt="flasti logo"
            width={logoWidth * 1.2}
            height={logoHeight * 1.2}
            className="object-contain transform scale-110"
            priority
          />
        </div>

        {/* Texto del logo */}
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
      </div>
    </Link>
  );
};

export default Logo;
