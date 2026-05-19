import { NextResponse } from "next/server";
import { clearSpotifyTokenCookies } from "../_cookies";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  clearSpotifyTokenCookies(response.cookies);

  return response;
}
