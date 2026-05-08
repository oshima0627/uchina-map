"use client";

import { useEffect, useState } from "react";
import { CloudOff } from "lucide-react";
import { RecommendForm } from "./recommend-form";
import { getCachedTodayWeather, type WeatherSummary } from "@/lib/weather";

type WeatherState =
  | { status: "loading" }
  | { status: "ready"; weather: WeatherSummary }
  | { status: "error" };

export function RecommendClient() {
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getCachedTodayWeather()
      .then((weather) => {
        if (!cancelled) setState({ status: "ready", weather });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {state.status === "loading" && <WeatherSkeleton />}

      {state.status === "ready" && <WeatherCard weather={state.weather} />}

      {state.status === "error" && (
        <section className="rounded-2xl bg-sand-light border border-sand-dark/30 p-4 mb-6 flex items-center gap-3">
          <CloudOff className="w-5 h-5 text-charcoal/75" />
          <div>
            <p className="text-sm font-bold text-charcoal">
              天気情報を取得できませんでした
            </p>
            <p className="text-xs text-charcoal/75">
              天気を加味しないままレコメンドします。
            </p>
          </div>
        </section>
      )}

      <RecommendForm
        weather={state.status === "ready" ? state.weather : null}
      />
    </>
  );
}

function WeatherCard({ weather }: { weather: WeatherSummary }) {
  return (
    <section className="rounded-2xl gradient-sand p-4 mb-6 flex items-center gap-4">
      <span className="text-5xl" aria-hidden>
        {weather.emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-charcoal/75">那覇の今日の天気</p>
        <p className="font-bold text-charcoal">
          {weather.description} / 最高 {Math.round(weather.tempMaxC)}℃
        </p>
        <p className="text-xs text-charcoal/75">
          降水量 {weather.precipitationMm.toFixed(1)}mm / 最大風速{" "}
          {weather.windMaxMs.toFixed(1)}m/s
        </p>
      </div>
      <div className="hidden sm:flex flex-col gap-1 text-[11px]">
        {weather.isRainy && (
          <span className="px-2 py-0.5 rounded-full bg-primary text-white font-medium">
            雨予報
          </span>
        )}
        {weather.isHot && (
          <span className="px-2 py-0.5 rounded-full bg-hibiscus text-white font-medium">
            暑い日
          </span>
        )}
        {weather.isTyphoonRisk && (
          <span className="px-2 py-0.5 rounded-full bg-charcoal text-white font-medium">
            強風注意
          </span>
        )}
      </div>
    </section>
  );
}

function WeatherSkeleton() {
  return (
    <section
      aria-hidden
      className="rounded-2xl gradient-sand p-4 mb-6 flex items-center gap-4 animate-pulse"
    >
      <span className="w-12 h-12 rounded-full bg-white/60" />
      <div className="flex-1 min-w-0 space-y-2">
        <span className="block h-3 w-24 rounded bg-white/60" />
        <span className="block h-4 w-40 rounded bg-white/70" />
        <span className="block h-3 w-48 rounded bg-white/50" />
      </div>
    </section>
  );
}
