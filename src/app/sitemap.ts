import type { MetadataRoute } from "next";
import { SPOTS } from "@/data/spots";
import { SITE_URL } from "@/lib/seo";
import {
  collectionPath,
  indexableCategories,
  indexableCities,
  indexableCityFeaturePairs,
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

  const cityFeatureRoutes: MetadataRoute.Sitemap = indexableCityFeaturePairs().map(
    ({ city, feature }) => ({
      url: `${SITE_URL}${collectionPath.cityFeature(city, feature)}`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: "weekly",
    }),
  );

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
    ...cityFeatureRoutes,
    ...spotRoutes,
  ];
}
