"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { SpotCard } from "@/components/spot-card";
import { Button } from "@/components/ui/button";
import { SPOTS } from "@/data/spots";
import {
  AGE_LABELS,
  AGE_TAGS,
  CITIES,
  CITY_LABELS,
  type AgeTag,
  type City,
  type Spot,
} from "@/lib/types";
import type { WeatherSummary } from "@/lib/weather";
import { cn } from "@/lib/utils";

type Duration = "1h" | "halfday" | "fullday";

const DURATION_LABELS: Record<Duration, string> = {
  "1h": "〜1時間",
  halfday: "半日（〜4時間）",
  fullday: "1日",
};

const DURATION_MAX: Record<Duration, number> = {
  "1h": 60,
  halfday: 240,
  fullday: 600,
};

export function RecommendForm({ weather }: { weather: WeatherSummary | null }) {
  const [age, setAge] = useState<AgeTag>("1-3");
  const [duration, setDuration] = useState<Duration>("halfday");
  const [city, setCity] = useState<City | "any">("any");
  const [showResults, setShowResults] = useState(false);

  const recommendations = useMemo<Spot[]>(() => {
    if (!showResults) return [];
    const maxDuration = DURATION_MAX[duration];

    const scored = SPOTS.map((s) => {
      let score = 0;

      if (s.ageTags.includes(age)) score += 5;
      else return null;

      if (s.durationMin <= maxDuration) score += 3;
      else if (s.durationMin <= maxDuration + 60) score += 1;
      else return null;

      if (city !== "any" && s.city !== city) score -= 2;
      else if (city !== "any" && s.city === city) score += 4;

      if (weather?.isTyphoonRisk) {
        if (s.features.typhoonOk) score += 10;
        else return null;
      } else if (weather?.isRainy) {
        if (s.features.rainOk || s.features.isIndoor) score += 8;
        else score -= 5;
      } else if (weather?.isHot) {
        if (s.features.isIndoor) score += 4;
        if (s.category === "beach") score += 3;
        if (s.category === "aquarium") score += 2;
      }

      if (duration === "1h") {
        if (s.durationMin <= 60) score += 2;
      } else if (duration === "fullday") {
        if (s.durationMin >= 180) score += 2;
      }

      if (age === "0") {
        if (s.features.hasNursingRoom) score += 3;
        if (s.features.hasDiaperTable) score += 2;
        if (s.features.strollerFriendly) score += 2;
      }

      score += Math.random() * 0.5;
      return { spot: s, score };
    }).filter((x): x is { spot: Spot; score: number } => x !== null);

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((x) => x.spot);
  }, [showResults, age, duration, city, weather]);

  const reasons = useMemo(() => {
    const list: string[] = [];
    if (weather?.isTyphoonRisk) list.push("台風レベルの強風 → 大型屋内施設を優先");
    else if (weather?.isRainy) list.push("雨予報 → 屋内・雨OKスポットを優先");
    else if (weather?.isHot) list.push("暑い日 → 屋内 / 水遊びスポットを優先");
    if (age === "0") list.push("0歳 → 授乳室・オムツ替え台ありを優先");
    list.push(`滞在時間「${DURATION_LABELS[duration]}」に収まる施設を選択`);
    return list;
  }, [weather, age, duration]);

  return (
    <div>
      <section className="rounded-2xl bg-white border border-border p-4 md:p-5 mb-6">
        <FieldGroup label="子の年齢">
          <ChipGroup
            options={AGE_TAGS.map((a) => ({ value: a, label: AGE_LABELS[a] }))}
            selected={age}
            onSelect={setAge}
          />
        </FieldGroup>
        <FieldGroup label="滞在可能時間">
          <ChipGroup
            options={(["1h", "halfday", "fullday"] as Duration[]).map((d) => ({
              value: d,
              label: DURATION_LABELS[d],
            }))}
            selected={duration}
            onSelect={setDuration}
          />
        </FieldGroup>
        <FieldGroup label="エリア">
          <ChipGroup
            options={[
              { value: "any" as const, label: "どこでも" },
              ...CITIES.map((c) => ({ value: c, label: CITY_LABELS[c] })),
            ]}
            selected={city}
            onSelect={setCity}
          />
        </FieldGroup>

        <Button
          size="lg"
          variant="hibiscus"
          className="w-full mt-3"
          onClick={() => setShowResults(true)}
        >
          <Sparkles className="w-5 h-5" />
          おすすめを見る
        </Button>
      </section>

      {showResults && (
        <section>
          <div className="rounded-2xl bg-primary-50 border border-primary-200 p-4 mb-4">
            <h2 className="text-sm font-bold text-primary-800 mb-2">
              レコメンド理由
            </h2>
            <ul className="text-sm text-charcoal/80 space-y-1">
              {reasons.map((r) => (
                <li key={r}>・{r}</li>
              ))}
            </ul>
          </div>

          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="text-charcoal/70">
                条件にマッチするスポットが見つかりませんでした。
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-3">
                あなたへのおすすめ {recommendations.length}件
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-bold text-charcoal/70 mb-2">{label}</h3>
      {children}
    </div>
  );
}

function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              "inline-flex items-center px-3.5 py-2 rounded-full text-sm font-medium border transition-colors",
              active
                ? "bg-primary text-white border-primary"
                : "bg-white text-charcoal border-border hover:border-primary-300",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
