import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/spotify";
import {
  setSpotifyTokenCookies,
  spotifyCookieNames,
} from "../_cookies";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get(spotifyCookieNames.authState)?.value;
  const redirectUrl = new URL("/spotify", request.url);

  if (!code || !state || state !== savedState) {
    redirectUrl.searchParams.set("spotify", "state");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    redirectUrl.searchParams.set("spotify", "connected");
    const response = NextResponse.redirect(redirectUrl);

    setSpotifyTokenCookies(response.cookies, tokens);
    response.cookies.delete(spotifyCookieNames.authState);

    return response;
  } catch {
    redirectUrl.searchParams.set("spotify", "auth");
    redirectUrl.searchParams.set("reason", "token-exchange");
    return NextResponse.redirect(redirectUrl);
  }
}
