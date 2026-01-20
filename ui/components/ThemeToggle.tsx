"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Переключить тему"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
