"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-full border border-line bg-surface px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
