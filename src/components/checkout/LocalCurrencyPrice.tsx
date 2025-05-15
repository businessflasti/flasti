"use client";

import { Globe } from "lucide-react";

interface LocalCurrencyPriceProps {
  className?: string;
  showIcon?: boolean;
}

const LocalCurrencyPrice = ({
  className = "",
  showIcon = true
}: LocalCurrencyPriceProps) => {
  return (
    <div className={`local-currency-price relative ${className}`}>
      <div className="flex items-center">
        {showIcon && <Globe className="h-3.5 w-3.5 text-[#ec4899] mr-1 opacity-70" />}
        <span className="text-xs text-white/70">Precio local:</span>
      </div>
    </div>
  );
};

export default LocalCurrencyPrice;
