import Link from "next/link";
import { notFound } from "next/navigation";

import { SpotCollection } from "@/components/spot-collection";
import { pageMetadata } from "@/lib/seo";
import {
  collectionPath,
  indexableCities,
  isCity,
  isIndexableCityFeature,
  spotsByCity,
  spotsByCityAndFeature,
  FEATURE_HEADINGS,
} from "@/lib/spot-collections";
import { CITY_LABELS, FILTER_FEATURES } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return indexableCities().map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  if (!isCity(city)) return pageMetadata({ description: "", path: "/spots/" });

  const label = CITY_LABELS[city];
  const spots = spotsByCity(city);
  const nursing = spotsByCityAndFeature(city, "hasNursingRoom").length;

  return pageMetadata({
    title: `${label}の子連れOKスポット`,
    description: `${label}で子連れにやさしいおでかけ先を${spots.length}件掲載。授乳室あり${nursing}件など、ベビーカー可・雨の日OK・駐車場ありといった設備で絞り込めます。`,
    path: collectionPath.city(city),
  });
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  if (!isCity(city)) notFound();

  const label = CITY_LABELS[city];
  const spots = spotsByCity(city);

  // 同じ市町村の設備別ページと、他の市町村へ横に張る。
  // どこからもリンクされないページはクロールされず索引もされないため。
  const related = [
    ...FILTER_FEATURES.filter((f) => isIndexableCityFeature(city, f)).map((feature) => ({
      label: `${label}／${FEATURE_HEADINGS[feature]}`,
      href: collectionPath.cityFeature(city, feature),
      count: spotsByCityAndFeature(city, feature).length,
    })),
    ...indexableCities()
      .filter((c) => c !== city)
      .map((c) => ({
        label: CITY_LABELS[c],
        href: collectionPath.city(c),
        count: spotsByCity(c).length,
      })),
  ];

  // 設備ごとの件数と代表例。スポット詳細ページで
  // 「那覇空港 キッズスペースに授乳室・オムツ替え台はある？」が
  // 流入を取れているのと同じ、設問の形の見出しを市町村単位でも用意する。
  //
  // 見出しと本文は JSX で分割せず、あらかじめ1本の文字列にしておく。
  // {label}で{...}子連れスポットは？ のように式を並べると React が
  // テキストノードの間に <!-- --> を挟み、HTML上で見出しが分断されるため。
  const qa = FILTER_FEATURES.map((feature) => {
    const matched = spotsByCityAndFeature(city, feature);
    return {
      feature,
      matched,
      question: `${label}で${FEATURE_HEADINGS[feature]}子連れスポットは？`,
      answer: `${matched.length}件あります。${matched
        .slice(0, 3)
        .map((s) => s.name)
        .join("、")}など。`,
    };
  }).filter(({ matched }) => matched.length > 0);

  return (
    <SpotCollection
      heading={`${label}の子連れOKスポット`}
      lead={`${label}にある、子連れで安心して行けるおでかけ先をまとめています。授乳室・オムツ替え台・ベビーカーでの回りやすさ・雨の日に遊べるか・駐車場の有無まで、実際に行く前に知りたい情報を各スポットのページに載せています。`}
      path={collectionPath.city(city)}
      spots={spots}
      breadcrumb={[
        { name: "ホーム", path: "/" },
        { name: "スポットをさがす", path: "/spots/" },
        { name: label, path: collectionPath.city(city) },
      ]}
      relatedLinks={related}
    >
      <section className="mt-10">
        <h2 className="text-lg font-bold text-charcoal mb-3">
          {label}の子連れおでかけQ&amp;A
        </h2>
        <div className="rounded-2xl bg-white border border-border divide-y divide-border">
          {qa.map(({ feature, question, answer }) => (
            <div key={feature} className="px-4 py-3">
              <h3 className="text-sm font-bold text-charcoal">{question}</h3>
              <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
                {answer}
                {isIndexableCityFeature(city, feature) && (
                  <>
                    {" "}
                    <Link
                      href={collectionPath.cityFeature(city, feature)}
                      className="underline font-bold"
                    >
                      一覧を見る
                    </Link>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SpotCollection>
  );
}
