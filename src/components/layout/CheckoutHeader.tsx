"use client";

import Logo from "@/components/ui/logo";

const CheckoutHeader = () => {
  return (
    <header className="w-full py-3 border-b border-[#232323] bg-[#101010] backdrop-blur-md">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="text-white text-right">
          <div className="font-medium text-sm sm:text-base">
            Información de pago
          </div>
          <div className="text-xs text-white/70 mt-0.5 leading-tight">
            Todas las transacciones son<br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>seguras y encriptadas
          </div>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
