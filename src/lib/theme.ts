"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { DARK_QUERY, THEME_COOKIE, type Theme, type ThemePreference } from "./themeScript";

export type { Theme, ThemePreference };

/*
 * Theme preference: "system" (default), "light" or "dark", saved in a cookie for a year.
 * The inline script in layout.tsx applies it before paint; this keeps it live afterwards
 * (OS changes while on "system", choices made in the menu or the header toggle).
 */

const MAX_AGE = 60 * 60 * 24 * 365;

function readPreference(): ThemePreference {
  const value = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`))?.[1];
  return value === "light" || value === "dark" ? value : "system";
}

function systemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function resolveTheme(preference: ThemePreference, system: Theme): Theme {
  return preference === "system" ? system : preference;
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", cb);
  // Cookies fire no events; re-check when the window comes back (choice made in another window).
  document.addEventListener("visibilitychange", cb);
  return () => {
    listeners.delete(cb);
    media.removeEventListener("change", cb);
    document.removeEventListener("visibilitychange", cb);
  };
}

// A string snapshot so useSyncExternalStore gets a stable, comparable value.
const getSnapshot = () => `${readPreference()}:${systemTheme()}`;
const getServerSnapshot = () => "";

export function setThemePreference(preference: ThemePreference) {
  document.cookie = `${THEME_COOKIE}=${preference}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
  apply(resolveTheme(preference, systemTheme()));
  listeners.forEach((l) => l());
}

/** Current preference, the device's theme and the theme in effect. `system`/`theme` are null before hydration. */
export function useTheme() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [preference, system] = snapshot
    ? (snapshot.split(":") as [ThemePreference, Theme])
    : (["system", null] as const);
  const theme = system && resolveTheme(preference, system);

  // Follows the OS live on "system", and re-applies after React's dev remount clears <html> attributes.
  useLayoutEffect(() => {
    if (theme) apply(theme);
  }, [theme]);

  return {
    preference,
    system,
    theme,
    setPreference: setThemePreference,
    toggle: () => setThemePreference(theme === "dark" ? "light" : "dark"),
  };
}

export const THEME_LABELS: Record<ThemePreference, string> = {
  system: "Device default",
  light: "Light",
  dark: "Dark",
};
