"use client";

import { CheckIcon } from "@/components/icons";
import { THEME_LABELS, useTheme, type ThemePreference } from "@/lib/theme";

const OPTIONS: ThemePreference[] = ["system", "light", "dark"];

/** Shown next to "Theme" in the menu list. */
export function ThemeValue() {
  return <>{THEME_LABELS[useTheme().preference]}</>;
}

/** The Theme sub-panel: a radio group, so arrow keys move between options. */
export function ThemeSettings() {
  const { preference, system, setPreference } = useTheme();

  return (
    <fieldset className="grid gap-1">
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map((option) => {
        const checked = preference === option;
        return (
          <label
            key={option}
            className="menu-row has-focus-visible:outline-2 has-focus-visible:outline-accent has-checked:bg-sunk"
          >
            <input
              type="radio"
              name="theme"
              value={option}
              checked={checked}
              onChange={() => setPreference(option)}
              className="sr-only"
            />
            <span className="grid flex-1 gap-0.5">
              <span className="font-medium">{THEME_LABELS[option]}</span>
              {option === "system" && system && (
                <span className="text-sm text-muted">Matches your device, currently {THEME_LABELS[system].toLowerCase()}</span>
              )}
            </span>
            <CheckIcon className={checked ? "text-accent" : "invisible"} />
          </label>
        );
      })}
    </fieldset>
  );
}
