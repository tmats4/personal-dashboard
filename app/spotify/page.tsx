"use client";

import AppHeader from "@/components/AppHeader";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

export default function SpotifyPage() {
  const {
    player,
    isConnected,
    isLoading,
    isControlling,
    error,
    refreshPlayer,
    sendControl,
    logout,
  } = useSpotifyPlayer();
  const item = player?.item;

  return (
    <>
      <AppHeader />

      <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold">Spotify</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              See your current Spotify playback and control an active Spotify
              Connect device from the dashboard.
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            {isLoading && (
              <p className="text-sm text-zinc-400">
                Checking Spotify connection...
              </p>
            )}

            {!isLoading && !isConnected && (
              <div>
                <h2 className="text-xl font-semibold">Connect Spotify</h2>
                <p className="mt-3 max-w-2xl text-sm text-zinc-400">
                  Connect your Spotify account once, then this page can use a
                  refresh token stored in an HTTP-only cookie to keep the module
                  working locally.
                </p>

                <a
                  href="/api/spotify/login"
                  className="mt-5 inline-block rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-white"
                >
                  Connect Spotify
                </a>
              </div>
            )}

            {isConnected && (
              <div>
                <div className="flex flex-col gap-6 lg:flex-row">
                  {item?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-48 w-48 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-500">
                      No artwork
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-400">Now Playing</p>
                    <h2 className="mt-2 truncate text-4xl font-bold">
                      {item?.title ?? "Nothing playing"}
                    </h2>
                    {item && (
                      <p className="mt-3 text-xl text-zinc-300">
                        {item.subtitle}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => sendControl("previous")}
                        disabled={isControlling}
                        className="rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          sendControl(player?.isPlaying ? "pause" : "play")
                        }
                        disabled={isControlling}
                        className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {player?.isPlaying ? "Pause" : "Play"}
                      </button>
                      <button
                        onClick={() => sendControl("next")}
                        disabled={isControlling}
                        className="rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                      <button
                        onClick={refreshPlayer}
                        disabled={isControlling}
                        className="rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Refresh
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <SpotifyDetail
                        label="Status"
                        value={player?.isPlaying ? "Playing" : "Paused"}
                      />
                      <SpotifyDetail
                        label="Device"
                        value={player?.deviceName ?? "No active device"}
                      />
                      <SpotifyDetail
                        label="Progress"
                        value={formatProgress(
                          player?.progressMs ?? 0,
                          player?.durationMs ?? 0
                        )}
                      />
                    </div>

                    <button
                      onClick={logout}
                      className="mt-5 text-sm text-zinc-500 hover:text-red-400"
                    >
                      Disconnect Spotify
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="mt-5 text-sm text-red-400">{error}</p>}
          </section>
        </div>
      </main>
    </>
  );
}

function SpotifyDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 truncate text-sm font-semibold text-zinc-100">
        {value}
      </p>
    </div>
  );
}

function formatProgress(progressMs: number, durationMs: number) {
  if (!durationMs) return "0:00";

  return `${formatDuration(progressMs)} / ${formatDuration(durationMs)}`;
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}
