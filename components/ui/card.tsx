import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  glowColor?: "purple" | "blue" | "cyan" | "none";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", glowColor = "none", ...props }, ref) => {
    const variants = {
      default: "glass-card",
      bordered: "glass-card border border-white/20",
      elevated: "glass-card shadow-2xl",
    };

    const glowColors = {
      purple: "glow-purple",
      blue: "glow-blue",
      cyan: "glow-cyan",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={clsx(
          variants[variant],
          glowColors[glowColor],
          "rounded-xl",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
