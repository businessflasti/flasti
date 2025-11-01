import React from "react";

interface NotificationProps {
  title: string;
  message: string;
  type?: "success" | "warning" | "danger" | "info";
  className?: string;
}

const typeMap = {
  success: "bg-green-600 text-white",
  warning: "bg-yellow-600 text-white",
  danger: "bg-red-600 text-white",
  info: "bg-[#1a1a1a] text-white border border-[#101010]",
};

export const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  type = "info",
  className = "",
}) => (
  <div className={`rounded-lg p-4 mb-2 ${typeMap[type]} ${className}`.trim()}>
    <div className="font-bold mb-1">{title}</div>
    <div className="text-sm">{message}</div>
  </div>
);
