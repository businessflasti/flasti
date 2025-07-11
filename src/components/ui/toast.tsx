import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ToastProps {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const typeMap = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-[#232323] text-white border border-[#101010]",
};

export const Toast: React.FC<ToastProps> = ({ open, message, type = "info", onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25 }}
        className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg ${typeMap[type]}`}
        role="alert"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);
