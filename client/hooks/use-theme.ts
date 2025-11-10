import { useEffect, useState } from "react";

export function useTheme() {
  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem("theme");

    // If no saved theme, use system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = prefersDark ? "dark" : "light";
      applyTheme(theme);
    } else {
      applyTheme(savedTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const theme = e.matches ? "dark" : "light";
      // Only apply system theme if user hasn't manually set a preference
      if (!localStorage.getItem("theme")) {
        applyTheme(theme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
}

export function useThemeToggle() {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get current theme from DOM or localStorage
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  return {
    theme: mounted ? theme : "light",
    toggleTheme,
    isDark: mounted && theme === "dark",
  };
}

function applyTheme(theme: string) {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}
