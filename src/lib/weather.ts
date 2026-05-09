export type WeatherSummary = {
  tempMaxC: number;
  precipitationMm: number;
  windMaxMs: number;
  weatherCode: number;
  isRainy: boolean;
  isHot: boolean;
  isTyphoonRisk: boolean;
  description: string;
  emoji: string;
};

export const NAHA_LAT = 26.2124;
export const NAHA_LNG = 127.6809;

const WEATHER_CODE_MAP: Record<number, { label: string; emoji: string }> = {
  0: { label: "快晴", emoji: "☀️" },
  1: { label: "晴れ", emoji: "🌤️" },
  2: { label: "薄曇り", emoji: "⛅" },
  3: { label: "曇り", emoji: "☁️" },
  45: { label: "霧", emoji: "🌫️" },
  48: { label: "霧", emoji: "🌫️" },
  51: { label: "霧雨", emoji: "🌦️" },
  53: { label: "霧雨", emoji: "🌦️" },
  55: { label: "霧雨", emoji: "🌦️" },
  61: { label: "雨", emoji: "🌧️" },
  63: { label: "雨", emoji: "🌧️" },
  65: { label: "強い雨", emoji: "🌧️" },
  71: { label: "雪", emoji: "🌨️" },
  80: { label: "にわか雨", emoji: "🌦️" },
  81: { label: "にわか雨", emoji: "🌦️" },
  82: { label: "激しい雨", emoji: "⛈️" },
  95: { label: "雷雨", emoji: "⛈️" },
  96: { label: "雷雨と雹", emoji: "⛈️" },
  99: { label: "激しい雷雨", emoji: "⛈️" },
};

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchTodayWeather(
  lat: number = NAHA_LAT,
  lng: number = NAHA_LNG,
): Promise<WeatherSummary> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set(
    "daily",
    "temperature_2m_max,precipitation_sum,wind_speed_10m_max,weather_code",
  );
  url.searchParams.set("timezone", "Asia/Tokyo");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("wind_speed_unit", "ms");

  // Up to 3 attempts with exponential backoff (0ms, 400ms, 1200ms).
  const maxAttempts = 3;
  let lastError: unknown = null;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 400 * 3 ** (attempt - 1)));
    }
    try {
      const res = await fetchWithTimeout(url.toString(), 8000);
      if (!res.ok) {
        if (res.status >= 400 && res.status < 500) {
          throw new Error(`weather api: ${res.status}`);
        }
        lastError = new Error(`weather api: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const tempMax = data.daily.temperature_2m_max[0] as number;
      const precip = data.daily.precipitation_sum[0] as number;
      const windMax = data.daily.wind_speed_10m_max[0] as number;
      const code = data.daily.weather_code[0] as number;
      const meta = WEATHER_CODE_MAP[code] ?? { label: "不明", emoji: "🌡️" };

      return {
        tempMaxC: tempMax,
        precipitationMm: precip,
        windMaxMs: windMax,
        weatherCode: code,
        isRainy:
          precip >= 1 ||
          [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(code),
        isHot: tempMax >= 30,
        isTyphoonRisk: windMax >= 17,
        description: meta.label,
        emoji: meta.emoji,
      };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("weather api failed");
}

const CACHE_KEY = "uchina-map.weather.v1";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const STALE_TTL_MS = 24 * 60 * 60 * 1000; // last-resort fallback (24h)

type CacheEntry = { ts: number; data: WeatherSummary };

function readCache(): CacheEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function writeCache(data: WeatherSummary) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), data } satisfies CacheEntry),
    );
  } catch {
    // quota / disabled storage — non-fatal
  }
}

export async function getCachedTodayWeather(): Promise<WeatherSummary> {
  const cached = readCache();
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }
  try {
    const fresh = await fetchTodayWeather();
    writeCache(fresh);
    return fresh;
  } catch (err) {
    // Stale-while-error: serve a recent-ish cached value if available.
    if (cached && Date.now() - cached.ts < STALE_TTL_MS) {
      return cached.data;
    }
    throw err;
  }
}
