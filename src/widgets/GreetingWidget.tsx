"use client";

import { config } from "@/config";
import { AppMenu } from "@/components/menu/AppMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNow } from "@/lib/useNow";

export function GreetingWidget() {
  const now = useNow();
  const hour = now?.getHours() ?? 12;
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Phone: time + buttons sit in a bar above the greeting. sm+: one row, time on the right.
  return (
    <div className="flex flex-col-reverse gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
      <div className="min-w-0">
        <p className="label">
          {now
            ? now.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
            : " "}
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {now ? `${greeting}, ${config.name}` : `Welcome back, ${config.name}`}
        </h1>
      </div>
      <div className="-mr-2 flex shrink-0 items-center gap-1 self-end">
        <p className="mr-2 font-mono text-xl tabular-nums text-muted sm:text-2xl">
          {now?.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" }) ?? ""}
        </p>
        <ThemeToggle />
        <AppMenu />
      </div>
    </div>
  );
}
