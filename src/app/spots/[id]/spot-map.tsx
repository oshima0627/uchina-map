"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
};

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
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom: 15,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const el = document.createElement("div");
    el.className = "spot-marker";
    el.style.cssText =
      "width:38px;height:48px;display:grid;place-items:center;color:#fff;font-size:20px;line-height:1;transform:translateY(-12px);";
    el.innerHTML =
      '<div style="position:absolute;width:32px;height:32px;background:#3DB8C9;border:3px solid #fff;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.25);display:grid;place-items:center;"><span style="font-size:16px">📍</span></div>';

    new maplibregl.Marker({ element: el })
      .setLngLat([lng, lat])
      .setPopup(
        new maplibregl.Popup({ offset: 28 }).setText(name),
      )
      .addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={containerRef}
      className="w-full h-72 rounded-2xl overflow-hidden border border-border"
      aria-label="スポットの地図"
    />
  );
}
