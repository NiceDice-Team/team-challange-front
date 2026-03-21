export const normalizeReviewRating = (value: string | number | undefined): number => {
  const parsed = Number(value ?? 0);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(5, parsed));
};

export const calculateAverageRating = (
  reviews: Array<{ rating: string | number | undefined }> = []
): number => {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + normalizeReviewRating(review.rating), 0);
  return total / reviews.length;
};
