import type { ComponentType } from "react";
import { ContrastIcon, type Icon } from "@/components/icons";
import { ThemeSettings, ThemeValue } from "./ThemeSettings";

export type MenuItem = {
  id: string;
  label: string;
  Icon: Icon;
  /** Optional current value shown on the right of the row (e.g. the chosen theme). */
  Value?: ComponentType;
  /** Body of the sub-panel that slides in; the menu supplies its header and back button. */
  Panel: ComponentType;
};

/**
 * The app menu. Order here = order in the menu.
 * New setting or module = a panel component + one entry below.
 */
export const menuItems: MenuItem[] = [
  { id: "theme", label: "Theme", Icon: ContrastIcon, Value: ThemeValue, Panel: ThemeSettings },
];
