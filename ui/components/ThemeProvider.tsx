"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const stored = localStorage.getItem("theme-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const savedTheme = parsed?.state?.theme;
        if (savedTheme) {
          document.documentElement.classList.toggle("dark", savedTheme === "dark");
        }
      } catch {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        setTheme(systemTheme);
      }
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
