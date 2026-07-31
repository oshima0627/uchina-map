import { notFound } from "next/navigation";

import { SpotCollection } from "@/components/spot-collection";
import { pageMetadata } from "@/lib/seo";
import {
  FEATURE_HEADINGS,
  FEATURE_SLUGS,
  collectionPath,
  featureFromSlug,
  indexableCities,
  indexableFeatures,
  isIndexableCityFeature,
  spotsByCityAndFeature,
  spotsByFeature,
} from "@/lib/spot-collections";
import { CITY_LABELS } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return indexableFeatures().map((feature) => ({ feature: FEATURE_SLUGS[feature] }));
}

export async function generateMetadata({ params }: { params: Promise<{ feature: string }> }) {
  const { feature: slug } = await params;
  const feature = featureFromSlug(slug);
  if (!feature) return pageMetadata({ description: "", path: "/spots/" });

  const spots = spotsByFeature(feature);
  const heading = `沖縄で${FEATURE_HEADINGS[feature]}子連れスポット`;

  return pageMetadata({
    title: heading,
    description: `沖縄本島の${FEATURE_HEADINGS[feature]}子連れOKスポットを${spots.length}件掲載。市町村別にも絞り込めます。`,
    path: collectionPath.feature(feature),
  });
}

export default async function FeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature: slug } = await params;
  const feature = featureFromSlug(slug);
  if (!feature) notFound();

  const spots = spotsByFeature(feature);
  const heading = `沖縄で${FEATURE_HEADINGS[feature]}子連れスポット`;

  // 市町村別の絞り込みへ降りる導線。「那覇市 授乳室」のような検索の受け皿になる
  const related = indexableCities()
    .filter((city) => isIndexableCityFeature(city, feature))
    .map((city) => ({
      label: `${CITY_LABELS[city]}／${FEATURE_HEADINGS[feature]}`,
      href: collectionPath.cityFeature(city, feature),
      count: spotsByCityAndFeature(city, feature).length,
    }));

  return (
    <SpotCollection
      heading={heading}
      lead={`沖縄本島にある${FEATURE_HEADINGS[feature]}子連れOKスポットをまとめています。市町村で絞り込みたい場合は、ページ下部のリンクから選んでください。`}
      path={collectionPath.feature(feature)}
      spots={spots}
      breadcrumb={[
        { name: "ホーム", path: "/" },
        { name: "スポットをさがす", path: "/spots/" },
        { name: FEATURE_HEADINGS[feature], path: collectionPath.feature(feature) },
      ]}
      relatedLinks={related}
    />
  );
}
