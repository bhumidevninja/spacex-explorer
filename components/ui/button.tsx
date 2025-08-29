import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const variants = {
      primary:
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl",
      secondary:
        "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white",
      outline: "border border-white/20 bg-white/5 hover:bg-white/10 text-white",
      ghost: "text-gray-300 hover:text-white hover:bg-white/10",
      danger:
        "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
