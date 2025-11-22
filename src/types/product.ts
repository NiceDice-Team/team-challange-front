/**
 * Product-related types
 */

// Product image types
export interface ProductImage {
  id: number;
  url_sm: string;
  url_lg?: string;
  url_md?: string;
  alt?: string;
}

// Product review types
export interface ProductReview {
  id: number;
  rating: number;
  comment?: string;
  author?: string;
  created_at?: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  discount?: string | number;
  brand?: string;
  stock: string | number;
  stars?: number;
  images?: ProductImage[];
  reviews?: ProductReview[];
  categories?: number[];
  audiences?: string[];
  types?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow additional properties
}

// Stock status types
export interface StockStatus {
  message: string;
  color: string;
  status: 'sold-out' | 'very-low' | 'low' | 'in-stock';
}

// Component props
export interface ProductCardProps {
  product?: Product;
}

export interface ProductPageProps {
  params: {
    id: string;
  };
}

export interface ProductAccordionProps {
  accordionParams?: {
    description?: string;
    brand?: string;
    [key: string]: any;
  };
}

// API response types
export interface ProductListResponse {
  results: Product[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface ProductCountResponse {
  count: number;
}
