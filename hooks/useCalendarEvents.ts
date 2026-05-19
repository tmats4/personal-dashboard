"use client";

import { useEffect, useState } from "react";

export type CalendarEventType =
  | "Work"
  | "Personal"
  | "Finance"
  | "Health"
  | "Learning"
  | "Errands";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: CalendarEventType;
  notes: string;
};

const STORAGE_KEY = "personal-dashboard-calendar-events";

const calendarEventTypes: CalendarEventType[] = [
  "Work",
  "Personal",
  "Finance",
  "Health",
  "Learning",
  "Errands",
];

type StoredCalendarEvent = Partial<CalendarEvent> & {
  startTime?: string;
  endTime?: string;
  category?: CalendarEventType;
};

function isCalendarEventType(value: unknown): value is CalendarEventType {
  return (
    typeof value === "string" &&
    calendarEventTypes.includes(value as CalendarEventType)
  );
}

function normalizeCalendarEvents(rawEvents: unknown): CalendarEvent[] {
  if (!Array.isArray(rawEvents)) return [];

  return rawEvents.map((event): CalendarEvent => {
    const storedEvent: StoredCalendarEvent =
      event && typeof event === "object" ? (event as StoredCalendarEvent) : {};
    const migratedTime =
      storedEvent.time ??
      [storedEvent.startTime, storedEvent.endTime].filter(Boolean).join("-");

    return {
      id: storedEvent.id ?? crypto.randomUUID(),
      title: storedEvent.title ?? "",
      date: storedEvent.date ?? getTodayDateValue(),
      time: migratedTime,
      type: isCalendarEventType(storedEvent.type)
        ? storedEvent.type
        : isCalendarEventType(storedEvent.category)
          ? storedEvent.category
          : "Personal",
      notes: storedEvent.notes ?? "",
    };
  });
}

export function getTodayDateValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;

  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function getLocalDateValue(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function formatCalendarDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function sortCalendarEvents(events: CalendarEvent[]) {
  return [...events].sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);

    if (dateComparison !== 0) return dateComparison;

    return a.time.localeCompare(b.time);
  });
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [date, setDate] = useState(getTodayDateValue());
  const [time, setTime] = useState("");
  const [type, setType] = useState<CalendarEventType>("Personal");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);

    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Keep localStorage loading client-only without overwriting saved events.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEvents(normalizeCalendarEvents(parsedEvents));
      } catch {
        setEvents([]);
      }
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, hasLoaded]);

  const addEvent = () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle || !date) return;

    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      date,
      time,
      type,
      notes: notes.trim(),
    };

    setEvents((currentEvents) => sortCalendarEvents([...currentEvents, event]));
    setNewTitle("");
    setTime("");
    setType("Personal");
    setNotes("");
  };

  const deleteEvent = (id: string) => {
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );
  };

  const sortedEvents = sortCalendarEvents(events);
  const todayDateValue = getTodayDateValue();
  const upcomingEvents = sortedEvents.filter(
    (event) => event.date >= todayDateValue
  );

  return {
    events: sortedEvents,
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
  };
}
