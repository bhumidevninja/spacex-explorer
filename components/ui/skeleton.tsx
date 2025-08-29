import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "rectangular",
  animation = "pulse",
  ...props
}: SkeletonProps) {
  const baseStyles = "bg-gray-200";

  const variants = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animations = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        animations[animation],
        className
      )}
      {...props}
    />
  );
}
