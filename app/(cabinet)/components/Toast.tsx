"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: "bg-[var(--color-cream)]/80 dark:bg-[var(--color-cream)]/20 border-[var(--color-golden)] text-[var(--foreground)]",
  error: "bg-[var(--color-peach)]/80 dark:bg-[var(--color-peach)]/30 border-[var(--color-peach)] text-[var(--foreground)]",
  info: "bg-[var(--color-cream)]/80 dark:bg-[var(--color-cream)]/20 border-[var(--color-cream)]/50 text-[var(--foreground)]",
  warning: "bg-[var(--color-peach-light)]/80 dark:bg-[var(--color-peach-light)]/30 border-[var(--color-golden)]/50 text-[var(--foreground)]",
};

export function Toast({ toast, onRemove }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 shadow-lg",
        "w-full sm:min-w-[300px] sm:max-w-[500px] sm:w-auto",
        "animate-slide-in-right backdrop-blur-sm",
        styles[toast.type]
      )}
    >
      <Icon className={cn(
        "h-4 w-4 sm:h-5 sm:w-5 shrink-0",
        toast.type === "success" && "text-[var(--color-golden)]",
        toast.type === "error" && "text-[var(--color-peach)]",
        toast.type === "info" && "text-[var(--color-golden)]",
        toast.type === "warning" && "text-[var(--color-golden)]"
      )} />
      <p className="flex-1 text-xs sm:text-sm font-medium break-words">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:opacity-70 transition-opacity shrink-0 text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
        aria-label="Закрыть"
      >
        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
}

