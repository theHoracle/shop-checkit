import { CartList } from "@/app/(shop)/cart/_components/CartList";
export default async function CartPage() {
  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <p className="section-eyebrow">Cart</p>
        <h1 className="display-copy text-5xl text-foreground">
          Review your cart
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          DummyJSON does not persist cart mutations, so this cart is stored
          locally in Zustand and rehydrated from the browser on return visits.
        </p>
      </div>
      <CartList />
    </div>
  );
}
