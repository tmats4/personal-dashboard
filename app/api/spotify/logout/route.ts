import { NextResponse } from "next/server";
import { clearSpotifyTokenCookies } from "../_cookies";

export async function GET() {
  const response = NextResponse.redirect("http://127.0.0.1:3000/spotify");

  clearSpotifyTokenCookies(response.cookies);

  return response;
}

export async function POST() {
  const response = NextResponse.json({ ok: true });

  clearSpotifyTokenCookies(response.cookies);

  return response;
}
