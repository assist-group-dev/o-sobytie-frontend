import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("text-2xl font-bold tracking-tight select-none", className)}>
      O!
    </div>
  );
}








