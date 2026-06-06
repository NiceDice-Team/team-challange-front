import {
  getReviewAuthorName,
  REVIEW_AUTHOR_FALLBACK,
} from "@/lib/reviewAuthor";
import type { ProductReviewApi } from "@/types/review";

const baseReview: ProductReviewApi = {
  id: 1,
  rating: "5.00",
  comment: "Great game",
  created_at: "2026-06-01T12:00:00Z",
};

describe("getReviewAuthorName", () => {
  test("uses an explicit display name when the API provides one", () => {
    expect(
      getReviewAuthorName({
        ...baseReview,
        display_name: "  Jane   Doe  ",
        user_id: 12345,
      }),
    ).toBe("Jane Doe");
  });

  test("uses nested user first and last name", () => {
    expect(
      getReviewAuthorName({
        ...baseReview,
        user: {
          first_name: "Jane",
          last_name: "Doe",
        },
      }),
    ).toBe("Jane Doe");
  });

  test("does not expose internal customer identifiers", () => {
    expect(
      getReviewAuthorName({
        ...baseReview,
        user_id: 12345,
      }),
    ).toBe(REVIEW_AUTHOR_FALLBACK);

    expect(
      getReviewAuthorName({
        ...baseReview,
        author: "Customer #12345",
      }),
    ).toBe(REVIEW_AUTHOR_FALLBACK);
  });
});
