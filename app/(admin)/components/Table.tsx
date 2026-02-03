"use client";

import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onRowClick?: (item: T) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
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
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/70 uppercase tracking-wider",
                  column.sortable && onSort && "cursor-pointer hover:bg-[var(--color-cream)]/20 dark:hover:bg-[var(--color-cream)]/10",
                  column.className
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && onSort && (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="p-0.5 hover:bg-[var(--color-cream)]/30 dark:hover:bg-[var(--color-cream)]/20 rounded transition-colors"
                      aria-label={`Сортировать по ${column.label}`}
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
                    </button>
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
  );
}

