"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites-store";
import { SPOTS } from "@/data/spots";
import { SpotCard } from "@/components/spot-card";
import { Button } from "@/components/ui/button";

export function FavoritesList() {
  const ids = useFavorites((s) => s.ids);
  const hydrated = useFavorites((s) => s.hydrated);
  const clear = useFavorites((s) => s.clear);

  const spots = SPOTS.filter((s) => ids.includes(s.id));

  if (!hydrated) {
    return <div className="text-charcoal/75 text-sm">読み込み中...</div>;
  }

  if (spots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <Heart className="w-10 h-10 mx-auto text-charcoal/20 mb-3" />
        <p className="text-charcoal/70 font-medium">
          まだお気に入りに登録されたスポットがありません。
        </p>
        <p className="text-sm text-charcoal/70 mt-1 mb-4">
          気になるスポットの ♡ ボタンを押して保存しましょう。
        </p>
        <Link href="/spots">
          <Button>スポットをさがす</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-charcoal/75">{spots.length}件のお気に入り</p>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (confirm("すべて削除しますか？")) clear();
          }}
        >
          すべて削除
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
