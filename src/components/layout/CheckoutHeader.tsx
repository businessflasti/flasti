"use client";

import Logo from "@/components/ui/logo";

const CheckoutHeader = () => {
  return (
    <header className="w-full py-3 border-b border-[#232323] bg-[#101010] backdrop-blur-md">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="text-white font-medium text-sm sm:text-base">
          Medios de pago
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
