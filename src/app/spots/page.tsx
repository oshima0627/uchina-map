import { Suspense } from "react";
import { SpotsBrowser } from "./spots-browser";

export const metadata = {
  title: "スポットをさがす",
  description:
    "沖縄本島南部の子連れOKスポットをカテゴリ・エリア・設備で絞り込み検索。",
};

export default function SpotsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-charcoal">スポットをさがす</h1>
        <p className="text-sm text-charcoal/60 mt-1">
          条件で絞り込んで、ぴったりのお出かけ先を見つけましょう。
        </p>
      </header>
      <Suspense fallback={<div className="text-charcoal/60">読み込み中...</div>}>
        <SpotsBrowser />
      </Suspense>
    </div>
  );
}
