import { notFound } from "next/navigation";

import { SpotCollection } from "@/components/spot-collection";
import { pageMetadata } from "@/lib/seo";
import {
  FEATURE_HEADINGS,
  collectionPath,
  featureFromSlug,
  indexableCityFeaturePairs,
  isCity,
  isIndexableCityFeature,
  spotsByCityAndFeature,
  spotsByFeature,
} from "@/lib/spot-collections";
import { CITY_LABELS, FILTER_FEATURES } from "@/lib/types";

export const dynamicParams = false;

/**
 * 市町村 × 設備。件数が足りない組み合わせは作らない
 * （spot-collections.ts の MIN_SPOTS_FOR_COMBINATION を参照）。
 */
export function generateStaticParams() {
  return indexableCityFeaturePairs().map(({ city, feature }) => ({
    city,
    feature: collectionPath.cityFeature(city, feature).split("/").filter(Boolean).at(-1) as string,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; feature: string }>;
}) {
  const { city, feature: slug } = await params;
  const feature = featureFromSlug(slug);
  if (!isCity(city) || !feature) return pageMetadata({ description: "", path: "/spots/" });

  const label = CITY_LABELS[city];
  const spots = spotsByCityAndFeature(city, feature);
  const heading = `${label}で${FEATURE_HEADINGS[feature]}子連れスポット`;

  return pageMetadata({
    title: heading,
    description: `${label}にある${FEATURE_HEADINGS[feature]}子連れOKスポットを${spots.length}件掲載。設備の有無をスポットごとに確認できます。`,
    path: collectionPath.cityFeature(city, feature),
  });
}

export default async function CityFeaturePage({
  params,
}: {
  params: Promise<{ city: string; feature: string }>;
}) {
  const { city, feature: slug } = await params;
  const feature = featureFromSlug(slug);
  if (!isCity(city) || !feature) notFound();

  const label = CITY_LABELS[city];
  const spots = spotsByCityAndFeature(city, feature);
  const heading = `${label}で${FEATURE_HEADINGS[feature]}子連れスポット`;

  const related = [
    { label: `${label}のすべて`, href: collectionPath.city(city), count: spots.length },
    ...FILTER_FEATURES.filter((f) => f !== feature && isIndexableCityFeature(city, f)).map((f) => ({
      label: `${label}／${FEATURE_HEADINGS[f]}`,
      href: collectionPath.cityFeature(city, f),
      count: spotsByCityAndFeature(city, f).length,
    })),
    {
      label: `沖縄全域／${FEATURE_HEADINGS[feature]}`,
      href: collectionPath.feature(feature),
      count: spotsByFeature(feature).length,
    },
  ];

  return (
    <SpotCollection
      heading={heading}
      lead={`${label}のなかから、${FEATURE_HEADINGS[feature]}スポットだけを抜き出しました。各ページで設備の詳細と、実際に行くときに気になる点をまとめています。`}
      path={collectionPath.cityFeature(city, feature)}
      spots={spots}
      breadcrumb={[
        { name: "ホーム", path: "/" },
        { name: "スポットをさがす", path: "/spots/" },
        { name: label, path: collectionPath.city(city) },
        { name: FEATURE_HEADINGS[feature], path: collectionPath.cityFeature(city, feature) },
      ]}
      relatedLinks={related}
    />
  );
}
