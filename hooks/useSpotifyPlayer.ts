"use client";

import { useCallback, useEffect, useState } from "react";
import { SpotifyPlayerState } from "@/lib/spotify";

type SpotifyPlayerResponse =
  | SpotifyPlayerState
  | {
      isConnected: false;
      message?: string;
    };

type SpotifyControlAction = "play" | "pause" | "next" | "previous";

export function useSpotifyPlayer() {
  const [player, setPlayer] = useState<SpotifyPlayerState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isControlling, setIsControlling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPlayer = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    setError(null);

    try {
      const response = await fetch("/api/spotify/player", {
        cache: "no-store",
        signal: controller.signal,
      });

      if (response.status === 401) {
        setIsConnected(false);
        setPlayer(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load Spotify playback.");
      }

      const data = (await response.json()) as SpotifyPlayerResponse;

      if (!data.isConnected) {
        setIsConnected(false);
        setPlayer(null);
        return;
      }

      setIsConnected(true);
      setPlayer(data);
    } catch (playerError) {
      setIsConnected(false);
      setPlayer(null);
      setError(
        playerError instanceof DOMException && playerError.name === "AbortError"
          ? "Spotify check timed out. Reset the connection, then connect again."
          : "Could not load Spotify playback."
      );
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial external API sync for Spotify playback state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshPlayer();

    const intervalId = window.setInterval(refreshPlayer, 30000);

    return () => window.clearInterval(intervalId);
  }, [refreshPlayer]);

  const sendControl = async (action: SpotifyControlAction) => {
    setIsControlling(true);
    setError(null);

    try {
      const response = await fetch("/api/spotify/player/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? "Spotify playback control failed.");
      }

      await refreshPlayer();
    } catch (controlError) {
      setError(
        controlError instanceof Error
          ? controlError.message
          : "Spotify playback control failed."
      );
    } finally {
      setIsControlling(false);
    }
  };

  const logout = async () => {
    await fetch("/api/spotify/logout", {
      method: "POST",
    });
    setIsConnected(false);
    setPlayer(null);
    setError(null);
  };

  return {
    player,
    isConnected,
    isLoading,
    isControlling,
    error,
    refreshPlayer,
    sendControl,
    logout,
  };
}
