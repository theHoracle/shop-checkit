"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { ProductThumb } from "@/components/ProductThumb";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col gap-4 rounded-[2rem] border border-line/80 bg-surface p-4 shadow-[0_18px_48px_color-mix(in_srgb,var(--foreground)_7%,transparent)]">
      <Link href={`/products/${product.id}`} className="flex flex-col gap-4">
        <ViewTransition name={`product-${product.id}-${product.title}-image`}>
          <div className="overflow-hidden rounded-[1.75rem] bg-surface-strong">
            <ProductThumb
              alt={product.title}
              src={product.thumbnail}
              priority={priority}
              className="aspect-[4/4.4] transition duration-500 group-hover:scale-[1.04]"
            />
          </div>
        </ViewTransition>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge>{product.category}</Badge>
            <h3 className="display-copy text-xl leading-tight text-foreground">
              {product.title}
            </h3>
          </div>
          <div className="rounded-full border border-line px-3 py-1 text-sm font-semibold text-muted">
            {product.rating.toFixed(1)}★
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted">
          {product.description}
        </p>
      </Link>
      <div className="mt-auto flex items-center justify-between">
        <p className="text-lg font-semibold text-foreground">
          {formatPrice(product.price * 1000)}
        </p>
        <span className="text-xs uppercase tracking-[0.18em] text-muted">
          {product.stock > 0 ? "Ready to ship" : "Waitlist"}
        </span>
      </div>
    </article>
  );
}
