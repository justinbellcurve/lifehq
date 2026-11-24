"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "@/lib/theme";

/** Header quick toggle: flips between light and dark (sets an explicit preference). */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" className="icon-btn" aria-label="Dark theme" aria-pressed={theme === "dark"} onClick={toggle}>
      {/* Icon is picked in CSS from data-theme, so it is right before hydration too. */}
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );
}
