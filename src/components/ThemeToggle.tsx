"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      title={theme === "light" ? "Light Mode" : "Dark Mode"}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
    >
      {theme === "light" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}