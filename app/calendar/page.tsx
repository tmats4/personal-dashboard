"use client";

import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  CalendarEvent,
  CalendarEventType,
  formatCalendarDate,
  getLocalDateValue,
  getTodayDateValue,
  useCalendarEvents,
} from "@/hooks/useCalendarEvents";

function getWeekStart(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + mondayOffset);

  return getLocalDateValue(date);
}

function getWeekDays(weekStart: string) {
  const start = new Date(`${weekStart}T00:00:00`);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return getLocalDateValue(date);
  });
}

function moveWeek(weekStart: string, direction: "previous" | "next") {
  const date = new Date(`${weekStart}T00:00:00`);
  date.setDate(date.getDate() + (direction === "next" ? 7 : -7));

  return getLocalDateValue(date);
}

export default function CalendarPage() {
  const {
    events,
    upcomingEvents,
    newTitle,
    setNewTitle,
    date,
    setDate,
    time,
    setTime,
    type,
    setType,
    notes,
    setNotes,
    addEvent,
    deleteEvent,
    calendarEventTypes,
  } = useCalendarEvents();

  const [weekStart, setWeekStart] = useState(getWeekStart(getTodayDateValue()));
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const visibleWeekEvents = events.filter((event) =>
    weekDays.includes(event.date)
  );

  const handleAddEvent = () => {
    addEvent();
    setWeekStart(getWeekStart(date));
  };

  return (
    <>
      <AppHeader />

      <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Calendar</h1>
              <p className="mt-3 max-w-2xl text-zinc-400">
                Plan your week and add future activities. Everything stays local
                in this browser for now.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setWeekStart(moveWeek(weekStart, "previous"))}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
              >
                Previous
              </button>
              <button
                onClick={() => setWeekStart(getWeekStart(getTodayDateValue()))}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
              >
                This Week
              </button>
              <button
                onClick={() => setWeekStart(moveWeek(weekStart, "next"))}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
              >
                Next
              </button>
            </div>
          </header>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-semibold">Add Activity</h2>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
              <input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleAddEvent();
                }}
                placeholder="Activity name..."
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-400"
              />

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              />

              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              />

              <select
                value={type}
                onChange={(event) => setType(event.target.value as CalendarEventType)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              >
                {calendarEventTypes.map((eventType) => (
                  <option key={eventType}>{eventType}</option>
                ))}
              </select>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto]">
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional notes..."
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-400"
              />

              <button
                onClick={handleAddEvent}
                className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-white"
              >
                Add Activity
              </button>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Weekly Plan</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {formatCalendarDate(weekDays[0])} to{" "}
                  {formatCalendarDate(weekDays[6])}
                </p>
              </div>

              <p className="text-sm text-zinc-500">
                {visibleWeekEvents.length} planned this week
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-7">
              {weekDays.map((day) => {
                const dayEvents = events.filter((event) => event.date === day);
                const isToday = day === getTodayDateValue();

                return (
                  <DayColumn
                    key={day}
                    dateValue={day}
                    events={dayEvents}
                    isToday={isToday}
                    onDelete={deleteEvent}
                  />
                );
              })}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-semibold">Upcoming</h2>

            <div className="mt-4 flex flex-col gap-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-zinc-400">
                  No future activities yet.
                </p>
              ) : (
                upcomingEvents.slice(0, 8).map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onDelete={deleteEvent}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function DayColumn({
  dateValue,
  events,
  isToday,
  onDelete,
}: {
  dateValue: string;
  events: CalendarEvent[];
  isToday: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`min-h-52 rounded-xl border p-3 ${
        isToday
          ? "border-zinc-500 bg-zinc-900"
          : "border-zinc-800 bg-zinc-950"
      }`}
    >
      <div className="mb-3">
        <p className="text-sm font-semibold">{formatCalendarDate(dateValue)}</p>
        {isToday && <p className="mt-1 text-xs text-zinc-400">Today</p>}
      </div>

      <div className="flex flex-col gap-2">
        {events.length === 0 ? (
          <p className="text-xs text-zinc-500">No plans</p>
        ) : (
          events.map((event) => (
            <EventBlock key={event.id} event={event} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}

function EventBlock({
  event,
  onDelete,
}: {
  event: CalendarEvent;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{event.title}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {formatEventTime(event)} / {event.type}
          </p>
        </div>

        <button
          onClick={() => onDelete(event.id)}
          className="text-xs text-zinc-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>

      {event.notes && (
        <p className="mt-2 text-xs leading-5 text-zinc-400">{event.notes}</p>
      )}
    </div>
  );
}

function EventRow({
  event,
  onDelete,
}: {
  event: CalendarEvent;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{event.title}</p>
        <p className="mt-1 text-sm text-zinc-400">
          {formatCalendarDate(event.date)} / {formatEventTime(event)} /{" "}
          {event.type}
        </p>
        {event.notes && <p className="mt-1 text-sm text-zinc-500">{event.notes}</p>}
      </div>

      <button
        onClick={() => onDelete(event.id)}
        className="self-start text-sm text-zinc-500 hover:text-red-400 sm:self-auto"
      >
        Delete
      </button>
    </div>
  );
}

function formatEventTime(event: CalendarEvent) {
  if (event.time) return event.time;

  return "Any time";
}
