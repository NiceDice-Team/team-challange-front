import type { SearchHistoryItem } from "@/types/search";

const SEARCH_HISTORY_KEY = "search_history";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MAX_HISTORY_ITEMS = 5;

/**
 * Get search history from localStorage
 * Automatically removes items older than 1 week
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];

    const history: SearchHistoryItem[] = JSON.parse(stored);
    const now = Date.now();

    // Filter out items older than 1 week
    const validHistory = history.filter((item) => now - item.timestamp < ONE_WEEK_MS);

    // If we filtered some items, update localStorage
    if (validHistory.length !== history.length) {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(validHistory));
    }

    return validHistory;
  } catch (error) {
    console.error("Error reading search history:", error);
    return [];
  }
};

/**
 * Add a search query to history
 * Removes duplicates and keeps only the most recent entry
 */
export const addToSearchHistory = (query: string): void => {
  if (typeof window === "undefined" || !query.trim()) return;

  try {
    const history = getSearchHistory();
    const trimmedQuery = query.trim();

    // Remove any existing entry with the same query
    const filteredHistory = history.filter((item) => item.query.toLowerCase() !== trimmedQuery.toLowerCase());

    // Add new entry at the beginning
    const newHistory: SearchHistoryItem[] = [
      {
        query: trimmedQuery,
        timestamp: Date.now(),
      },
      ...filteredHistory,
    ].slice(0, MAX_HISTORY_ITEMS); // Keep only the most recent items

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
};

/**
 * Remove a specific item from search history
 */
export const removeFromSearchHistory = (query: string): void => {
  if (typeof window === "undefined") return;

  try {
    const history = getSearchHistory();
    const newHistory = history.filter((item) => item.query.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error removing from search history:", error);
  }
};