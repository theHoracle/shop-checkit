"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ProductThumb({
  alt,
  className,
  priority = false,
  src,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex h-full min-h-56 w-full items-center justify-center rounded-[1.75rem] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-strong)_90%,white_10%),color-mix(in_srgb,var(--accent)_8%,transparent))] text-5xl font-semibold text-accent-strong",
          className,
        )}
      >
        {alt.slice(0, 1)}
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      src={src}
      width={640}
      height={640}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      onError={() => setFailed(true)}
    />
  );
}
