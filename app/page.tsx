"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import TodoCard from "@/components/TodoCard";
import CalendarCard from "@/components/CalendarCard";
import WeatherCard from "@/components/WeatherCard";
import SpotifyCard from "@/components/SpotifyCard";
import ReadsCard from "@/components/ReadsCard";

export default function Home() {
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    const today = new Date();

    setTodayLabel(
      today.toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm text-zinc-400">{todayLabel}</p>

          <h1 className="mt-2 text-4xl font-bold">Personal Dashboard</h1>

          <p className="mt-3 text-zinc-400">
            Your daily front page for calendar, tasks, music, reading, and
            weather.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          <CalendarCard />
          <WeatherCard />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <TodoCard />
          <SpotifyCard />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <ReadsCard />

          <DashboardCard title="Build Status">
            <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
              <li>Dashboard shell created.</li>
              <li>Cards split into components.</li>
              <li>To-do list is the first real feature.</li>
              <li>Tasks save in local browser storage.</li>
            </ul>
          </DashboardCard>
        </section>
      </div>
    </main>
  );
}