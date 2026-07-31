import { notFound } from "next/navigation";

import { SpotCollection } from "@/components/spot-collection";
import { pageMetadata } from "@/lib/seo";
import {
  FEATURE_HEADINGS,
  collectionPath,
  indexableCategories,
  indexableFeatures,
  isCategory,
  spotsByCategory,
  spotsByFeature,
} from "@/lib/spot-collections";
import { CATEGORY_LABELS } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return indexableCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isCategory(category)) return pageMetadata({ description: "", path: "/spots/" });

  const label = CATEGORY_LABELS[category];
  const spots = spotsByCategory(category);

  return pageMetadata({
    title: `沖縄の子連れで行ける${label}`,
    description: `沖縄本島で子連れにやさしい${label}を${spots.length}件掲載。授乳室・ベビーカー可・雨の日OK・駐車場ありなど、親目線の設備情報つきで探せます。`,
    path: collectionPath.category(category),
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const label = CATEGORY_LABELS[category];
  const spots = spotsByCategory(category);

  const related = [
    ...indexableCategories()
      .filter((c) => c !== category)
      .map((c) => ({
        label: CATEGORY_LABELS[c],
        href: collectionPath.category(c),
        count: spotsByCategory(c).length,
      })),
    ...indexableFeatures().map((feature) => ({
      label: FEATURE_HEADINGS[feature],
      href: collectionPath.feature(feature),
      count: spotsByFeature(feature).length,
    })),
  ];

  return (
    <SpotCollection
      heading={`沖縄の子連れで行ける${label}`}
      lead={`沖縄本島にある、子連れで行きやすい${label}をまとめています。授乳室・オムツ替え台・ベビーカーでの回りやすさ・駐車場の有無を各スポットのページで確認できます。`}
      path={collectionPath.category(category)}
      spots={spots}
      breadcrumb={[
        { name: "ホーム", path: "/" },
        { name: "スポットをさがす", path: "/spots/" },
        { name: label, path: collectionPath.category(category) },
      ]}
      relatedLinks={related}
    />
  );
}
