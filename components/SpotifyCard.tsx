import DashboardCard from "@/components/DashboardCard";

export default function SpotifyCard() {
  return (
    <DashboardCard title="Spotify">
      <p className="text-sm text-zinc-400">Now Playing</p>
      <p className="mt-2 text-xl font-semibold">Not connected yet</p>

      <div className="mt-5 flex gap-3">
        <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm">
          ◀
        </button>
        <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm">
          Play
        </button>
        <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm">
          ▶
        </button>
      </div>
    </DashboardCard>
  );
}