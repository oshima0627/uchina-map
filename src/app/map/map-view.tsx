"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { Filter, X } from "lucide-react";
import { SPOTS } from "@/data/spots";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  type Category,
  type Spot,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SOUTH_OKINAWA_CENTER: [number, number] = [127.7, 26.18];

const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxzoom: 19,
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [enabledCats, setEnabledCats] = useState<Set<Category>>(
    new Set(CATEGORIES),
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const spotsToShow = useMemo(
    () => SPOTS.filter((s) => enabledCats.has(s.category)),
    [enabledCats],
  );

  // initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: SOUTH_OKINAWA_CENTER,
      zoom: 11,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right",
    );

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // sync markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    spotsToShow.forEach((spot) => {
      const color = CATEGORY_COLORS[spot.category];
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", spot.name);
      el.style.cssText =
        "width:38px;height:38px;border-radius:50%;border:0;background:transparent;display:grid;place-items:center;cursor:pointer;padding:0;line-height:1;box-sizing:border-box;";

      const ring = document.createElement("span");
      ring.style.cssText =
        "position:absolute;inset:0;border-radius:50%;background:" +
        color +
        "33;animation:pulse-ring 2.4s cubic-bezier(0.2,0.7,0.2,1) infinite;pointer-events:none;will-change:transform;";
      const dot = document.createElement("span");
      dot.style.cssText =
        "position:relative;width:32px;height:32px;border-radius:50%;background:" +
        color +
        ";border:2.5px solid #fff;box-shadow:0 6px 18px -4px rgba(15,29,51,0.35);display:grid;place-items:center;font-size:17px;color:#fff;";
      dot.textContent = spot.imageEmoji ?? CATEGORY_EMOJIS[spot.category];
      el.appendChild(ring);
      el.appendChild(dot);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedSpot(spot);
        map.flyTo({ center: [spot.lng, spot.lat], zoom: 14, speed: 0.8 });
      });
      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
        subpixelPositioning: true,
      })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [spotsToShow]);

  const toggleCategory = (cat: Category) => {
    setEnabledCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top filter bar */}
      <div className="absolute top-3 left-3 right-16 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-semibold shadow-pop transition",
            filterOpen
              ? "bg-charcoal text-white"
              : "glass-strong text-charcoal hover:bg-white",
          )}
        >
          <Filter className="w-4 h-4" />
          カテゴリ
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-white/30 text-current text-[10px] font-black">
            {enabledCats.size}
          </span>
        </button>
        <div className="rounded-full glass-strong shadow-pop px-3 h-9 flex items-center text-[11px] font-semibold text-charcoal">
          {spotsToShow.length}件表示中
        </div>
      </div>

      {filterOpen && (
        <div className="absolute top-14 left-3 z-10 max-w-[calc(100%-1.5rem)] glass-strong rounded-2xl shadow-pop p-3 animate-slide-up">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = enabledCats.has(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    active
                      ? "text-white border-transparent"
                      : "bg-white text-charcoal/70 border-border hover:border-charcoal/30",
                  )}
                  style={
                    active
                      ? { background: CATEGORY_COLORS[cat] }
                      : undefined
                  }
                >
                  <span aria-hidden>{CATEGORY_EMOJIS[cat]}</span>
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spot detail bottom sheet */}
      {selectedSpot && (
        <div className="absolute bottom-3 left-3 right-3 z-10 rounded-2xl glass-strong shadow-float overflow-hidden animate-slide-up">
          <button
            type="button"
            onClick={() => setSelectedSpot(null)}
            aria-label="閉じる"
            className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/80 hover:bg-sand-light z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex">
            <div
              className="w-24 sm:w-32 shrink-0 grid place-items-center text-5xl sm:text-6xl"
              style={{
                background: `linear-gradient(135deg, ${CATEGORY_COLORS[selectedSpot.category]}33, ${CATEGORY_COLORS[selectedSpot.category]}11)`,
              }}
            >
              {selectedSpot.imageEmoji ?? CATEGORY_EMOJIS[selectedSpot.category]}
            </div>
            <div className="flex-1 p-3 min-w-0">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ background: CATEGORY_COLORS[selectedSpot.category] }}
              >
                {CATEGORY_LABELS[selectedSpot.category]}
              </span>
              <h3 className="mt-1.5 font-bold text-charcoal text-balance leading-tight line-clamp-2">
                {selectedSpot.name}
              </h3>
              <p className="text-xs text-charcoal/75 mt-1 line-clamp-2">
                {selectedSpot.shortDescription ?? selectedSpot.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedSpot.features.hasNursingRoom && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-medium">
                    授乳室
                  </span>
                )}
                {selectedSpot.features.rainOk && (
                  <span className="px-2 py-0.5 rounded-full bg-sand text-charcoal text-[10px] font-medium">
                    雨OK
                  </span>
                )}
                {selectedSpot.features.parkingFree && (
                  <span className="px-2 py-0.5 rounded-full bg-sand-light text-charcoal text-[10px] font-medium">
                    駐車場無料
                  </span>
                )}
              </div>
              <Link
                href={`/spots/${selectedSpot.id}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
              >
                詳しく見る →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
