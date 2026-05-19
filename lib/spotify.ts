export const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
];

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

export type SpotifyConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type SpotifyPlayerState = {
  isConnected: boolean;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  deviceName: string | null;
  item: {
    title: string;
    subtitle: string;
    imageUrl: string | null;
    externalUrl: string | null;
  } | null;
};

type SpotifyPlaybackResponse = {
  is_playing?: boolean;
  progress_ms?: number | null;
  device?: {
    name?: string;
  };
  item?: {
    type?: string;
    name?: string;
    duration_ms?: number;
    external_urls?: {
      spotify?: string;
    };
    album?: {
      images?: Array<{
        url: string;
      }>;
    };
    artists?: Array<{
      name: string;
    }>;
    show?: {
      name?: string;
      images?: Array<{
        url: string;
      }>;
    };
  } | null;
};

export function getSpotifyConfig(): SpotifyConfig {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ??
    "http://127.0.0.1:3000/api/spotify/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify client environment variables.");
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

export function getSpotifyAuthHeader(config: SpotifyConfig) {
  return `Basic ${Buffer.from(
    `${config.clientId}:${config.clientSecret}`
  ).toString("base64")}`;
}

export function getSpotifyAuthorizeUrl(state: string) {
  const config = getSpotifyConfig();
  const url = new URL("https://accounts.spotify.com/authorize");

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("scope", SPOTIFY_SCOPES.join(" "));
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);

  return url;
}

export async function exchangeCodeForTokens(code: string) {
  const config = getSpotifyConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: getSpotifyAuthHeader(config),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Spotify token exchange failed.");
  }

  return (await response.json()) as SpotifyTokenResponse;
}

export async function refreshSpotifyAccessToken(refreshToken: string) {
  const config = getSpotifyConfig();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: getSpotifyAuthHeader(config),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Spotify token refresh failed.");
  }

  return (await response.json()) as SpotifyTokenResponse;
}

export function mapSpotifyPlayback(
  data: SpotifyPlaybackResponse | null
): SpotifyPlayerState {
  if (!data?.item) {
    return {
      isConnected: true,
      isPlaying: Boolean(data?.is_playing),
      progressMs: data?.progress_ms ?? 0,
      durationMs: 0,
      deviceName: data?.device?.name ?? null,
      item: null,
    };
  }

  const item = data.item;
  const isEpisode = item.type === "episode";
  const imageUrl = isEpisode
    ? item.show?.images?.[0]?.url ?? null
    : item.album?.images?.[0]?.url ?? null;
  const subtitle = isEpisode
    ? item.show?.name ?? "Podcast"
    : item.artists?.map((artist) => artist.name).join(", ") ?? "Unknown artist";

  return {
    isConnected: true,
    isPlaying: Boolean(data.is_playing),
    progressMs: data.progress_ms ?? 0,
    durationMs: item.duration_ms ?? 0,
    deviceName: data.device?.name ?? null,
    item: {
      title: item.name ?? "Untitled",
      subtitle,
      imageUrl,
      externalUrl: item.external_urls?.spotify ?? null,
    },
  };
}
