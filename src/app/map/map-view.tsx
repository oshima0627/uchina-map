"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import {
  Filter,
  X,
  TreePine,
  Gamepad2,
  Fish,
  Waves,
  Utensils,
  ShoppingBag,
  BookOpen,
  Droplets,
  Baby,
  CloudRain,
  Car,
  type LucideIcon,
} from "lucide-react";
import { SPOTS } from "@/data/spots";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type Category,
  type Spot,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  park: TreePine,
  indoor: Gamepad2,
  aquarium: Fish,
  beach: Waves,
  restaurant: Utensils,
  shopping: ShoppingBag,
  learning: BookOpen,
  onsen: Droplets,
};

// Inline SVG paths for non-React markers (must mirror lucide-react icons above).
const CATEGORY_MARKER_SVG: Record<Category, string> = {
  park: '<path d="M17 14v8"/><path d="m17 22-3-1-3 1"/><path d="M19 4.5C19 6.985 16.985 9 14.5 9h-1A4.5 4.5 0 0 1 9 4.5"/><path d="M9.594 11.413A4 4 0 0 0 6 14h11a4 4 0 0 0-3.595-2.587"/><path d="M9.5 14a4.5 4.5 0 1 1-3-7.788"/><path d="M11 4.063V3"/>',
  indoor: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/>',
  aquarium: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.5 5.5 0 0 1-2.4-6.6"/>',
  beach: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  restaurant: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  shopping: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  learning: '<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
  onsen: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
};

const SOUTH_OKINAWA_CENTER: [number, number] = [127.7, 26.18];

// Multi-CDN raster source. CARTO's free voyager raster tiles are reliable,
// but we list multiple subdomains so MapLibre rotates them — important when
// a single host is blocked by mobile carriers / captive portals.
const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    base: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxzoom: 19,
    },
  },
  layers: [{ id: "base", type: "raster", source: "base" }],
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
  const [mapError, setMapError] = useState<string | null>(null);

  const spotsToShow = useMemo(
    () => SPOTS.filter((s) => enabledCats.has(s.category)),
    [enabledCats],
  );

  // initialize map
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: MAP_STYLE,
        center: SOUTH_OKINAWA_CENTER,
        zoom: 11,
        attributionControl: { compact: true },
        // Some iOS Safari versions reject WebGL2; fall back to WebGL1.
        // (no-op when WebGL2 is available)
        antialias: false,
      });
    } catch (err) {
      console.error("[MapView] failed to init MapLibre:", err);
      setMapError(
        err instanceof Error ? err.message : "地図の初期化に失敗しました。",
      );
      return;
    }

    map.on("error", (e) => {
      console.error("[MapView] runtime error:", e?.error ?? e);
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right",
    );

    // iOS Safari can mount the container before its final size is computed,
    // leaving the map canvas at 0×0. Re-resize whenever the container size
    // changes so the canvas always fills its parent.
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(container);
    // Also force a resize on the next frame in case ResizeObserver fires
    // before the first paint.
    requestAnimationFrame(() => map.resize());

    mapRef.current = map;
    return () => {
      ro.disconnect();
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
        ";border:2.5px solid #fff;box-shadow:0 6px 18px -4px rgba(15,29,51,0.35);display:grid;place-items:center;color:#fff;";
      dot.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        CATEGORY_MARKER_SVG[spot.category] +
        "</svg>";
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
      <div ref={containerRef} className="absolute inset-0 bg-sand-light" />

      {mapError && (
        <div className="absolute inset-0 grid place-items-center p-6 z-10 text-center">
          <div className="rounded-2xl bg-white border border-border shadow-soft p-5 max-w-sm">
            <p className="font-bold text-charcoal text-sm">
              地図を読み込めませんでした
            </p>
            <p className="text-xs text-charcoal/70 mt-1">{mapError}</p>
            <p className="text-[11px] text-charcoal/55 mt-3">
              ネットワーク状況をご確認のうえ、再読み込みしてください。
            </p>
          </div>
        </div>
      )}

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
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
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
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
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
              className="w-24 sm:w-32 shrink-0 grid place-items-center"
              style={{
                background: `linear-gradient(135deg, ${CATEGORY_COLORS[selectedSpot.category]}33, ${CATEGORY_COLORS[selectedSpot.category]}11)`,
              }}
            >
              {(() => {
                const Icon = CATEGORY_ICONS[selectedSpot.category];
                return (
                  <Icon
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    strokeWidth={1.5}
                    style={{ color: CATEGORY_COLORS[selectedSpot.category] }}
                    aria-hidden
                  />
                );
              })()}
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
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-medium">
                    <Baby className="w-3 h-3" strokeWidth={2.25} />
                    授乳室
                  </span>
                )}
                {selectedSpot.features.rainOk && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand text-charcoal text-[10px] font-medium">
                    <CloudRain className="w-3 h-3" strokeWidth={2.25} />
                    雨OK
                  </span>
                )}
                {selectedSpot.features.parkingFree && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand-light text-charcoal text-[10px] font-medium">
                    <Car className="w-3 h-3" strokeWidth={2.25} />
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
