"use client";

import { useState } from "react";
import { ProductThumb } from "@/components/ProductThumb";
import type { Product } from "@/types/product";

export function ProductImages({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [product.thumbnail];
  const [activeImage, setActiveImage] = useState(
    images[0] ?? product.thumbnail,
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface p-4">
        <ProductThumb
          alt={product.title}
          src={activeImage}
          priority
          className="aspect-square rounded-[1.5rem]"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.slice(0, 4).map((image) => (
          <button
            key={image}
            className={`overflow-hidden rounded-[1.25rem] border p-1 ${
              image === activeImage ? "border-accent" : "border-line"
            }`}
            onClick={() => setActiveImage(image)}
            type="button"
          >
            <ProductThumb
              alt={product.title}
              src={image}
              className="aspect-square rounded-[1rem]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
