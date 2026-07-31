import { Suspense } from "react";
import Link from "next/link";
import { SpotsBrowser } from "./spots-browser";
import { SpotCard } from "@/components/spot-card";
import { JsonLd } from "@/components/json-ld";
import { AdSlot } from "@/components/ads/ad-slot";
import { SPOTS } from "@/data/spots";
import { ADSENSE_SLOTS } from "@/lib/ads";
import { pageMetadata, spotListJsonLd } from "@/lib/seo";
import {
  FEATURE_HEADINGS,
  collectionPath,
  indexableCategories,
  indexableCities,
  indexableFeatures,
  spotsByCategory,
  spotsByCity,
  spotsByFeature,
} from "@/lib/spot-collections";
import { CATEGORY_LABELS, CITY_LABELS } from "@/lib/types";

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
        {/* h1 に検索語（沖縄・子連れ）が入っていなかった。title 側と揃える。 */}
        <h1 className="text-2xl font-bold text-charcoal">
          沖縄の子連れOKスポットをさがす
        </h1>
        <p className="text-sm text-charcoal/75 mt-1">
          カテゴリ・エリア・設備で絞り込んで、ぴったりのお出かけ先を見つけましょう。
        </p>
      </header>
      {/* 絞り込み一覧への導線。クエリパラメータ版（?city=naha）はUIとして残しつつ、
          索引される実URLへの入口をここに置く。リンクが無いページはクロールされない。 */}
      <CollectionLinks />

      {/* SpotsBrowser は useSearchParams を使うため静的HTMLにはフォールバックが出力される。
          全スポットへのリンクをここでサーバーレンダリングし、クローラの巡回経路を確保する。 */}
      <Suspense fallback={<SpotsFallback />}>
        <SpotsBrowser />
      </Suspense>
      {/* 一覧を見終わった位置。絞り込みUIとカードの間には入れない */}
      <AdSlot slot={ADSENSE_SLOTS.content} className="mt-10" />
    </div>
  );
}

/** 絞り込み一覧ページへの入口。市町村・設備・カテゴリの3軸を並べる。 */
function CollectionLinks() {
  const groups = [
    {
      heading: "市町村からさがす",
      links: indexableCities().map((city) => ({
        label: CITY_LABELS[city],
        href: collectionPath.city(city),
        count: spotsByCity(city).length,
      })),
    },
    {
      heading: "設備からさがす",
      links: indexableFeatures().map((feature) => ({
        label: FEATURE_HEADINGS[feature],
        href: collectionPath.feature(feature),
        count: spotsByFeature(feature).length,
      })),
    },
    {
      heading: "カテゴリからさがす",
      links: indexableCategories().map((category) => ({
        label: CATEGORY_LABELS[category],
        href: collectionPath.category(category),
        count: spotsByCategory(category).length,
      })),
    },
  ];

  return (
    <div className="mb-8 space-y-5">
      {groups.map((group) => (
        <section key={group.heading}>
          <h2 className="text-sm font-bold text-charcoal/70 mb-2">{group.heading}</h2>
          <ul className="flex flex-wrap gap-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-card border border-border text-sm font-bold text-charcoal hover:border-charcoal/30 transition"
                >
                  {link.label}
                  <span className="text-[11px] tabular-nums font-medium text-charcoal/55">
                    {link.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function SpotsFallback() {
  return (
    <div>
      {/* スポットカードは h3。親の h2 が無いと h1 → h3 と階層が飛ぶ。
          静的HTMLに出力されるのはこのフォールバックなので、
          クローラが読む文書構造もここで決まる。 */}
      <h2 className="text-lg font-bold text-charcoal mb-1">スポット一覧</h2>
      <p className="text-sm text-charcoal/75 mb-3">{SPOTS.length}件のスポット</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPOTS.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
