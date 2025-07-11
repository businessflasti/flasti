import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Toast } from "@/components/ui/toast";

type ToastType = "success" | "error" | "info";

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");

  const showToast = useCallback((msg: string, t: ToastType = "info") => {
    setMessage(msg);
    setType(t);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast open={open} message={message} type={type} onClose={() => setOpen(false)} />
    </ToastContext.Provider>
  );
};
