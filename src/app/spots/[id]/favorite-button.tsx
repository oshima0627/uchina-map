"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites-store";
import { cn } from "@/lib/utils";

export function FavoriteButton({ id }: { id: string }) {
  const has = useFavorites((s) => s.ids.includes(id));
  const toggle = useFavorites((s) => s.toggle);
  const hydrated = useFavorites((s) => s.hydrated);

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-label={has ? "お気に入りから削除" : "お気に入りに追加"}
      className="absolute top-4 right-4 grid place-items-center w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-border active:scale-95 transition-transform"
    >
      <Heart
        className={cn(
          "w-5 h-5",
          hydrated && has ? "fill-hibiscus text-hibiscus" : "text-charcoal/60",
        )}
      />
    </button>
  );
}
