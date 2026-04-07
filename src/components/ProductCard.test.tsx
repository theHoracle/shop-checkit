import { render, screen } from "@testing-library/react";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    onError,
    priority: _priority,
    src,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    // biome-ignore lint/performance/noImgElement: test stub for next/image
    <img alt={alt} src={src} onError={onError} {...props} />
  ),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    ViewTransition: ({ children }: { children: React.ReactNode }) => children,
  };
});

const product: Product = {
  id: 8,
  title: "Amber Weekender",
  description: "A warm-toned carryall for short-haul trips.",
  category: "bags",
  price: 129,
  rating: 4.6,
  stock: 14,
  thumbnail: "https://dummyjson.com/image.jpg",
  images: ["https://dummyjson.com/image.jpg"],
};

describe("ProductCard", () => {
  it("renders product content and pricing", () => {
    render(<ProductCard product={product} priority />);

    expect(screen.getByText("Amber Weekender")).toBeInTheDocument();
    expect(screen.getByText("bags")).toBeInTheDocument();
    expect(screen.getByText("4.6★")).toBeInTheDocument();
    expect(screen.getByText("₦129,000")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/products/8");
    expect(screen.getByAltText("Amber Weekender")).toHaveAttribute(
      "src",
      "https://dummyjson.com/image.jpg",
    );
  }, 10_000);

  it("shows the waitlist state when stock is depleted", () => {
    render(<ProductCard product={{ ...product, id: 9, stock: 0 }} />);

    expect(screen.getByText("Waitlist")).toBeInTheDocument();
  });
});
