import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProduct } from "@/lib/api/products";
import { formatPrice } from "@/lib/utils/formatPrice";
import { AddToCartButton } from "./_components/AddToCartButton";
import { ProductImages } from "./_components/ProductImages";
import { ProductReviews } from "./_components/ProductReviews";

// export const unstable_instant = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProduct(id);

    return {
      title: product.title,
      description: product.description,
      openGraph: {
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch {
    return {
      title: "Product not found",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  "use cache";
  cacheLife("hours");

  const { id } = await params;
  const product = await getProduct(id).catch(() => notFound());

  return (
    <div className="container-shell space-y-10 py-10">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          {
            href: `/products?category=${product.category}`,
            label: product.category,
          },
          { label: product.title },
        ]}
      />

      <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
        <ProductImages product={product} />

        <div className="space-y-6">
          <div className="space-y-4">
            <Badge>{product.category}</Badge>
            <h1 className="display-copy text-5xl leading-none text-foreground">
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{product.rating.toFixed(1)}★ rating</span>
              <span>•</span>
              <span>{product.stock} in stock</span>
              {product.brand ? (
                <>
                  <span>•</span>
                  <span>{product.brand}</span>
                </>
              ) : null}
            </div>
            <p className="text-3xl font-semibold text-foreground">
              {formatPrice(product.price * 1000)}
            </p>
            <p className="max-w-2xl text-sm leading-8 text-muted">
              {product.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-line bg-surface p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                Shipping
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">
                {product.shippingInformation ??
                  "Priority fulfillment within 48 hours."}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-line bg-surface p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                Policy
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">
                {product.returnPolicy ??
                  "14-day return window on unopened orders."}
              </p>
            </div>
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
            }}
          />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="section-eyebrow">Streaming reviews</p>
          <h2 className="display-copy text-4xl text-foreground">
            Opinions arrive after the shell
          </h2>
        </div>
        <Suspense
          fallback={
            <div className="grid gap-4">
              <Skeleton className="h-32 rounded-[1.75rem]" />
              <Skeleton className="h-32 rounded-[1.75rem]" />
            </div>
          }
        >
          <ProductReviews product={product} />
        </Suspense>
      </section>
    </div>
  );
}
