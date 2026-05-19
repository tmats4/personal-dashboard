import { NextResponse } from "next/server";
import { mapSpotifyPlayback } from "@/lib/spotify";
import { setSpotifyTokenCookies } from "../_cookies";
import { getValidSpotifyAccessToken } from "../_tokens";

export async function GET() {
  try {
    const tokenResult = await getValidSpotifyAccessToken();

    if (!tokenResult) {
      return NextResponse.json(
        { isConnected: false, message: "Spotify is not connected." },
        { status: 401 }
      );
    }

    const spotifyResponse = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${tokenResult.accessToken}`,
      },
      cache: "no-store",
    });

    if (spotifyResponse.status === 204) {
      const response = NextResponse.json(mapSpotifyPlayback(null));

      if (tokenResult.refreshedTokens) {
        setSpotifyTokenCookies(response.cookies, tokenResult.refreshedTokens);
      }

      return response;
    }

    if (!spotifyResponse.ok) {
      return NextResponse.json(
        { isConnected: true, message: "Could not load Spotify playback." },
        { status: spotifyResponse.status }
      );
    }

    const data = await spotifyResponse.json();
    const response = NextResponse.json(mapSpotifyPlayback(data));

    if (tokenResult.refreshedTokens) {
      setSpotifyTokenCookies(response.cookies, tokenResult.refreshedTokens);
    }

    return response;
  } catch {
    return NextResponse.json(
      { isConnected: true, message: "Could not load Spotify playback." },
      { status: 500 }
    );
  }
}
