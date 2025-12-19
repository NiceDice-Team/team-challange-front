/**
 * Catalog and filtering types
 */

// Category types
export interface Category {
  id: number;
  name: string;
  count?: number;
  description?: string;
  parent_category?: number;
}

// Filter item types
export interface FilterItem {
  id?: number;
  name: string;
  count?: number;
}

export interface Audience extends FilterItem {}

export interface GameType extends FilterItem {}

export interface Brand extends FilterItem {}

// Price range type
export interface PriceRange {
  min: number;
  max: number;
}

// Selected filters state
export interface SelectedFilters {
  categories: number[];
  gameTypes: string[];
  audiences: string[];
  brands: string[];
  priceRange: PriceRange;
  sortBy: string;
  search: string;
}

// Sort options
export type SortOption = 'relevance' | 'bestsellers' | 'price-high-low' | 'price-low-high' | 'newest';
