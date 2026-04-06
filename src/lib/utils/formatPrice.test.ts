import { formatPrice } from "./formatPrice";

describe("formatPrice", () => {
  it("formats values in NGN by default", () => {
    expect(formatPrice(129000)).toBe("₦129,000");
  });
});
