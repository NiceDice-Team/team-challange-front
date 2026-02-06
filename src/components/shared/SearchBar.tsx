"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, CloseIcon, LoadingSpinner } from "@/svgs/icons";
import { productServices } from "@/services/productServices";
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory } from "@/utils/searchHistory";
import { useDebounce } from "@/utils/useDebounce";
import type { SearchHistoryItem } from "@/types/search";

// Component types
interface SearchBarProps {
  className?: string;
}

interface SearchSuggestion {
  id: number;
  name: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history on mount
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions function
  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await productServices.getProductsWithFilters(1, 5, "relevance", {
        categories: [],
        gameTypes: [],
        audiences: [],
        brands: [],
        priceRange: { min: 0, max: 200 },
        sortBy: "relevance",
        search: query.trim(),
      });

      const suggestionsList: SearchSuggestion[] = response.results.map((product: any) => ({
        id: product.id,
        name: product.name,
      }));

      setSuggestions(suggestionsList);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useDebounce(fetchSuggestions, 300);

  // Trigger debounced fetch when query changes
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Set loading IMMEDIATELY, before debounce
    setIsLoading(true);
    debouncedFetchSuggestions();
  }, [query, debouncedFetchSuggestions]);

  // Handle search submission
  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      addToSearchHistory(trimmedQuery);
      setHistory(getSearchHistory());
      setIsOpen(false);
      setQuery("");

      router.push(`/catalog?search=${encodeURIComponent(trimmedQuery)}`);
    },
    [router]
  );

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If an item is selected with keyboard, use that
    if (selectedIndex >= 0) {
      const allItems = [...history.map((h) => h.query), ...suggestions.map((s) => s.name)];
      if (allItems[selectedIndex]) {
        handleSearch(allItems[selectedIndex]);
        return;
      }
    }

    // Otherwise use the input value
    handleSearch(query);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [...history.map((h) => h.query), ...suggestions.map((s) => s.name)];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    setHistory(getSearchHistory());
  };

  // Handle removing history item
  const handleRemoveHistory = (e: React.MouseEvent, historyQuery: string) => {
    e.stopPropagation();
    removeFromSearchHistory(historyQuery);
    setHistory(getSearchHistory());
  };

  // Check if we should show dropdown
  const showDropdown = isOpen && (query.trim().length >= 2 || history.length > 0);
  const showHistory = history.length > 0 && query.trim().length < 2;
  const showSuggestions = suggestions.length > 0 && query.trim().length >= 2;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form
        className="flex flex-row flex-1 justify-between items-center p-1 border border-[#494791]"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type="text"
          name="search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="ml-1 outline-[#494791] outline-0 w-full text-sm md:text-base"
          placeholder="Search games..."
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="p-1 text-[#494791] hover:text-[#3a3a7a] transition-colors"
            aria-label="Clear search"
          >
            <CloseIcon className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
        <button className="bg-[#494791] hover:bg-[#4a479170] p-1 rounded-[2px]" type="submit">
          <img src={SearchIcon} alt="Search" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </form>

      {/* Dropdown with suggestions and history */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#494791] shadow-lg max-h-[400px] overflow-y-auto z-50">
          {/* Search History */}
          {showHistory && (
            <div className="border-b border-gray-200">
              <div className="px-3 py-2 text-xs uppercase text-gray-500 font-medium">Recent Searches</div>
              {history.map((item, index) => (
                <div
                  key={`history-${item.query}-${item.timestamp}`}
                  className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center group ${
                    selectedIndex === index ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSearch(item.query)}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{item.query}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveHistory(e, item.query)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    aria-label="Remove from history"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading state */}
          {isLoading && query.trim().length >= 2 && (
            <div className="px-3 py-4 text-center text-gray-500 text-sm">
              <LoadingSpinner className="inline-block h-8 w-8 text-[#494791]" />
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && !isLoading && (
            <div>
              <div className="px-3 py-2 text-xs uppercase text-gray-500 font-medium">Suggestions</div>
              {suggestions.map((suggestion, index) => {
                const adjustedIndex = showHistory ? history.length + index : index;
                return (
                  <div
                    key={`suggestion-${suggestion.id}`}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedIndex === adjustedIndex ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleSearch(suggestion.name)}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-sm">{suggestion.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results */}
          {!isLoading && query.trim().length >= 2 && suggestions.length === 0 && (
            <div className="px-3 py-4 text-center text-gray-500 text-sm">No products found</div>
          )}
        </div>
      )}
    </div>
  );
}
