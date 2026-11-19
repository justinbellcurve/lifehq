"use client";

import { config } from "@/config";
import { useNow } from "@/lib/useNow";

export function GreetingWidget() {
  const now = useNow();
  const hour = now?.getHours() ?? 12;
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="label">
          {now
            ? now.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
            : " "}
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {now ? `${greeting}, ${config.name}` : `Welcome back, ${config.name}`}
        </h1>
      </div>
      <p className="font-mono text-2xl tabular-nums text-muted">
        {now?.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" }) ?? ""}
      </p>
    </div>
  );
}
