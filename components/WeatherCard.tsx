import DashboardCard from "@/components/DashboardCard";

export default function WeatherCard() {
  return (
    <DashboardCard title="Weather">
      <p className="text-4xl font-bold">--°C</p>
      <p className="mt-2 text-sm text-zinc-400">
        Weather API coming later.
      </p>
    </DashboardCard>
  );
}