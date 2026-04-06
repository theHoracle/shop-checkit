import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ProductNotFound() {
  return (
    <div className="container-shell py-14">
      <div className="surface-ring rounded-[2rem] p-8">
        <p className="section-eyebrow">Not found</p>
        <h2 className="display-copy mt-4 text-4xl text-foreground">
          That product doesn't exist in this catalog.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          The product id may be invalid or no longer available from DummyJSON.
        </p>
        <Link href="/products" className="mt-6 inline-flex">
          <Button>Back to products</Button>
        </Link>
      </div>
    </div>
  );
}
