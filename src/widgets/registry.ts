import type { WidgetDefinition } from "./types";
import { GreetingWidget } from "./GreetingWidget";
import { CheckInWidget } from "./CheckInWidget";
import { WeatherWidget } from "./WeatherWidget";
import { TripWidget } from "./TripWidget";
import { SportsWidget } from "./SportsWidget";

/**
 * Every module on the home screen. Order here = order on screen.
 * New feature = new component in src/widgets + one entry below.
 */
export const widgets: WidgetDefinition[] = [
  { id: "greeting", title: "", size: "full", onPhone: true, Component: GreetingWidget },
  { id: "checkin", title: "Today's check-in", size: "wide", onPhone: true, Component: CheckInWidget },
  { id: "weather", title: "Weather", size: "third", onPhone: true, Component: WeatherWidget },
  { id: "trip", title: "Next trip", size: "half", onPhone: true, Component: TripWidget },
  { id: "sports", title: "My teams", size: "half", onPhone: false, Component: SportsWidget },
];
