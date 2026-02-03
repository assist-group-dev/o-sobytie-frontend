"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const showPagination = totalPages > 1 || onItemsPerPageChange;

  if (!showPagination) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--foreground)]/60">
            Показано {startItem}-{endItem} из {totalItems}
          </div>
          {onItemsPerPageChange && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-[var(--foreground)]/60">
                Строк на странице:
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    "px-3 py-1.5 text-sm border-2 transition-all duration-200",
                    "bg-[var(--background)] text-[var(--foreground)]",
                    "flex items-center gap-2 min-w-[80px] justify-between",
                    isDropdownOpen
                      ? "border-[var(--color-golden)]"
                      : "border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 hover:border-[var(--color-golden)]/50"
                  )}
                >
                  <span>{itemsPerPage}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[80px] border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 bg-[var(--background)] shadow-lg">
                    {itemsPerPageOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          onItemsPerPageChange(option);
                          onPageChange(1);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-sm text-left transition-colors",
                          "hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20",
                          itemsPerPage === option &&
                            "bg-[var(--color-golden)]/10 text-[var(--color-golden)] font-medium"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2"
              aria-label="Предыдущая страница"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-1 text-sm text-[var(--foreground)]/40"
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber = page as number;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium transition-colors rounded",
                      currentPage === pageNumber
                        ? "bg-[var(--color-golden)] text-[var(--background)]"
                        : "text-[var(--foreground)] hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20"
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2"
              aria-label="Следующая страница"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

