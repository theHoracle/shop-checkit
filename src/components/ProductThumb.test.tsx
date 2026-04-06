import { fireEvent, render, screen } from "@testing-library/react";
import { ProductThumb } from "./ProductThumb";

vi.mock("next/image", () => ({
  default: ({
    alt,
    onError,
    src,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/performance/noImgElement: test stub for next/image
    <img alt={alt} src={src} onError={onError} {...props} />
  ),
}));

describe("ProductThumb", () => {
  it("renders a fallback initial when no src is available", () => {
    render(<ProductThumb alt="Nomad Lamp" />);
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("falls back to an initial when the image errors", () => {
    render(
      <ProductThumb alt="Nomad Lamp" src="https://dummyjson.com/lamp.jpg" />,
    );
    fireEvent.error(screen.getByAltText("Nomad Lamp"));
    expect(screen.getByText("N")).toBeInTheDocument();
  });
});
