import Link from "next/link";
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
import { CITY_LABELS, type Spot } from "@/lib/types";

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
    >
      {feature === "rainOk" && <TyphoonSection spots={spots} />}
    </SpotCollection>
  );
}

/**
 * 「雨の日」ページにだけ置く台風の案内。
 *
 * 「沖縄 子連れ 台風 過ごし方」の記事は各社にあるが、暴風のときにも営業する
 * 屋内施設を条件で出せるサイトは無い。`typhoonOk` フラグはこのサイトだけが持つ軸。
 */
function TyphoonSection({ spots }: { spots: Spot[] }) {
  const typhoon = spots.filter((s) => s.features.typhoonOk);
  const indoor = spots.filter((s) => s.features.isIndoor).length;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-charcoal mb-3">台風のときはどこに行ける？</h2>
      <div className="rounded-2xl bg-white border border-border px-4 py-3 text-sm text-charcoal/80 leading-relaxed space-y-2">
        <p>
          沖縄の台風は雨だけでなく風が強く、屋外の公園やビーチは使えません。
          このページの{spots.length}件のうち屋内の施設は{indoor}件、
          台風のときにも利用できる施設は{typhoon.length}件です。
        </p>
        {typhoon.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {typhoon.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/spots/${s.id}/`}
                  className="inline-flex items-center px-3 h-8 rounded-full bg-card border border-border text-xs font-bold text-charcoal hover:border-charcoal/30 transition"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-charcoal/60">
          暴風警報が出ると商業施設も臨時休業することがあります。出かける前に各施設の公式サイトや
          SNS で当日の営業を確認してください。
        </p>
      </div>
    </section>
  );
}
