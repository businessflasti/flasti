"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Tamaños basados en el prop size
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  // Determinar el color basado en el tema
  const textColor = isDark ? "text-white" : "text-gray-900";

  return (
    <Link href="/" className={`${className}`}>
      <div className="flex items-center">
        {/* Logo de texto usando fuente similar a OpenAI */}
        <span
          className={`${textColor} text-xl sm:text-2xl md:text-3xl`}
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
