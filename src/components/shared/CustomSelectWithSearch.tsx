"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Search, ChevronDown, Check, X } from "lucide-react";

type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectWithSearchProps = {
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options?: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  error?: string[];
  clearable?: boolean;
  noOptionsText?: string;
  loading?: boolean;
  loadingText?: string;
};

export const CustomSelectWithSearch: React.FC<CustomSelectWithSearchProps> = ({
  className,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  options = [],
  value,
  onValueChange,
  disabled = false,
  error,
  clearable = false,
  noOptionsText = "No options available",
  loading = false,
  loadingText = "Loading...",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [focused, setFocused] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Фильтрация опций по поисковому запросу
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Получение выбранной опции
  const selectedOption = options.find((option) => option.value === value);

  // Обработка выбора опции
  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    setFocused(false);
  };

  // Обработка очистки
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  // Обработка открытия/закрытия
  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  };

  // Обработка клавиатуры
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        setFocused(false);
        break;
      case "Tab":
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        setFocused(false);
        break;
    }
  };

  // Прокрутка к выделенному элементу
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  // Сброс выделения при изменении поискового запроса
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Закрытие при клике вне компонента
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Триггер */}
      <div
        className={cn(
          "flex justify-between items-center px-3 py-2 border border-[var(--color-light-purple-2)] rounded-none w-full h-10 text-[var(--color-purple)] text-base transition-colors cursor-pointer",
          "hover:border-[var(--color-purple)] focus-within:border-[var(--color-purple)] focus-within:outline-none",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          loading && "opacity-50 cursor-wait",
          focused && "border-[var(--color-purple)]",
          className
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled || loading ? -1 : 0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div className="flex-1 min-w-0">
          {selectedOption ? (
            <span className="font-normal text-base truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="font-normal text-gray-500 text-base">
              {loading ? loadingText : placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          {clearable && selectedOption && !disabled && !loading && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="z-50 absolute bg-white shadow-lg mt-1 border border-[var(--color-light-purple-2)] rounded-none w-full max-h-[300px]">
          {/* Поле поиска */}
          <div className="p-2 border-gray-200 border-b">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
              <Input
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[var(--color-purple)] rounded-none h-8 text-sm"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Список опций */}
          <div ref={listRef} className="max-h-[200px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-9 text-gray-500 text-sm">
                {loadingText}
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex justify-between items-center px-3 py-2 h-9 transition-colors cursor-pointer",
                    "hover:bg-[var(--color-light-purple-3)] focus:bg-[var(--color-light-purple-3)]",
                    highlightedIndex === index &&
                      "bg-[var(--color-light-purple-3)]",
                    value === option.value && "bg-[var(--color-light-purple-3)]"
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="text-black text-base truncate">
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="flex-shrink-0 w-4 h-4 text-[var(--color-purple)]" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-9 text-gray-500 text-sm">
                {searchQuery ? "Ничего не найдено" : noOptionsText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Сообщение об ошибке */}
      {error && error.length > 0 && (
        <p className="mt-1 text-red-500 text-sm">{error[0]}</p>
      )}
    </div>
  );
};
