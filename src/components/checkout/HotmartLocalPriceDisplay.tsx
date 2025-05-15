"use client";

import { Globe } from "lucide-react";

interface HotmartLocalPriceDisplayProps {
  className?: string;
  showIcon?: boolean;
}

const HotmartLocalPriceDisplay = ({
  className = "",
  showIcon = true
}: HotmartLocalPriceDisplayProps) => {

  return (
    <div className={`hotmart-price-container relative ${className}`}>
      <div className="flex items-center">
        {showIcon && <Globe className="h-3.5 w-3.5 text-[#ec4899] mr-1 opacity-70" />}
        <span className="text-xs text-white/70">Precio local:</span>
      </div>
    </div>
  );
};

export default HotmartLocalPriceDisplay;
