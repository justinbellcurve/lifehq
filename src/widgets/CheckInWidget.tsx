"use client";

import { useState } from "react";
import { useStored } from "@/lib/store";
import { dayKey, useNow } from "@/lib/useNow";

type Gym = "" | "went" | "later" | "rest";
interface CheckIn {
  mood: number;
  energy: number;
  gym: Gym;
  top3: string[];
  savedAt?: string;
}
const EMPTY: CheckIn = { mood: 0, energy: 0, gym: "", top3: ["", "", ""] };
const GYM_OPTIONS: [Gym, string][] = [
  ["went", "Went"],
  ["later", "Going later"],
  ["rest", "Rest day"],
];

function Scale({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="grid flex-1 gap-1.5" role="group" aria-label={label}>
      <span className="label">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="btn flex-1"
            aria-pressed={value === n}
            onClick={() => onChange(value === n ? 0 : n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CheckInWidget() {
  const now = useNow();
  const key = `checkin:${now ? dayKey(now) : "pending"}`;
  const [saved, save] = useStored<CheckIn>(key);
  const [draft, setDraft] = useState<CheckIn | null>(null);
  const current = draft ?? saved ?? EMPTY;
  const edit = (patch: Partial<CheckIn>) => setDraft({ ...current, ...patch });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        save({ ...current, savedAt: new Date().toISOString() });
        setDraft(null);
      }}
    >
      <div className="flex flex-wrap gap-4">
        <Scale label="Mood" value={current.mood} onChange={(mood) => edit({ mood })} />
        <Scale label="Energy" value={current.energy} onChange={(energy) => edit({ energy })} />
      </div>
      <div className="grid gap-1.5" role="group" aria-label="Gym today">
        <span className="label">Gym today</span>
        <div className="flex flex-wrap gap-1.5">
          {GYM_OPTIONS.map(([v, text]) => (
            <button
              key={v}
              type="button"
              className="btn"
              aria-pressed={current.gym === v}
              onClick={() => edit({ gym: current.gym === v ? "" : v })}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-1.5">
        <span className="label">Top 3 for today</span>
        {current.top3.map((t, i) => (
          <input
            key={i}
            id={`top3-${i}`}
            className="field"
            placeholder={`Priority ${i + 1}`}
            value={t}
            onChange={(e) => {
              const top3 = [...current.top3];
              top3[i] = e.target.value;
              edit({ top3 });
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="label">
          {saved?.savedAt
            ? `Saved ${new Date(saved.savedAt).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}`
            : "Not checked in yet"}
          {draft ? " · unsaved changes" : ""}
        </span>
        <button type="submit" className="btn btn-primary" disabled={!now}>
          {saved ? "Update check-in" : "Save check-in"}
        </button>
      </div>
    </form>
  );
}
