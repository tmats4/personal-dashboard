import { NextRequest, NextResponse } from "next/server";
import { setSpotifyTokenCookies } from "../../_cookies";
import { getValidSpotifyAccessToken } from "../../_tokens";

type SpotifyControlAction = "play" | "pause" | "next" | "previous";

const actionConfig: Record<
  SpotifyControlAction,
  { method: "PUT" | "POST"; endpoint: string }
> = {
  play: {
    method: "PUT",
    endpoint: "https://api.spotify.com/v1/me/player/play",
  },
  pause: {
    method: "PUT",
    endpoint: "https://api.spotify.com/v1/me/player/pause",
  },
  next: {
    method: "POST",
    endpoint: "https://api.spotify.com/v1/me/player/next",
  },
  previous: {
    method: "POST",
    endpoint: "https://api.spotify.com/v1/me/player/previous",
  },
};

function isSpotifyControlAction(action: unknown): action is SpotifyControlAction {
  return (
    typeof action === "string" &&
    Object.prototype.hasOwnProperty.call(actionConfig, action)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { action?: unknown };

    if (!isSpotifyControlAction(body.action)) {
      return NextResponse.json(
        { message: "Unsupported Spotify action." },
        { status: 400 }
      );
    }

    const tokenResult = await getValidSpotifyAccessToken();

    if (!tokenResult) {
      return NextResponse.json(
        { message: "Spotify is not connected." },
        { status: 401 }
      );
    }

    const control = actionConfig[body.action];
    const spotifyResponse = await fetch(control.endpoint, {
      method: control.method,
      headers: {
        Authorization: `Bearer ${tokenResult.accessToken}`,
      },
    });

    if (!spotifyResponse.ok && spotifyResponse.status !== 204) {
      return NextResponse.json(
        {
          message:
            spotifyResponse.status === 403
              ? "Spotify playback controls require an active Premium playback device."
              : "Spotify playback control failed.",
        },
        { status: spotifyResponse.status }
      );
    }

    const response = NextResponse.json({ ok: true });

    if (tokenResult.refreshedTokens) {
      setSpotifyTokenCookies(response.cookies, tokenResult.refreshedTokens);
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: "Spotify playback control failed." },
      { status: 500 }
    );
  }
}
