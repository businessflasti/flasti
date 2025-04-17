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
      logo: 24,
      text: "text-xl",
    },
    md: {
      logo: 28,
      text: "text-2xl",
    },
    lg: {
      logo: 32,
      text: "text-3xl",
    },
  };

  // Determinar el color basado en el tema
  const textColor = isDark ? "text-white" : "text-gray-900";

  return (
    <Link href="/" className={`${className}`}>
      <div className="flex items-center gap-2">
        {/* Logo SVG */}
        <div className="relative">
          <img
            src="/favicon.svg"
            alt="Flasti Logo"
            width={sizes[size].logo}
            height={sizes[size].logo}
            className="object-contain"
          />
        </div>

        {/* Logo de texto con gradiente */}
        <span
          className={`${sizes[size].text} font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9333ea] to-[#ec4899]`}
          style={{
            fontFamily: "'Söhne', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 600,
            letterSpacing: '-0.01em'
          }}
        >
          Flasti
        </span>
      </div>
    </Link>
  );
};

export default Logo;
