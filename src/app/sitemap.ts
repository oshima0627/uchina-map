import type { MetadataRoute } from "next";
import { SPOTS } from "@/data/spots";
import { SITE_URL } from "@/lib/seo";
import {
  collectionPath,
  indexableCategories,
  indexableCities,
  indexableFeatures,
} from "@/lib/spot-collections";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "daily" },
    { url: `${SITE_URL}/spots/`, lastModified: now, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/map/`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/recommend/`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${SITE_URL}/about/`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${SITE_URL}/privacy/`, lastModified: now, priority: 0.2, changeFrequency: "yearly" },
  ];

  // 絞り込み一覧（市町村別・カテゴリ別・設備別）。
  // これまで絞り込みは /spots/?city=naha のクエリパラメータだけで、
  // canonical を /spots/ に向けていたため1ページも索引されていなかった。
  // 件数が足りない組み合わせは spot-collections.ts 側で除外している。
  const cityRoutes: MetadataRoute.Sitemap = indexableCities().map((city) => ({
    url: `${SITE_URL}${collectionPath.city(city)}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const categoryRoutes: MetadataRoute.Sitemap = indexableCategories().map((category) => ({
    url: `${SITE_URL}${collectionPath.category(category)}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const featureRoutes: MetadataRoute.Sitemap = indexableFeatures().map((feature) => ({
    url: `${SITE_URL}${collectionPath.feature(feature)}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  // 市町村 × 設備の40ページは sitemap に載せない。
  //
  // Search Console の実測（2026/05/29-08/28）では、絞り込みページ66枚の合計が
  // 26表示・0クリック（サイト全体の表示回数の0.5%）で、うち市町村×設備は
  // 12表示・0クリック。同じ期間にスポット詳細29ページが「検出 - インデックス
  // 未登録」のまま一度もクロールされていない。外部リンクが0件でクロール予算が
  // 絞られている状態なので、まず固有名詞で戦えるスポット詳細に回す。
  //
  // ページとルートと内部リンク（市町村ページの relatedLinks）は残してあるので、
  // 流入が増えて予算に余裕が出たらこの配列を戻すだけで復帰できる。

  const spotRoutes: MetadataRoute.Sitemap = SPOTS.map((spot) => ({
    url: `${SITE_URL}/spots/${spot.id}/`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...categoryRoutes,
    ...featureRoutes,
    ...spotRoutes,
  ];
}
