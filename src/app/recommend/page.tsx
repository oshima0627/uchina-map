import { fetchTodayWeather, type WeatherSummary } from "@/lib/weather";
import { RecommendForm } from "./recommend-form";

export const metadata = {
  title: "今日どこ行く？",
  description:
    "天気・年齢・滞在時間に応じて、今日ぴったりのお出かけ先をレコメンド。",
};

export const revalidate = 1800;

export default async function RecommendPage() {
  let weather: WeatherSummary | null = null;
  try {
    weather = await fetchTodayWeather();
  } catch {
    weather = null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-hibiscus/10 text-hibiscus text-xs font-bold">
          ✨ AIレコメンド
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-charcoal mt-2">
          今日どこ行く？
        </h1>
        <p className="text-sm text-charcoal/75 mt-1">
          条件を選ぶと、今日の天気を加味したおすすめスポットが見つかります。
        </p>
      </header>

      {weather && (
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
      )}

      <RecommendForm weather={weather} />
    </div>
  );
}
