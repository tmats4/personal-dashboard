import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAuthorizeUrl } from "@/lib/spotify";
import {
  authStateCookieOptions,
  spotifyCookieNames,
} from "../_cookies";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const requestHost = request.headers.get("host") ?? "";

    if (requestHost.startsWith("localhost")) {
      requestUrl.hostname = "127.0.0.1";
      return NextResponse.redirect(requestUrl);
    }

    const state = crypto.randomUUID();
    const response = NextResponse.redirect(getSpotifyAuthorizeUrl(state));

    response.cookies.set(
      spotifyCookieNames.authState,
      state,
      authStateCookieOptions()
    );

    return response;
  } catch {
    return NextResponse.redirect(new URL("/spotify?spotify=config", request.url));
  }
}
