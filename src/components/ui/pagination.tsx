import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  hasNext?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, hasNext, onPageChange, className = "" }: PaginationProps) {
  // Simple mode: only Previous/Current/Next without total pages
  const isSimpleMode = totalPages === undefined;

  const getVisiblePages = () => {
    if (isSimpleMode) return [];

    const pages = [];

    if (totalPages <= 5) {
      // If total pages is 5 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and surrounding pages
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // Ensure we always show 5 at least
      if (endPage - startPage < 4) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + 4);
        } else {
          startPage = Math.max(1, endPage - 4);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const isNextDisabled = isSimpleMode ? !hasNext : currentPage === totalPages;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center border border-[color:var(--color-purple)] text-[color:var(--color-purple)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--color-purple)] hover:text-white transition-colors"
        style={{ fontSize: "16px" }}
      >
        &lt;
      </button>

      {/* Page numbers or current page indicator */}
      {isSimpleMode ? (
        <div className="w-10 h-10 flex items-center justify-center border bg-[color:var(--color-purple)] text-white border-[color:var(--color-purple)]">
          {currentPage}
        </div>
      ) : (
        visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center border transition-colors ${
              currentPage === page
                ? "bg-[color:var(--color-purple)] text-white border-[color:var(--color-purple)]"
                : "border-[color:var(--color-purple)] text-[color:var(--color-purple)] hover:bg-[color:var(--color-purple)] hover:text-white"
            }`}
            style={{ fontSize: "16px" }}
          >
            {page}
          </button>
        ))
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        className="w-10 h-10 flex items-center justify-center border border-[color:var(--color-purple)] text-[color:var(--color-purple)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--color-purple)] hover:text-white transition-colors"
        style={{ fontSize: "16px" }}
      >
        &gt;
      </button>
    </div>
  );
}
