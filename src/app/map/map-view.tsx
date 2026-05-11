"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type * as LType from "leaflet";
import type {} from "leaflet.markercluster";
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
  LocateFixed,
  Loader2,
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

const SOUTH_OKINAWA_CENTER: LType.LatLngTuple = [26.18, 127.7];
const MIN_ZOOM = 9; // 沖縄本島全体が収まるズーム
const MAX_ZOOM = 18;
const FIT_PADDING: LType.PointTuple = [60, 60];

// Stadia Maps OSM Bright — Google Maps 風のカラフルなスタイル
// 認証: client.stadiamaps.com で `uchina-map.nexeed-lab.com` をドメインホワイトリストに
// 追加済み。Referer 経由で認証されるので API キーは不要（PUBLIC env に出さなくて済む）。
// 開発時の localhost / 127.0.0.1 は Stadia 側で自動許可される。
const TILE_URL =
  "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/" target="_blank" rel="noopener noreferrer">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const clusterRef = useRef<LType.MarkerClusterGroup | null>(null);
  const userMarkerRef = useRef<LType.Marker | null>(null);
  const userAccuracyRef = useRef<LType.Circle | null>(null);
  const leafletRef = useRef<typeof LType | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [enabledCats, setEnabledCats] = useState<Set<Category>>(
    new Set(CATEGORIES),
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const spotsToShow = useMemo(
    () => SPOTS.filter((s) => enabledCats.has(s.category)),
    [enabledCats],
  );

  // initialize map (Leaflet — DOM-based tiles, no WebGL).
  // Dynamically import to avoid SSG `window is not defined` errors.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      // markercluster は L を拡張するモジュール。L 読込後に副作用 import。
      await import("leaflet.markercluster");
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: SOUTH_OKINAWA_CENTER,
        zoom: 11,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer(TILE_URL, {
        maxZoom: MAX_ZOOM,
        attribution: TILE_ATTRIBUTION,
        crossOrigin: true,
      }).addTo(map);

      // ブランド色に合わせたクラスタアイコン。件数で大きさを段階化。
      const cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 48,
        chunkedLoading: true,
        iconCreateFunction: (c) => {
          const n = c.getChildCount();
          const size = n < 10 ? 38 : n < 30 ? 44 : 52;
          return L.divIcon({
            html: `<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:#1d3557;color:#fff;border:3px solid #fff;border-radius:50%;box-shadow:0 6px 18px -4px rgba(15,29,51,0.45);font-weight:800;font-size:${n < 10 ? 13 : 14}px;font-family:Inter,system-ui,sans-serif;line-height:1;">${n}</div>`,
            className: "spot-cluster",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });
        },
      });
      cluster.addTo(map);

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(containerRef.current);
      requestAnimationFrame(() => map.invalidateSize());

      mapRef.current = map;
      clusterRef.current = cluster;
      leafletRef.current = L;
      // Signal that the map is ready so the marker effect can run.
      setMapReady(true);

      cleanup = () => {
        ro.disconnect();
        map.remove();
        mapRef.current = null;
        clusterRef.current = null;
        leafletRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // sync markers when filter changes (or after map becomes ready)
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const L = leafletRef.current;
    const cluster = clusterRef.current;
    if (!map || !L || !cluster) return;
    cluster.clearLayers();

    const markers = spotsToShow.map((spot) => {
      const color = CATEGORY_COLORS[spot.category];
      const html = `
        <div style="position:relative;width:38px;height:38px;display:grid;place-items:center;">
          <span style="position:absolute;inset:0;border-radius:50%;background:${color}33;animation:pulse-ring 2.4s cubic-bezier(0.2,0.7,0.2,1) infinite;pointer-events:none;will-change:transform;"></span>
          <span style="position:relative;width:32px;height:32px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 6px 18px -4px rgba(15,29,51,0.35);display:grid;place-items:center;color:#fff;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CATEGORY_MARKER_SVG[spot.category]}</svg>
          </span>
        </div>
      `;
      const icon = L.divIcon({
        html,
        className: "spot-divicon",
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });
      const marker = L.marker([spot.lat, spot.lng], {
        icon,
        keyboard: true,
        title: spot.name,
        alt: spot.name,
      });
      marker.on("click", () => {
        setSelectedSpot(spot);
        map.flyTo([spot.lat, spot.lng], 14, { duration: 0.6 });
      });
      return marker;
    });
    cluster.addLayers(markers);

    // 表示中マーカーに合わせてズーム/中心を自動調整。
    // 0 件: 何もしない / 1 件: 中央ズーム / 2+ 件: fitBounds
    if (markers.length === 1) {
      map.flyTo(markers[0].getLatLng(), 14, { duration: 0.4 });
    } else if (markers.length >= 2) {
      const bounds = cluster.getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, {
          padding: FIT_PADDING,
          maxZoom: 14,
          duration: 0.4,
        });
      }
    }
  }, [spotsToShow, mapReady]);

  // 現在地取得 → そこにフォーカス + 現在地マーカー描画
  const locate = () => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocateError("この端末は位置情報に対応していません。");
      return;
    }
    setLocateError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const latlng: LType.LatLngTuple = [latitude, longitude];
        userMarkerRef.current?.remove();
        userAccuracyRef.current?.remove();
        // 半透明の精度円
        userAccuracyRef.current = L.circle(latlng, {
          radius: Math.min(accuracy || 100, 1000),
          color: "#226574",
          weight: 1,
          fillColor: "#3db8c9",
          fillOpacity: 0.15,
          interactive: false,
        }).addTo(map);
        // 中央の現在地ピン（ブランド色 hibiscus）
        const html = `
          <div style="position:relative;width:18px;height:18px;display:grid;place-items:center;">
            <span style="position:absolute;inset:-6px;border-radius:50%;background:#e84855;opacity:0.25;animation:pulse-ring 2.4s cubic-bezier(0.2,0.7,0.2,1) infinite;pointer-events:none;"></span>
            <span style="position:relative;width:14px;height:14px;border-radius:50%;background:#e84855;border:3px solid #fff;box-shadow:0 4px 12px rgba(15,29,51,0.35);"></span>
          </div>
        `;
        const icon = L.divIcon({
          html,
          className: "user-location",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        userMarkerRef.current = L.marker(latlng, {
          icon,
          interactive: false,
          keyboard: false,
          alt: "現在地",
        }).addTo(map);
        map.flyTo(latlng, Math.max(map.getZoom(), 14), { duration: 0.6 });
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError("位置情報の利用が許可されていません。");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocateError("位置情報を取得できませんでした。");
        } else if (err.code === err.TIMEOUT) {
          setLocateError("位置情報の取得がタイムアウトしました。");
        } else {
          setLocateError("位置情報の取得に失敗しました。");
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  };

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

      {/* Top filter bar */}
      <div className="absolute top-3 left-3 right-16 z-[1000] flex gap-2">
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

      {/* 現在地ボタン（右下、ズームコントロールの下） */}
      <button
        type="button"
        onClick={locate}
        disabled={locating}
        aria-label="現在地を表示"
        className={cn(
          "absolute right-3 bottom-24 z-[1000] grid place-items-center w-11 h-11 rounded-full glass-strong shadow-pop transition active:scale-95",
          locating ? "text-charcoal/50" : "text-charcoal hover:bg-white",
        )}
      >
        {locating ? (
          <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
        ) : (
          <LocateFixed className="w-5 h-5" strokeWidth={2} />
        )}
      </button>

      {locateError && (
        <div
          role="alert"
          className="absolute top-14 right-3 z-[1000] max-w-[280px] rounded-xl bg-white border border-border shadow-pop px-3 py-2 text-[11px] text-charcoal animate-slide-up"
        >
          {locateError}
        </div>
      )}

      {filterOpen && (
        <div className="absolute top-14 left-3 z-[1000] max-w-[calc(100%-1.5rem)] glass-strong rounded-2xl shadow-pop p-3 animate-slide-up">
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
                    active ? { background: CATEGORY_COLORS[cat] } : undefined
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
        <div className="absolute bottom-3 left-3 right-3 z-[1000] rounded-2xl glass-strong shadow-float overflow-hidden animate-slide-up">
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
