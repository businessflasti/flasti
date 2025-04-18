"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatButtonProps extends ButtonProps {
  text?: string;
  showIcon?: boolean;
}

export default function ChatButton({
  text,
  showIcon = true,
  className = "",
  ...props
}: ChatButtonProps) {
  const { t } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenChat = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      if (typeof window.Tawk_API.showWidget === 'function') {
        window.Tawk_API.showWidget();
      }

      setTimeout(() => {
        if (typeof window.Tawk_API.maximize === 'function') {
          window.Tawk_API.maximize();
        } else if (typeof window.Tawk_API.popup === 'function') {
          window.Tawk_API.popup();
        }
      }, 300);
    }
  };

  // Solo renderizar en el cliente para evitar errores de hidratación
  if (!isClient) return null;

  return (
    <Button
      onClick={handleOpenChat}
      className={`${className}`}
      {...props}
    >
      {showIcon && <MessageCircle size={16} className="mr-2" />}
      {text || t('iniciarChat')}
    </Button>
  );
}
