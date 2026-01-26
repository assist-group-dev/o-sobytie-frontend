import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-[var(--color-cream)]/30 dark:border-[var(--color-cream)]/20 bg-white dark:bg-[var(--color-cream)]/5 p-6 rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
