"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { SpotCard } from "@/components/spot-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPOTS } from "@/data/spots";
import {
  AGE_LABELS,
  AGE_TAGS,
  CATEGORIES,
  CATEGORY_LABELS,
  CITIES,
  CITY_LABELS,
  FILTER_FEATURES,
  FILTER_FEATURE_LABELS,
  type AgeTag,
  type Category,
  type City,
  type FilterFeature,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function SpotsBrowser() {
  const router = useRouter();
  const params = useSearchParams();

  const [openFilters, setOpenFilters] = useState(false);

  const selCity = (params.get("city") as City | null) ?? null;
  const selCategory = (params.get("category") as Category | null) ?? null;
  const selAge = (params.get("age") as AgeTag | null) ?? null;
  const selFeature = (params.get("feature") as FilterFeature | null) ?? null;
  const q = params.get("q") ?? "";

  const setParam = (key: string, value: string | null) => {
    const sp = new URLSearchParams(params.toString());
    if (value === null || value === "") sp.delete(key);
    else sp.set(key, value);
    router.replace(`/spots?${sp.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    return SPOTS.filter((s) => {
      if (selCity && s.city !== selCity) return false;
      if (selCategory && s.category !== selCategory) return false;
      if (selAge && !s.ageTags.includes(selAge)) return false;
      if (selFeature && !s.features[selFeature]) return false;
      if (q) {
        const query = q.toLowerCase();
        const haystack = [
          s.name,
          s.nameKana ?? "",
          s.description,
          s.address,
          ...s.highlights,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [selCity, selCategory, selAge, selFeature, q]);

  const activeCount = [selCity, selCategory, selAge, selFeature].filter(Boolean).length;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
        <input
          type="search"
          placeholder="施設名・キーワードで検索"
          defaultValue={q}
          onChange={(e) => setParam("q", e.target.value || null)}
          className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-border focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-sm"
        />
      </div>

      {/* Filter chips toggle */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          size="sm"
          variant={openFilters ? "primary" : "outline"}
          onClick={() => setOpenFilters((v) => !v)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          絞り込み
          {activeCount > 0 && (
            <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-hibiscus text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.replace("/spots", { scroll: false })}
          >
            <X className="w-4 h-4" /> クリア
          </Button>
        )}
      </div>

      {openFilters && (
        <div className="rounded-2xl bg-white border border-border p-4 mb-4 space-y-4">
          <FilterRow
            label="エリア"
            options={CITIES.map((c) => ({ value: c, label: CITY_LABELS[c] }))}
            selected={selCity}
            onSelect={(v) => setParam("city", v)}
          />
          <FilterRow
            label="カテゴリ"
            options={CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))}
            selected={selCategory}
            onSelect={(v) => setParam("category", v)}
          />
          <FilterRow
            label="対象年齢"
            options={AGE_TAGS.map((a) => ({ value: a, label: AGE_LABELS[a] }))}
            selected={selAge}
            onSelect={(v) => setParam("age", v)}
          />
          <FilterRow
            label="設備"
            options={FILTER_FEATURES.map((f) => ({
              value: f,
              label: FILTER_FEATURE_LABELS[f],
            }))}
            selected={selFeature}
            onSelect={(v) => setParam("feature", v)}
          />
        </div>
      )}

      {/* Active filter pills (always visible when set) */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selCity && (
            <FilterPill label={CITY_LABELS[selCity]} onRemove={() => setParam("city", null)} />
          )}
          {selCategory && (
            <FilterPill label={CATEGORY_LABELS[selCategory]} onRemove={() => setParam("category", null)} />
          )}
          {selAge && (
            <FilterPill label={AGE_LABELS[selAge]} onRemove={() => setParam("age", null)} />
          )}
          {selFeature && (
            <FilterPill
              label={FILTER_FEATURE_LABELS[selFeature]}
              onRemove={() => setParam("feature", null)}
            />
          )}
        </div>
      )}

      <p className="text-sm text-charcoal/60 mb-3">
        {filtered.length}件のスポット
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-charcoal/70 font-medium">
            条件に合うスポットが見つかりませんでした。
          </p>
          <p className="text-sm text-charcoal/50 mt-1">
            フィルターを変更してお試しください。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T | null;
  onSelect: (v: T | null) => void;
}) {
  return (
    <div>
      <h3 className="text-xs font-bold text-charcoal/70 mb-2">{label}</h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(active ? null : opt.value)}
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
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
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="primary" className="pr-1">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${label} を解除`}
        className="ml-1 grid place-items-center w-4 h-4 rounded-full hover:bg-primary-200"
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
}
