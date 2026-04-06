import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  heading,
  message,
  ctaHref,
  ctaLabel,
}: {
  heading: string;
  message: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="surface-ring rounded-[2rem] p-8 text-left">
      <p className="section-eyebrow">Empty state</p>
      <h2 className="display-copy mt-4 text-3xl text-foreground">{heading}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{message}</p>
      <Link href={ctaHref} className="mt-6 inline-flex">
        <Button>{ctaLabel}</Button>
      </Link>
    </div>
  );
}
