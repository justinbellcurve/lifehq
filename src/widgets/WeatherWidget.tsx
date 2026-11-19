"use client";

import { useEffect, useState } from "react";
import { config } from "@/config";

// Open-Meteo: free, no API key. https://open-meteo.com
interface Forecast {
  current: { temperature_2m: number; apparent_temperature: number; weather_code: number; wind_speed_10m: number };
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] };
}

function describe(code: number) {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorms";
}

const URL_ =
  "https://api.open-meteo.com/v1/forecast?" +
  new URLSearchParams({
    latitude: String(config.home.latitude),
    longitude: String(config.home.longitude),
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: config.home.timezone,
    forecast_days: "4",
  });

export function WeatherWidget() {
  const [data, setData] = useState<Forecast | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(URL_)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d: Forecast) => {
          if (!alive) return;
          setData(d);
          setError(false);
        })
        .catch(() => {
          if (alive) setError(true);
        });
    load();
    const id = setInterval(load, 15 * 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (error && !data) return <p className="text-muted">Couldn&apos;t load the weather. It retries every 15 minutes.</p>;
  if (!data) return <p className="text-muted">Loading weather for {config.home.city}…</p>;

  const c = data.current;
  return (
    <div className="grid gap-4">
      <div>
        <span className="label">{config.home.city}</span>
        <p className="font-display text-5xl font-bold tabular-nums">{Math.round(c.temperature_2m)}°</p>
        <p className="text-sm text-muted">
          {describe(c.weather_code)} · feels like {Math.round(c.apparent_temperature)}° · wind {Math.round(c.wind_speed_10m)} km/h
        </p>
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {data.daily.time.slice(1, 4).map((t, i) => (
          <li key={t} className="grid gap-0.5 rounded-lg bg-sunk p-2 text-center">
            <span className="label">{new Date(t + "T12:00").toLocaleDateString("en-CA", { weekday: "short" })}</span>
            <span className="text-sm">{describe(data.daily.weather_code[i + 1])}</span>
            <span className="font-mono text-sm tabular-nums">
              {Math.round(data.daily.temperature_2m_max[i + 1])}° / {Math.round(data.daily.temperature_2m_min[i + 1])}°
            </span>
            <span className="font-mono text-xs text-muted">{data.daily.precipitation_probability_max[i + 1]}% precip</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
