// app/useTheme.ts
"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light"); // Default to 'light'

  useEffect(() => {
    // On page load, check localStorage and system preference
    const storedTheme = localStorage.theme as Theme | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = storedTheme || systemTheme;
    setThemeState(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const setTheme = (theme: Theme) => {
    const root = document.documentElement;

    if (theme === "system") {
      localStorage.removeItem("theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setThemeState(systemTheme);
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      localStorage.theme = theme;
      setThemeState(theme);
      root.classList.toggle("dark", theme === "dark");
    }
  };

  return { theme, setTheme };
}
