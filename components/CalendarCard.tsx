"use client";

import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import {
  formatCalendarDate,
  getTodayDateValue,
  useCalendarEvents,
} from "@/hooks/useCalendarEvents";

export default function CalendarCard() {
  const { upcomingEvents } = useCalendarEvents();
  const todayEvents = upcomingEvents.filter(
    (event) => event.date === getTodayDateValue()
  );
  const nextEvents = upcomingEvents.slice(0, 4);

  return (
    <DashboardCard title="Calendar" className="lg:col-span-2">
      <div className="grid gap-3 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Today</p>
          <p className="mt-2 text-3xl font-bold">{todayEvents.length}</p>
          <p className="mt-2 text-sm text-zinc-500">
            {todayEvents.length === 1 ? "activity planned" : "activities planned"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-semibold">Upcoming</p>
            <Link
              href="/calendar"
              className="text-sm text-zinc-400 hover:text-zinc-100"
            >
              Plan week -&gt;
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {nextEvents.length === 0 ? (
              <p className="text-sm text-zinc-400">
                No activities planned yet.
              </p>
            ) : (
              nextEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
                >
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatCalendarDate(event.date)}
                    {event.time ? ` / ${event.time}` : ""} / {event.type}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
