"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

const variants = {
  primary:
    "bg-accent text-white shadow-[0_20px_40px_color-mix(in_srgb,var(--accent)_30%,transparent)] hover:bg-accent-strong",
  secondary:
    "surface-ring text-foreground hover:border-accent/40 hover:text-accent-strong",
  ghost: "text-foreground hover:bg-black/4",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "md", variant = "primary", type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-[0.01em] disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
