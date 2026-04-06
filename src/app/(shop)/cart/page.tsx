import { redirect } from "next/navigation";
import { CartList } from "@/app/(shop)/cart/_components/CartList";
import { getUserCart } from "@/lib/api/cart";
import { getSessionUser } from "@/lib/fetch/tokenStore";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default async function CartPage() {
 
  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <p className="section-eyebrow">Cart</p>
        <h1 className="display-copy text-5xl text-foreground">
          Review your edit
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          This page uses server reads plus optimistic client state so your cart
          feels immediate without dropping out of the server action model.
        </p>
      </div>
 
    <Suspense fallback={<Skeleton className="h-40 w-full bg-muted" />}>
      <CartPageSuspense />
    </Suspense>
    </div>
  );
}



const CartPageSuspense = async () => {
   const user = await getSessionUser();
  if (!user) {
    redirect("/login?redirect=/cart");
  }

  const cart = await getUserCart(user.id);

  return <CartList initialCart={cart} />
};

