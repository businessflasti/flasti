import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "bg-[#1a1a1a] text-white border border-[#101010]",
  success: "bg-green-600 text-white",
  warning: "bg-yellow-600 text-white",
  danger: "bg-red-600 text-white",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "default" | "success" | "warning" | "danger"
  className?: string
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ color = "default", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 will-change-transform",
        "data-[pop=true]:scale-110 data-[pop=true]:shadow-lg",
        badgeVariants[color],
        className
      )}
      data-pop={props['data-pop'] || undefined}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }
