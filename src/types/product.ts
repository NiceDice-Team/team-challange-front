/**
 * Product-related types
 */

// Product image types
export interface ProductImage {
  id: number;
  url_sm: string;
  url_lg?: string;
  url_md?: string;
  url_original?: string;
  alt?: string;
  sort?: number;
}

// Product review types
export interface ProductReview {
  id: number;
  rating: string | number;
  comment?: string;
  author?: string;
  created_at?: string;
}

export type ProductReviewReference = number | ProductReview;

export type ProductGameInfoValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ProductGameInfoValue[]
  | { [key: string]: ProductGameInfoValue };

export interface ProductGameInformation {
  [key: string]: ProductGameInfoValue;
  publisher?: ProductGameInfoValue;
  players?: ProductGameInfoValue;
  age?: ProductGameInfoValue;
  time?: ProductGameInfoValue;
  includes?: ProductGameInfoValue;
  gameFeatures?: ProductGameInfoValue;
}

export type ProductDeliveryAndPayment = string | string[] | null;

// Product types
export interface Product {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  gameInformation?: ProductGameInformation;
  deliveryAndPayment?: ProductDeliveryAndPayment;
  price: string | number;
  discount?: string | number;
  brand?: string | number;
  stock: string | number;
  stars?: string | number;
  images?: ProductImage[];
  reviews?: ProductReviewReference[];
  categories?: number[];
  audiences?: Array<string | number>;
  types?: Array<string | number>;
  created_at?: string;
  updated_at?: string;
}

export interface ProductApiResponse extends Omit<Product, "shortDescription" | "gameInformation" | "deliveryAndPayment"> {
  short_description?: string;
  shortDescription?: string;
  game_information?: ProductGameInformation;
  gameInformation?: ProductGameInformation;
  delivery_and_payments?: ProductDeliveryAndPayment;
  deliveryAndPayment?: ProductDeliveryAndPayment;
}

// API response types
export interface ProductListResponse {
  results: Product[];
  total_count?: number;
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface ProductListApiResponse extends Omit<ProductListResponse, "results"> {
  results: ProductApiResponse[];
}

export interface ProductCountResponse {
  count: number;
}
