"use client";

import { useState } from "react";
import { useStored } from "@/lib/store";
import { dayKey, daysBetween, useNow } from "@/lib/useNow";

interface Leg {
  date: string; // YYYY-MM-DD, or "" when not set yet
  title: string;
}
interface Trip {
  title: string;
  legs: Leg[];
}

const sortLegs = (legs: Leg[]) => [...legs].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
const fmt = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
};

export function TripWidget() {
  const now = useNow();
  const [trip, saveTrip] = useStored<Trip>("trip");
  const [title, setTitle] = useState("");
  const [legDate, setLegDate] = useState("");
  const [legTitle, setLegTitle] = useState("");

  if (!trip) {
    return (
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) saveTrip({ title: title.trim(), legs: [] });
          setTitle("");
        }}
      >
        <p className="text-muted">No trip yet. Name it to start the countdown.</p>
        <div className="flex gap-2">
          <input id="trip-title" className="field" placeholder="e.g. Costa Rica · Panama · Jamaica" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button type="submit" className="btn btn-primary">Create</button>
        </div>
      </form>
    );
  }

  const today = now ? dayKey(now) : null;
  const next = today ? sortLegs(trip.legs).find((l) => l.date && l.date >= today) : undefined;
  const days = next && today ? daysBetween(today, next.date) : null;
  const undated = trip.legs.filter((l) => !l.date).length;

  return (
    <div className="grid gap-4">
      <div className="grid gap-1 rounded-xl bg-gradient-to-br from-accent/20 to-sun/20 p-4">
        <span className="label">{trip.title}</span>
        <p className="font-display text-5xl font-bold tabular-nums">
          {days === null ? "–" : days === 0 ? "Today" : days}
          {days !== null && days > 0 && <span className="ml-2 font-sans text-sm font-normal text-muted">{days === 1 ? "day" : "days"}</span>}
        </p>
        <p className="text-sm text-muted">
          {next ? <>until <b className="text-ink">{next.title}</b> · {fmt(next.date)}</> : "Add a dated stop to start the countdown."}
          {undated > 0 && <span className="text-warn"> · {undated} date{undated > 1 ? "s" : ""} to set</span>}
        </p>
      </div>

      <ol className="grid gap-2">
        {sortLegs(trip.legs).map((leg) => {
          const i = trip.legs.indexOf(leg);
          const past = !!(today && leg.date && leg.date < today);
          return (
            <li key={i} className={`flex items-center gap-3 ${past ? "opacity-50" : ""}`}>
              <input
                type="date"
                aria-label={`Date for ${leg.title}`}
                className="field w-auto py-1 font-mono text-xs"
                value={leg.date}
                onChange={(e) => {
                  const legs = [...trip.legs];
                  legs[i] = { ...leg, date: e.target.value };
                  saveTrip({ ...trip, legs });
                }}
              />
              <span className="min-w-0 flex-1">{leg.title}</span>
              <button
                type="button"
                className="btn-ghost"
                aria-label={`Remove ${leg.title}`}
                onClick={() => saveTrip({ ...trip, legs: trip.legs.filter((_, j) => j !== i) })}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ol>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!legTitle.trim()) return;
          saveTrip({ ...trip, legs: [...trip.legs, { date: legDate, title: legTitle.trim() }] });
          setLegDate("");
          setLegTitle("");
        }}
      >
        <input type="date" aria-label="New stop date" className="field w-auto" value={legDate} onChange={(e) => setLegDate(e.target.value)} />
        <input id="leg-title" className="field min-w-40 flex-1" placeholder="Add a stop or flight" value={legTitle} onChange={(e) => setLegTitle(e.target.value)} />
        <button type="submit" className="btn">Add</button>
      </form>
    </div>
  );
}
