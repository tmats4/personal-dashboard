"use client";

import AppHeader from "@/components/AppHeader";
import { DailyWeather, useWeather } from "@/hooks/useWeather";

export default function WeatherPage() {
  const { weather, isLoading, error } = useWeather();

  return (
    <>
      <AppHeader />

      <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold">Weather</h1>
            <p className="mt-3 text-zinc-400">
              Current conditions and short forecast for Hamilton, Ontario.
            </p>
          </header>

          {isLoading && (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-400">
                Loading Hamilton weather...
              </p>
            </section>
          )}

          {error && (
            <section className="rounded-2xl border border-red-900 bg-zinc-950 p-5">
              <p className="text-sm text-red-400">{error}</p>
            </section>
          )}

          {weather && (
            <>
              <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">{weather.location}</p>
                    <h2 className="mt-2 text-6xl font-bold">
                      {weather.temperature} C
                    </h2>
                    <p className="mt-3 text-xl text-zinc-300">
                      {weather.condition}
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                      Updated {formatUpdatedTime(weather.updatedAt)}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:w-96">
                    <WeatherDetail label="Feels Like" value={`${weather.feelsLike} C`} />
                    <WeatherDetail label="Humidity" value={`${weather.humidity}%`} />
                    <WeatherDetail
                      label="Precipitation"
                      value={`${weather.precipitation} mm`}
                    />
                    <WeatherDetail
                      label="Wind"
                      value={`${weather.windSpeed} km/h`}
                    />
                  </div>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <h2 className="text-xl font-semibold">5-Day Forecast</h2>

                <div className="mt-4 grid gap-3 md:grid-cols-5">
                  {weather.daily.map((day) => (
                    <ForecastDay key={day.date} day={day} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function WeatherDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function ForecastDay({ day }: { day: DailyWeather }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm font-semibold">{day.date}</p>
      <p className="mt-3 text-sm text-zinc-400">{day.condition}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold">{day.high} C</span>
        <span className="text-zinc-500">{day.low} C</span>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Rain chance {day.precipitationChance}%
      </p>
    </div>
  );
}

function formatUpdatedTime(dateTime: string) {
  return new Date(dateTime).toLocaleString("en-CA", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
