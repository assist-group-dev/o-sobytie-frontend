import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-gray-100 bg-white p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
