"use client";

import { useSyncExternalStore } from "react";

// The current time, refreshed every 30 s. Returns null during server
// rendering so the prerendered shell never depends on the clock.
const TICK = 30_000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, TICK);
  return () => clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / TICK);
const getServerSnapshot = () => -1;

export function useNow(): Date | null {
  const bucket = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return bucket < 0 ? null : new Date(bucket * TICK);
}

/** YYYY-MM-DD in local time. */
export const dayKey = (d: Date) => d.toLocaleDateString("en-CA");

export function daysBetween(fromKey: string, toKey: string) {
  const parse = (k: string) => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  };
  return Math.round((parse(toKey) - parse(fromKey)) / 86_400_000);
}
