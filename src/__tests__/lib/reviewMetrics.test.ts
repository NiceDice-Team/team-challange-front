import { roundRatingToNearestHalf } from "@/lib/reviewMetrics";

describe("roundRatingToNearestHalf", () => {
  test("rounds ratings to full or half stars", () => {
    expect(roundRatingToNearestHalf(4.24)).toBe(4);
    expect(roundRatingToNearestHalf(4.25)).toBe(4.5);
    expect(roundRatingToNearestHalf(4.74)).toBe(4.5);
    expect(roundRatingToNearestHalf(4.75)).toBe(5);
  });

  test("keeps ratings within the supported star range", () => {
    expect(roundRatingToNearestHalf(-1)).toBe(0);
    expect(roundRatingToNearestHalf(5.6)).toBe(5);
    expect(roundRatingToNearestHalf("not-a-rating")).toBe(0);
  });
});
