"use client";

import { useEffect, useMemo, useState } from "react";

const HAMILTON_COORDINATES = {
  latitude: 43.2557,
  longitude: -79.8711,
};

const WEATHER_URL = new URL("https://api.open-meteo.com/v1/forecast");
WEATHER_URL.searchParams.set("latitude", String(HAMILTON_COORDINATES.latitude));
WEATHER_URL.searchParams.set("longitude", String(HAMILTON_COORDINATES.longitude));
WEATHER_URL.searchParams.set(
  "current",
  [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "precipitation",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
  ].join(",")
);
WEATHER_URL.searchParams.set(
  "daily",
  [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max",
  ].join(",")
);
WEATHER_URL.searchParams.set("temperature_unit", "celsius");
WEATHER_URL.searchParams.set("wind_speed_unit", "kmh");
WEATHER_URL.searchParams.set("precipitation_unit", "mm");
WEATHER_URL.searchParams.set("timezone", "America/Toronto");
WEATHER_URL.searchParams.set("forecast_days", "5");

type WeatherApiResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

export type DailyWeather = {
  date: string;
  condition: string;
  high: number;
  low: number;
  precipitationChance: number;
};

export type WeatherData = {
  location: string;
  updatedAt: string;
  condition: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  daily: DailyWeather[];
};

function getWeatherCondition(code: number) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Mixed conditions";
}

function formatWeatherDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function toWeatherData(data: WeatherApiResponse): WeatherData {
  return {
    location: "Hamilton, Ontario",
    updatedAt: data.current.time,
    condition: getWeatherCondition(data.current.weather_code),
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    daily: data.daily.time.map((date, index) => ({
      date: formatWeatherDate(date),
      condition: getWeatherCondition(data.daily.weather_code[index]),
      high: Math.round(data.daily.temperature_2m_max[index]),
      low: Math.round(data.daily.temperature_2m_min[index]),
      precipitationChance: data.daily.precipitation_probability_max[index],
    })),
  };
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weatherUrl = useMemo(() => WEATHER_URL.toString(), []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(weatherUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Weather request failed.");
        }

        const data = (await response.json()) as WeatherApiResponse;
        setWeather(toWeatherData(data));
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError("Could not load Hamilton weather right now.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [weatherUrl]);

  return {
    weather,
    isLoading,
    error,
  };
}
