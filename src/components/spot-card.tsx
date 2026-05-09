"use client";

import Link from "next/link";
import {
  Baby,
  CloudRain,
  Car,
  MapPin,
  Clock,
  Heart,
  Wind,
} from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  CITY_LABELS,
  type Spot,
} from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites-store";

export function SpotCard({ spot }: { spot: Spot }) {
  const has = useFavorites((s) => s.ids.includes(spot.id));
  const toggle = useFavorites((s) => s.toggle);
  const hydrated = useFavorites((s) => s.hydrated);

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(spot.id);
  };

  const categoryColor = CATEGORY_COLORS[spot.category];

  return (
    <Link
      href={`/spots/${spot.id}`}
      className="group relative block rounded-2xl bg-card border border-border shadow-soft hover:shadow-pop hover:-translate-y-0.5 transition-all overflow-hidden"
    >
      <div className="relative h-32 overflow-hidden bg-sand-light">
        {spot.imageUrl ? (
          <img
            src={spot.imageUrl}
            alt={spot.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(at 30% 20%, ${categoryColor}33 0%, transparent 60%), radial-gradient(at 80% 80%, ${categoryColor}22 0%, transparent 50%), linear-gradient(135deg, ${categoryColor}10 0%, ${categoryColor}05 100%)`,
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0 grid place-items-center text-6xl transition-transform duration-300 group-hover:scale-110"
              aria-hidden
            >
              {spot.imageEmoji ?? CATEGORY_EMOJIS[spot.category]}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={has ? "お気に入りから削除" : "お気に入りに追加"}
          className={cn(
            "absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full",
            "glass-strong shadow-soft active:scale-95 transition-all",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              hydrated && has
                ? "fill-hibiscus text-hibiscus"
                : "text-charcoal/60",
            )}
          />
        </button>

        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass-strong text-[11px] font-bold text-charcoal"
        >
          <span
            aria-hidden
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: categoryColor }}
          />
          {CATEGORY_LABELS[spot.category]}
        </span>
      </div>

      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="font-bold text-charcoal leading-tight text-balance tracking-tight">
            {spot.name}
          </h3>
          <p className="text-xs text-charcoal/70 mt-1 line-clamp-1">
            {spot.shortDescription ?? spot.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {spot.features.hasNursingRoom && (
            <FeaturePill icon={<Baby className="w-3 h-3" />}>
              授乳室
            </FeaturePill>
          )}
          {spot.features.strollerFriendly && (
            <FeaturePill icon={<Wind className="w-3 h-3" />}>
              ベビーカー
            </FeaturePill>
          )}
          {spot.features.rainOk && (
            <FeaturePill icon={<CloudRain className="w-3 h-3" />}>
              雨OK
            </FeaturePill>
          )}
          {spot.features.hasParking && spot.features.parkingFree && (
            <FeaturePill icon={<Car className="w-3 h-3" />}>
              駐車場無料
            </FeaturePill>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-charcoal/65 pt-1">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {CITY_LABELS[spot.city]}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(spot.durationMin)}
          </span>
          {spot.price?.free ? (
            <span className="ml-auto text-primary-700 font-bold">無料</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function FeaturePill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 text-primary-800 text-[10.5px] font-medium border border-primary-100">
      {icon}
      {children}
    </span>
  );
}
