"use client";

import { useState, useEffect } from "react";
import { Construction } from "lucide-react";
import { API_BASE_URL } from "@/utils/backend";
import { Logo } from "@/ui/components/Logo";
import { Card } from "@/ui/components/Card";
import { cn } from "@/utils/cn";

const DEFAULT_MESSAGE =
  "Сайт временно закрыт на техническое обслуживание. Мы вернёмся в ближайшее время.";

export default function MaintenancePage() {
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/maintenance`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = (await response.json()) as { enabled?: boolean; message?: string };
          setMessage(data.message ?? DEFAULT_MESSAGE);
        }
      } catch {
        setMessage(DEFAULT_MESSAGE);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-4 py-12",
        "text-[var(--foreground)]",
        "bg-[var(--background)]",
        "bg-gradient-to-b from-[var(--color-cream)]/[0.035] to-[var(--color-cream)]/[0.035]"
      )}
    >
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8 animate-fade-in-down">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-20 h-20 rounded-full",
              "bg-[var(--color-golden)]/15 dark:bg-[var(--color-golden)]/20",
              "border-2 border-[var(--color-golden)]/30"
            )}
          >
            <Construction
              className="w-10 h-10 text-[var(--color-golden)]"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <Logo className="text-[var(--color-golden)] text-4xl sm:text-5xl shrink-0" />
            <h1 className="text-3xl sm:text-3xl font-bold uppercase tracking-tight whitespace-nowrap">
              {isLoading ? "Загрузка…" : "Сайт на обслуживании"}
            </h1>
          </div>
        </div>

        <Card className="w-full text-left">
          <p className="text-[var(--foreground)]/85 whitespace-pre-wrap leading-relaxed">
            {message}
          </p>
        </Card>

        <p className="text-sm text-[var(--foreground)]/50">
          Спасибо за терпение. Мы работаем над улучшением сервиса.
        </p>
      </div>
    </div>
  );
}
