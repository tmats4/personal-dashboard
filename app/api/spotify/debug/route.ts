import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { spotifyCookieNames } from "../_cookies";

export async function GET() {
  const cookieStore = await cookies();
  const expiresAt = Number(cookieStore.get(spotifyCookieNames.expiresAt)?.value);

  return NextResponse.json({
    env: {
      hasClientId: Boolean(process.env.SPOTIFY_CLIENT_ID),
      hasClientSecret: Boolean(process.env.SPOTIFY_CLIENT_SECRET),
      redirectUri: process.env.SPOTIFY_REDIRECT_URI ?? null,
    },
    cookies: {
      hasAuthState: Boolean(cookieStore.get(spotifyCookieNames.authState)?.value),
      hasAccessToken: Boolean(
        cookieStore.get(spotifyCookieNames.accessToken)?.value
      ),
      hasRefreshToken: Boolean(
        cookieStore.get(spotifyCookieNames.refreshToken)?.value
      ),
      hasExpiresAt: Boolean(expiresAt),
      isAccessTokenExpired: expiresAt ? Date.now() >= expiresAt : null,
    },
  });
}
