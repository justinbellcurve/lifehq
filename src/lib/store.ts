"use client";

import { useSyncExternalStore } from "react";

/*
 * Tiny key-value store for widget data.
 * For the proof of concept it saves to this browser (localStorage).
 * Step 3 swaps the internals for Supabase; widgets keep calling useStored().
 */

const PREFIX = "lifehq:";
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function read<T>(key: string): T | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(PREFIX + key);
  } catch {
    /* storage unavailable */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T | null;
  let value: unknown = null;
  try {
    value = raw ? JSON.parse(raw) : null;
  } catch {
    value = null;
  }
  cache.set(key, { raw, value });
  return value as T | null;
}

function notify(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

export function write<T>(key: string, value: T | null) {
  try {
    if (value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
  notify(key);
}

function subscribe(key: string, cb: () => void) {
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PREFIX + key) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    set.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Read and write one stored value. `null` until loaded or when empty. */
export function useStored<T>(key: string): [T | null, (v: T | null) => void] {
  const value = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => read<T>(key),
    () => null,
  );
  return [value, (v) => write(key, v)];
}
