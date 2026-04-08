import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/types/product";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function ProductReviews({ product }: { product: Product }) {
  await sleep(900);

  if (!product.reviews?.length) {
    return (
      <div className="rounded-4xl border border-dashed border-line p-6 text-sm leading-7 text-muted">
        This DummyJSON product doesn't include review copy, so the streamed
        panel lands with a graceful empty state instead.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {product.reviews.map((review) => (
        <article
          key={`${review.reviewerEmail}-${review.date}`}
          className="rounded-3xl border border-line bg-surface p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground">
                {review.reviewerName}
              </h3>
              <p className="text-sm text-muted">{review.reviewerEmail}</p>
            </div>
            <Badge>{review.rating} stars</Badge>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">{review.comment}</p>
        </article>
      ))}
    </div>
  );
}
