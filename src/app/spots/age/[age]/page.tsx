import Link from "next/link";
import { notFound } from "next/navigation";

import { SpotCollection } from "@/components/spot-collection";
import { pageMetadata } from "@/lib/seo";
import {
  AGE_HEADINGS,
  collectionPath,
  indexableAges,
  isAgeTag,
  spotsByAge,
} from "@/lib/spot-collections";
import { AGE_LABELS, CITY_LABELS, type AgeTag, type City } from "@/lib/types";

export const dynamicParams = false;

/**
 * 年齢別の一覧ページ。
 *
 * トップの「年齢で選ぶ」はこれまで `/spots?age=0` のクエリ版にリンクしていて、
 * canonical が `/spots/` に向くため年齢軸は1ページも索引されていなかった。
 * 「沖縄 0歳 お出かけ」「那覇 赤ちゃん 遊び場」の受け皿として実URLを用意する。
 */

/** 年齢ごとに、親が気にする点を1段落で。事実の件数は下の Q&A で示す。 */
const AGE_LEADS: Record<AgeTag, string> = {
  "0":
    "首がすわる前後の赤ちゃんと一緒に行ける場所をまとめています。授乳室・オムツ替え台の有無と、ベビーカーで回れるかを各スポットで確認できます。",
  "1-3":
    "歩き始めから幼稚園に入る前までの子と行ける場所をまとめています。キッズスペースや小さな遊具のある施設、雨の日に使える屋内の遊び場を中心に掲載しています。",
  "4-6":
    "体を動かして遊びたい年頃の子と行ける場所をまとめています。大型遊具のある公園、水族館、体験できる施設を中心に掲載しています。",
  school:
    "小学生と一緒に楽しめる場所をまとめています。公園やビーチ、学びのある体験施設を掲載しています。",
};

export function generateStaticParams() {
  return indexableAges().map((age) => ({ age }));
}

export async function generateMetadata({ params }: { params: Promise<{ age: string }> }) {
  const { age } = await params;
  if (!isAgeTag(age)) return pageMetadata({ description: "", path: "/spots/" });

  const spots = spotsByAge(age);
  return pageMetadata({
    title: `沖縄で${AGE_HEADINGS[age]}子連れスポット`,
    description: `沖縄本島の${AGE_HEADINGS[age]}子連れOKスポットを${spots.length}件掲載。授乳室・オムツ替え・ベビーカー・雨の日OK・駐車場の有無が分かります。`,
    path: collectionPath.age(age),
  });
}

export default async function AgePage({ params }: { params: Promise<{ age: string }> }) {
  const { age } = await params;
  if (!isAgeTag(age)) notFound();

  const spots = spotsByAge(age);
  const heading = `沖縄で${AGE_HEADINGS[age]}子連れスポット`;

  // 市町村ごとの件数。多い順に並べ、市町村ページへ降りる導線にする
  const byCity = new Map<City, number>();
  for (const s of spots) byCity.set(s.city, (byCity.get(s.city) ?? 0) + 1);
  const cities = [...byCity.entries()].sort((a, b) => b[1] - a[1]);

  const nursing = spots.filter((s) => s.features.hasNursingRoom).length;
  const rain = spots.filter((s) => s.features.rainOk).length;
  const stroller = spots.filter((s) => s.features.strollerFriendly).length;
  const free = spots.filter((s) => s.price?.free).length;

  const related = indexableAges()
    .filter((a) => a !== age)
    .map((a) => ({
      label: AGE_HEADINGS[a],
      href: collectionPath.age(a),
      count: spotsByAge(a).length,
    }));

  return (
    <SpotCollection
      heading={heading}
      lead={AGE_LEADS[age]}
      path={collectionPath.age(age)}
      spots={spots}
      breadcrumb={[
        { name: "ホーム", path: "/" },
        { name: "スポットをさがす", path: "/spots/" },
        { name: AGE_LABELS[age], path: collectionPath.age(age) },
      ]}
      relatedLinks={related}
    >
      <section className="mt-10">
        <h2 className="text-lg font-bold text-charcoal mb-3">
          {AGE_LABELS[age]}の子連れおでかけQ&amp;A
        </h2>
        <div className="rounded-2xl bg-white border border-border divide-y divide-border">
          <div className="px-4 py-3">
            <h3 className="text-sm font-bold text-charcoal">
              {AGE_LABELS[age]}と行ける場所はどの市町村に多い？
            </h3>
            <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
              {cities.map(([city, count], i) => (
                <span key={city}>
                  {i > 0 && "、"}
                  <Link href={collectionPath.city(city)} className="underline font-bold">
                    {CITY_LABELS[city]}
                  </Link>
                  {count}件
                </span>
              ))}
              。
            </p>
          </div>
          <div className="px-4 py-3">
            <h3 className="text-sm font-bold text-charcoal">授乳室やベビーカーは？</h3>
            <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
              {spots.length}件のうち、授乳室があるのは{nursing}件、ベビーカーで回れるのは{stroller}件です。{" "}
              <Link href={collectionPath.feature("hasNursingRoom")} className="underline font-bold">
                授乳室のある一覧
              </Link>
              も見られます。
            </p>
          </div>
          <div className="px-4 py-3">
            <h3 className="text-sm font-bold text-charcoal">雨の日はどこに行ける？</h3>
            <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
              {rain}件が雨の日でも利用できます。{" "}
              <Link href={collectionPath.feature("rainOk")} className="underline font-bold">
                雨の日でも遊べる一覧
              </Link>
              にまとめています。
            </p>
          </div>
          <div className="px-4 py-3">
            <h3 className="text-sm font-bold text-charcoal">入場無料の場所はある？</h3>
            <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
              {free > 0
                ? `${free}件が入場無料です。各スポットの「料金」欄で確認できます。`
                : "掲載スポットの料金は各ページの「料金」欄で確認できます。"}
            </p>
          </div>
        </div>
      </section>
    </SpotCollection>
  );
}
