import { Suspense } from "react";
import { SpotsBrowser } from "./spots-browser";
import { SpotCard } from "@/components/spot-card";
import { JsonLd } from "@/components/json-ld";
import { SPOTS } from "@/data/spots";
import { pageMetadata, spotListJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "スポットをさがす",
  description:
    "沖縄の子連れOKスポットをカテゴリ・エリア・設備で絞り込み検索。授乳室・ベビーカー可・雨の日OK・駐車場ありなど、親目線の条件で探せます。",
  path: "/spots/",
});

export default function SpotsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <JsonLd data={spotListJsonLd(SPOTS)} />
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-charcoal">スポットをさがす</h1>
        <p className="text-sm text-charcoal/75 mt-1">
          条件で絞り込んで、ぴったりのお出かけ先を見つけましょう。
        </p>
      </header>
      {/* SpotsBrowser は useSearchParams を使うため静的HTMLにはフォールバックが出力される。
          全スポットへのリンクをここでサーバーレンダリングし、クローラの巡回経路を確保する。 */}
      <Suspense fallback={<SpotsFallback />}>
        <SpotsBrowser />
      </Suspense>
    </div>
  );
}

function SpotsFallback() {
  return (
    <div>
      <p className="text-sm text-charcoal/75 mb-3">{SPOTS.length}件のスポット</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPOTS.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
