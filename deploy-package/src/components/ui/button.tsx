import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  primary: "bg-[#101010] text-white hover:bg-[#232323] border border-[#232323]",
  secondary: "bg-[#232323] text-white hover:bg-[#101010] border border-[#101010]",
  ghost: "bg-transparent text-white hover:bg-[#232323] border border-[#232323]",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#101010] focus:ring-offset-2 will-change-transform select-none",
        "hover:scale-[1.03] md:hover:scale-[1.06] hover:shadow-lg md:hover:shadow-xl",
        buttonVariants[variant],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button }
