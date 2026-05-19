"use client";

import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

export default function SpotifyCard() {
  const { player, isConnected, isLoading, isControlling, error, sendControl } =
    useSpotifyPlayer();
  const item = player?.item;

  return (
    <DashboardCard title="Spotify">
      {isLoading && (
        <p className="text-sm text-zinc-400">Checking Spotify playback...</p>
      )}

      {!isLoading && !isConnected && (
        <div>
          <p className="text-sm text-zinc-400">Not connected yet.</p>
          <a
            href="/api/spotify/login"
            className="mt-4 inline-block rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
          >
            Connect Spotify
          </a>
        </div>
      )}

      {isConnected && (
        <div>
          <p className="text-sm text-zinc-400">Now Playing</p>

          {item ? (
            <div className="mt-4 flex gap-4">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-20 w-20 rounded-xl object-cover"
                />
              )}

              <div className="min-w-0">
                <p className="truncate text-xl font-semibold">{item.title}</p>
                <p className="mt-1 truncate text-sm text-zinc-400">
                  {item.subtitle}
                </p>
                {player.deviceName && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Device: {player.deviceName}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              Nothing is currently playing.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => sendControl("previous")}
              disabled={isControlling}
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => sendControl(player?.isPlaying ? "pause" : "play")}
              disabled={isControlling}
              className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {player?.isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => sendControl("next")}
              disabled={isControlling}
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <Link
            href="/spotify"
            className="mt-4 inline-block text-sm text-zinc-400 hover:text-zinc-100"
          >
            Open player -&gt;
          </Link>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </DashboardCard>
  );
}
