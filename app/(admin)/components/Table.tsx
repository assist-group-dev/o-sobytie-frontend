"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  mobilePriority?: number;
  mobileLabel?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onRowClick?: (item: T) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string, direction: "asc" | "desc") => void;
}

export function Table<T>({
  columns,
  data,
  className,
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
}: TableProps<T>) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      let clickedInside = false;
      
      Object.keys(dropdownRefs.current).forEach((key) => {
        if (dropdownRefs.current[key] && dropdownRefs.current[key]?.contains(target)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleSortClick = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openDropdown === key) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(key);
    }
  };

  const handleSortSelect = (key: string, direction: "asc" | "desc", e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSort) {
      onSort(key, direction);
    }
    setOpenDropdown(null);
  };

  const sortedColumns = [...columns].sort((a, b) => {
    const priorityA = a.mobilePriority ?? 999;
    const priorityB = b.mobilePriority ?? 999;
    return priorityA - priorityB;
  });

  const actionsColumn = sortedColumns.find((col) => col.key === "actions");
  const dataColumns = sortedColumns.filter((col) => col.key !== "actions");

  return (
    <>
      <div className={cn("hidden lg:block overflow-x-auto", className)}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/70 uppercase tracking-wider relative",
                    column.sortable && onSort && "cursor-pointer hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10",
                    sortKey === column.key && "bg-[var(--color-golden)]/5",
                    column.className
                  )}
                >
                  <div 
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      if (column.sortable && onSort) {
                        handleSortClick(column.key, e);
                      }
                    }}
                  >
                    <span>{column.label}</span>
                    {column.sortable && onSort && (
                      <div 
                        className="relative"
                        ref={(el) => {
                          if (column.sortable) {
                            dropdownRefs.current[column.key] = el;
                          }
                        }}
                      >
                        {sortKey === column.key && sortDirection === "asc" ? (
                          <ArrowUp
                            className="h-4 w-4 text-[var(--color-golden)] transition-colors"
                          />
                        ) : sortKey === column.key && sortDirection === "desc" ? (
                          <ArrowDown
                            className="h-4 w-4 text-[var(--color-golden)] transition-colors"
                          />
                        ) : (
                          <ArrowDown
                            className="h-4 w-4 text-[var(--foreground)]/30 transition-colors"
                          />
                        )}
                        {openDropdown === column.key && (
                          <div className="absolute top-full left-0 mt-1 z-50 min-w-[160px] border-2 border-[var(--color-cream)] dark:border-[var(--color-cream)]/50 bg-[var(--background)] shadow-lg rounded">
                            <button
                              type="button"
                              onClick={(e) => handleSortSelect(column.key, "asc", e)}
                              className={cn(
                                "w-full px-3 py-2 text-xs text-left transition-colors first:rounded-t flex items-center gap-2",
                                "hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20",
                                sortKey === column.key && sortDirection === "asc" &&
                                  "bg-[var(--color-golden)]/10 text-[var(--color-golden)] font-medium"
                              )}
                            >
                              <ArrowUp className="h-3 w-3" />
                              По возрастанию
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleSortSelect(column.key, "desc", e)}
                              className={cn(
                                "w-full px-3 py-2 text-xs text-left transition-colors last:rounded-b flex items-center gap-2",
                                "hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20",
                                sortKey === column.key && sortDirection === "desc" &&
                                  "bg-[var(--color-golden)]/10 text-[var(--color-golden)] font-medium"
                              )}
                            >
                              <ArrowDown className="h-3 w-3" />
                              По убыванию
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-[var(--foreground)]/50"
                >
                  Нет данных
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "border-b border-[var(--color-cream)]/20 dark:border-[var(--color-cream)]/10 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-sm text-[var(--foreground)]",
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(item)
                        : ((item as Record<string, unknown>)[column.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={cn("lg:hidden space-y-3", className)}>
        {data.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--foreground)]/50">
            Нет данных
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "relative bg-[var(--background)] border border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 rounded-lg p-4 shadow-sm transition-all",
                onRowClick && "cursor-pointer hover:bg-[var(--color-cream)]/10 dark:hover:bg-[var(--color-cream)]/5 hover:shadow-md active:scale-[0.98]"
              )}
            >
              {actionsColumn && (
                <div
                  className="absolute top-3 right-3 flex items-center gap-1.5 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {actionsColumn.render
                    ? actionsColumn.render(item)
                    : ((item as Record<string, unknown>)[actionsColumn.key] as ReactNode)}
                </div>
              )}
              <div className={cn("flex flex-wrap gap-x-4 gap-y-3", actionsColumn && "pr-16")}>
                {dataColumns.map((column) => (
                  <div key={column.key} className="flex items-start gap-2 flex-shrink-0">
                    <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider shrink-0 whitespace-nowrap">
                      {column.mobileLabel || column.label}:
                    </div>
                    <div className={cn("text-sm text-[var(--foreground)] break-words min-w-0", column.className)}>
                      {column.render
                        ? column.render(item)
                        : ((item as Record<string, unknown>)[column.key] as ReactNode)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

