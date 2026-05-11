"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type * as LType from "leaflet";

// Stadia Maps Alidade Smooth — ドメイン認証（Referer 経由）で API キー不要
const TILE_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/" target="_blank" rel="noopener noreferrer">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

const PIN_HTML = `
  <div style="position:relative;width:32px;height:32px;background:#3DB8C9;border:3px solid #fff;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.25);display:grid;place-items:center;color:#fff;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  </div>
`;

export function SpotMap({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LType.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        minZoom: 9,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer(TILE_URL, {
        maxZoom: 18,
        attribution: TILE_ATTRIBUTION,
        crossOrigin: true,
      }).addTo(map);

      const icon = L.divIcon({
        html: PIN_HTML,
        className: "spot-pin",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([lat, lng], { icon, title: name, alt: name })
        .addTo(map)
        .bindPopup(name);

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(containerRef.current);
      requestAnimationFrame(() => map.invalidateSize());

      mapRef.current = map;
      cleanup = () => {
        ro.disconnect();
        map.remove();
        mapRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={containerRef}
      className="w-full h-72 rounded-2xl overflow-hidden border border-border bg-sand-light"
      aria-label="スポットの地図"
    />
  );
}
