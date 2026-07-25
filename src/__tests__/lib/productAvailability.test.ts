import { parseStockQuantity } from "@/lib/cartStock";
import {
  getProductAvailability,
  getProductAvailabilityMessage,
  isComingSoonStock,
} from "@/lib/productAvailability";

describe("product availability", () => {
  test("treats stock -1 as coming soon and not purchasable", () => {
    const availability = getProductAvailability("-1");

    expect(isComingSoonStock(-1)).toBe(true);
    expect(availability).toEqual({
      status: "coming-soon",
      stockQuantity: 0,
      isPurchasable: false,
    });
    expect(getProductAvailabilityMessage(availability)).toBe("Coming soon");
    expect(parseStockQuantity(-1)).toBe(0);
  });

  test.each([
    [0, "sold-out", false],
    [1, "very-low", true],
    [5, "very-low", true],
    [6, "low", true],
    [10, "low", true],
    [11, "in-stock", true],
  ])(
    "maps stock %s to %s",
    (stock, expectedStatus, expectedIsPurchasable) => {
      expect(getProductAvailability(stock)).toMatchObject({
        status: expectedStatus,
        isPurchasable: expectedIsPurchasable,
      });
    },
  );

  test("uses safe sold-out behavior for invalid stock", () => {
    expect(getProductAvailability(undefined)).toEqual({
      status: "sold-out",
      stockQuantity: 0,
      isPurchasable: false,
    });
  });

  test("keeps range and exact stock messages explicit", () => {
    const lowStock = getProductAvailability(6);
    const inStock = getProductAvailability(11);

    expect(getProductAvailabilityMessage(lowStock, "range")).toBe(
      "Low stock (6-10 units)",
    );
    expect(getProductAvailabilityMessage(lowStock, "exact")).toBe(
      "Low stock (6 units)",
    );
    expect(getProductAvailabilityMessage(inStock, "range")).toBe(
      "In stock (11+ units)",
    );
  });
});
