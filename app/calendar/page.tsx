import AppHeader from "@/components/AppHeader";

export default function CalendarPage() {
  return (
    <>
      <AppHeader />

      <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold">Calendar</h1>
            <p className="mt-3 text-zinc-400">
              Manual weekly schedule coming next. No external calendar
              integration yet.
            </p>
          </header>
        </div>
      </main>
    </>
  );
}
