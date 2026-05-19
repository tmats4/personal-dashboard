import { cookies } from "next/headers";
import {
  refreshSpotifyAccessToken,
  SpotifyTokenResponse,
} from "@/lib/spotify";
import { spotifyCookieNames } from "./_cookies";

export type SpotifyAccessTokenResult = {
  accessToken: string;
  refreshedTokens: SpotifyTokenResponse | null;
};

export async function getValidSpotifyAccessToken(): Promise<SpotifyAccessTokenResult | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(spotifyCookieNames.accessToken)?.value;
  const refreshToken = cookieStore.get(spotifyCookieNames.refreshToken)?.value;
  const expiresAt = Number(cookieStore.get(spotifyCookieNames.expiresAt)?.value);
  const isAccessTokenFresh = accessToken && expiresAt && Date.now() < expiresAt - 60000;

  if (isAccessTokenFresh) {
    return {
      accessToken,
      refreshedTokens: null,
    };
  }

  if (!refreshToken) return null;

  const refreshedTokens = await refreshSpotifyAccessToken(refreshToken);

  return {
    accessToken: refreshedTokens.access_token,
    refreshedTokens,
  };
}
