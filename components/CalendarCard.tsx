import DashboardCard from "@/components/DashboardCard";

export default function CalendarCard() {
  return (
    <DashboardCard title="Calendar" className="lg:col-span-2">
      <div className="grid gap-3 sm:grid-cols-5">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
          <div
            key={day}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <p className="font-semibold">{day}</p>
            <p className="mt-2 text-sm text-zinc-400">
              Schedule coming later.
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}