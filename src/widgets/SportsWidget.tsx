"use client";

const TEAMS = ["Maple Leafs", "Raptors", "Blue Jays", "Bills", "Tiger-Cats"];

// Placeholder until the sports module is built (first full module after the POC).
export function SportsWidget() {
  return (
    <div className="grid gap-3">
      <p className="text-muted">Schedules, scores and game-time alerts are coming next.</p>
      <ul className="flex flex-wrap gap-2">
        {TEAMS.map((t) => (
          <li key={t} className="rounded-full border border-line px-3 py-1 text-sm">{t}</li>
        ))}
      </ul>
    </div>
  );
}
