"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeBox() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server and first render to avoid hydration mismatch
  }

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className="fixed top-4 right-6 z-50 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      {isDarkMode ? "Light Theme" : "Dark Theme"}
    </button>
  );
}
