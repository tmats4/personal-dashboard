"use client";

import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import { useWeather } from "@/hooks/useWeather";

export default function WeatherCard() {
  const { weather, isLoading, error } = useWeather();

  return (
    <DashboardCard title="Weather">
      {isLoading && (
        <p className="text-sm text-zinc-400">Loading Hamilton weather...</p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {weather && (
        <div>
          <p className="text-sm text-zinc-400">{weather.location}</p>
          <p className="mt-2 text-4xl font-bold">{weather.temperature} C</p>
          <p className="mt-2 text-sm text-zinc-300">{weather.condition}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <WeatherMetric label="Feels" value={`${weather.feelsLike} C`} />
            <WeatherMetric label="Wind" value={`${weather.windSpeed} km/h`} />
            <WeatherMetric label="Humidity" value={`${weather.humidity}%`} />
            <WeatherMetric
              label="Rain"
              value={`${weather.daily[0]?.precipitationChance ?? 0}%`}
            />
          </div>

          <Link
            href="/weather"
            className="mt-4 inline-block text-sm text-zinc-400 hover:text-zinc-100"
          >
            View forecast -&gt;
          </Link>
        </div>
      )}
    </DashboardCard>
  );
}

function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
