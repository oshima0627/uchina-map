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
import { Badge } from "@/components/ui/badge";
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

  return (
    <Link
      href={`/spots/${spot.id}`}
      className="group block rounded-2xl border border-border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99]"
    >
      <div
        className="relative h-32 flex items-center justify-center text-6xl"
        style={{
          background: `linear-gradient(135deg, ${CATEGORY_COLORS[spot.category]}33 0%, ${CATEGORY_COLORS[spot.category]}11 100%)`,
        }}
      >
        <span aria-hidden>{spot.imageEmoji ?? CATEGORY_EMOJIS[spot.category]}</span>
        <button
          type="button"
          onClick={onToggle}
          aria-label={has ? "お気に入りから削除" : "お気に入りに追加"}
          className={cn(
            "absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full",
            "bg-white/95 backdrop-blur-sm shadow-sm border border-border",
            "transition-transform active:scale-95",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              hydrated && has ? "fill-hibiscus text-hibiscus" : "text-charcoal/75",
            )}
          />
        </button>
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
          style={{ background: CATEGORY_COLORS[spot.category] }}
        >
          {CATEGORY_LABELS[spot.category]}
        </span>
      </div>

      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="font-bold text-charcoal leading-tight text-balance">
            {spot.name}
          </h3>
          <p className="text-xs text-charcoal/75 mt-1 line-clamp-1">
            {spot.shortDescription ?? spot.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {spot.features.hasNursingRoom && (
            <Badge variant="primary">
              <Baby className="w-3 h-3" />授乳室
            </Badge>
          )}
          {spot.features.strollerFriendly && (
            <Badge variant="primary">
              <Wind className="w-3 h-3" />ベビーカーOK
            </Badge>
          )}
          {spot.features.rainOk && (
            <Badge variant="sand">
              <CloudRain className="w-3 h-3" />雨OK
            </Badge>
          )}
          {spot.features.hasParking && spot.features.parkingFree && (
            <Badge variant="muted">
              <Car className="w-3 h-3" />駐車場無料
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-charcoal/75 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {CITY_LABELS[spot.city]}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(spot.durationMin)}
          </span>
          {spot.price?.free ? (
            <span className="text-primary-700 font-medium">無料</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
