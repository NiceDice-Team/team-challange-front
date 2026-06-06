export interface ReviewAuthorApi {
  display_name?: string | null;
  displayName?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  name?: string | null;
  username?: string | null;
  user_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  firstname?: string | null;
  lastname?: string | null;
}

export interface ProductReviewApi extends ReviewAuthorApi {
  id: number;
  user_id?: number;
  author?: string | ReviewAuthorApi | null;
  user?: string | number | ReviewAuthorApi | null;
  customer?: string | number | ReviewAuthorApi | null;
  reviewer?: string | number | ReviewAuthorApi | null;
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
