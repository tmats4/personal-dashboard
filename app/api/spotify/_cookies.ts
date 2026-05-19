import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { SpotifyTokenResponse } from "@/lib/spotify";

const ACCESS_TOKEN_COOKIE = "spotify_access_token";
const REFRESH_TOKEN_COOKIE = "spotify_refresh_token";
const EXPIRES_AT_COOKIE = "spotify_expires_at";
const AUTH_STATE_COOKIE = "spotify_auth_state";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export const spotifyCookieNames = {
  accessToken: ACCESS_TOKEN_COOKIE,
  refreshToken: REFRESH_TOKEN_COOKIE,
  expiresAt: EXPIRES_AT_COOKIE,
  authState: AUTH_STATE_COOKIE,
};

export function setSpotifyTokenCookies(
  cookies: ResponseCookies,
  tokens: SpotifyTokenResponse
) {
  const expiresAt = Date.now() + tokens.expires_in * 1000;

  cookies.set(ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...cookieOptions,
    maxAge: tokens.expires_in,
  });
  cookies.set(EXPIRES_AT_COOKIE, String(expiresAt), {
    ...cookieOptions,
    maxAge: tokens.expires_in,
  });

  if (tokens.refresh_token) {
    cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export function clearSpotifyTokenCookies(cookies: ResponseCookies) {
  cookies.delete(ACCESS_TOKEN_COOKIE);
  cookies.delete(REFRESH_TOKEN_COOKIE);
  cookies.delete(EXPIRES_AT_COOKIE);
}

export function authStateCookieOptions() {
  return {
    ...cookieOptions,
    maxAge: 60 * 5,
  };
}
