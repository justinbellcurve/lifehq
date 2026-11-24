/*
 * Theme constants and the pre-paint script. No "use client" and no React imports,
 * so the root layout (a server component) can inline the script and stay static.
 */

export type ThemePreference = "system" | "light" | "dark";
export type Theme = "light" | "dark";

export const THEME_COOKIE = "lifehq-theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Runs in <head> before first paint: reads the cookie, falls back to the device setting,
 * and sets data-theme on <html>. Mirrors readPreference/resolveTheme in theme.ts.
 */
export const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark)(?:;|$)/);document.documentElement.dataset.theme=m?m[1]:matchMedia("${DARK_QUERY}").matches?"dark":"light"}catch(e){}})()`;
