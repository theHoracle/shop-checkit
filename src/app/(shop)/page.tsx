import { cacheLife } from "next/cache";
import Link from "next/link";
import { HeroStat } from "@/components/HeroStat";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/Button";
import { getCategories, getFeaturedProducts } from "@/lib/api/products";

export const unstable_instant = true;

export default async function HomePage() {
  "use cache";
  cacheLife("hours");

  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="container-shell space-y-16 py-10">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-ring overflow-hidden rounded-[2.5rem] p-8 lg:p-12">
          <p className="section-eyebrow">Storefront</p>
          <h1 className="display-copy mt-5 max-w-3xl text-5xl leading-none text-foreground md:text-7xl">
            Built to feel like a real shelf, not a frontend assessment.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            Browse a richly styled DummyJSON catalog with cache-aware pages,
            server mutations, streamed detail content, and instant-feeling
            navigation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products">
              <Button>Shop the catalog</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Use sample login</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <HeroStat
            label="Curation"
            value={`${categories.length}+ departments`}
          />
          <HeroStat
            label="Performance"
            value="Cache first, stream what matters"
          />
          <HeroStat
            label="Interaction"
            value="Server actions with optimistic cart UX"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-eyebrow">Featured</p>
            <h2 className="display-copy text-4xl text-foreground">
              Highlights from the current edit
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted">
            A curated first pass across beauty, home, and tech to anchor the
            storefront with a clear visual rhythm.
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
