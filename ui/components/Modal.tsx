"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
}

export function Modal({ isOpen, onClose, children, className, closeOnBackdropClick = true }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative bg-[var(--background)] border border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 max-w-2xl w-full zoom-in-95 max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-[var(--color-cream)] dark:hover:bg-[var(--color-cream)]/30 transition-colors z-10"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="overflow-y-auto max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;

  return createPortal(modalContent, document.body);
}

