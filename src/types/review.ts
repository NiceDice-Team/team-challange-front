export interface ProductReviewApi {
  id: number;
  user_id?: number;
  rating: string;
  comment: string;
  created_at: string;
}

export interface ReviewListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductReviewApi[];
}

export interface CreateProductReviewPayload {
  rating: string;
  comment?: string;
}
