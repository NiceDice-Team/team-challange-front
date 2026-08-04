import { getDiscountedPrice } from "@/lib/productPricing";

describe("getDiscountedPrice", () => {
  test("returns a discounted price when it is lower after currency rounding", () => {
    expect(getDiscountedPrice("15.99", "10.99")).toBe("14.23");
  });

  test("ignores a discount that rounds to the original price", () => {
    expect(getDiscountedPrice("24.00", "0.01")).toBeNull();
  });

  test.each([
    ["24.00", "0"],
    ["24.00", "101"],
    ["invalid", "20"],
  ])("ignores invalid price or discount values", (price, discount) => {
    expect(getDiscountedPrice(price, discount)).toBeNull();
  });
});
