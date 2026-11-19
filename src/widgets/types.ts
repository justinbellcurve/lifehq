import type { ComponentType } from "react";

/** Width on the desktop "wall" grid (12 columns). */
export type WidgetSize = "full" | "wide" | "half" | "third";

export interface WidgetDefinition {
  id: string;
  title: string;
  size: WidgetSize;
  /** Show in the phone "glance" view. Desktop shows everything. */
  onPhone: boolean;
  Component: ComponentType;
}
