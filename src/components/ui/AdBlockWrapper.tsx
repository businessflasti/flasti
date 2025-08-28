import React, { useEffect, useRef, useState } from "react";
import AdBlock from "./AdBlock";

interface AdBlockWrapperProps {
  adClient: string;
  adSlot: string;
  backgroundColor?: string;
  padding?: string;
}

const AdBlockWrapper: React.FC<AdBlockWrapperProps> = ({ 
  adClient, 
  adSlot, 
  backgroundColor = "bg-[#101010]",
  padding = "py-2"
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const adBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAdVisibility = () => {
      if (adBlockRef.current) {
        const adBlock = adBlockRef.current.querySelector('.adsbygoogle');
        if (adBlock) {
          const isUnfilled = (adBlock as HTMLElement).dataset.adStatus === 'unfilled';
          const isEmpty = adBlock.innerHTML.trim() === '' && (adBlock as HTMLElement).clientHeight === 0;
          if (isUnfilled || isEmpty) {
            setIsVisible(false);
          }
        }
      }
    };

    const timeout = setTimeout(checkAdVisibility, 15000);
    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={backgroundColor}>
      <div className={`container-custom ${padding}`} ref={adBlockRef}>
        <AdBlock
          adClient={adClient}
          adSlot={adSlot}
          className="flex justify-center"
        />
      </div>
    </div>
  );
};

export default AdBlockWrapper;