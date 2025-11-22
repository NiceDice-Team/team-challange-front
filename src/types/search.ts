/**
 * Search related types
 */

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface SearchSuggestion {
  id: number;
  name: string;
}

export interface SearchBarProps {
  className?: string;
}
