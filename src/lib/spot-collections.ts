import { SPOTS } from "@/data/spots";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CITIES,
  CITY_LABELS,
  FILTER_FEATURES,
  type Category,
  type City,
  type FilterFeature,
  type Spot,
} from "@/lib/types";

/**
 * 一覧ページの軸（市町村・カテゴリ・設備）を、索引されるURLとして扱うための定義。
 *
 * これまで絞り込みは `/spots/?city=naha` `/spots/?feature=rainOk` のクエリ
 * パラメータだけだった。canonical は `/spots/` に向けてあるため重複扱いにはなって
 * いないが、裏を返すと **絞り込み結果が1つも索引されていない**。
 *
 * Search Console の実データでは、流入しているのは「那覇空港 キッズスペース」
 * のような 固有名詞 × 設備 のクエリだった。同じ形の需要は市町村側にもある
 * （「那覇市 授乳室」「沖縄 雨の日 子供 遊び場」）が、受け皿になるURLが無い。
 * ここで軸ごとの実URLを用意して、その受け皿を作る。
 *
 * クエリパラメータ版は絞り込みUIとして残す。canonical はこれまでどおり
 * `/spots/` に向いているので、両者が重複することはない。
 */

/** URL に出す設備スラッグ。features のキー名（hasNursingRoom）はURLに向かない。 */
export const FEATURE_SLUGS = {
  hasNursingRoom: "nursing",
  strollerFriendly: "stroller",
  rainOk: "rain",
  hasParking: "parking",
} as const satisfies Record<FilterFeature, string>;

export type FeatureSlug = (typeof FEATURE_SLUGS)[FilterFeature];

const FEATURE_BY_SLUG = Object.fromEntries(
  FILTER_FEATURES.map((f) => [FEATURE_SLUGS[f], f]),
) as Record<FeatureSlug, FilterFeature>;

export function featureFromSlug(slug: string): FilterFeature | undefined {
  return FEATURE_BY_SLUG[slug as FeatureSlug];
}

/** 設備の見出し用ラベル。FILTER_FEATURE_LABELS より説明的にする。 */
export const FEATURE_HEADINGS: Record<FilterFeature, string> = {
  hasNursingRoom: "授乳室のある",
  strollerFriendly: "ベビーカーで行ける",
  rainOk: "雨の日でも遊べる",
  hasParking: "駐車場のある",
};

export function isCity(value: string): value is City {
  return (CITIES as readonly string[]).includes(value);
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function spotsByCity(city: City): Spot[] {
  return SPOTS.filter((s) => s.city === city);
}

export function spotsByCategory(category: Category): Spot[] {
  return SPOTS.filter((s) => s.category === category);
}

export function spotsByFeature(feature: FilterFeature): Spot[] {
  return SPOTS.filter((s) => s.features[feature]);
}

export function spotsByCityAndFeature(city: City, feature: FilterFeature): Spot[] {
  return SPOTS.filter((s) => s.city === city && s.features[feature]);
}

/**
 * 組み合わせページを作る下限件数。
 *
 * 1〜2件しか載らないページを量産すると、内容がほぼ同じ薄いページが
 * 大量に索引され、本体のページまで評価を落とす。姉妹サイトの
 * うちなーマネーでも同じ理由で、独自制度が無い市町村×イベントの
 * 組み合わせを sitemap から外している。
 *
 * 件数が増えれば自動的にページが生えるので、閾値を運用で動かす必要はない。
 */
const MIN_SPOTS_FOR_COMBINATION = 3;

/** 単軸ページ（市町村・カテゴリ・設備）は1件でも作る。固有名詞の受け皿になるため。 */
const MIN_SPOTS_FOR_SINGLE_AXIS = 1;

export function indexableCities(): City[] {
  return CITIES.filter((c) => spotsByCity(c).length >= MIN_SPOTS_FOR_SINGLE_AXIS);
}

export function indexableCategories(): Category[] {
  return CATEGORIES.filter((c) => spotsByCategory(c).length >= MIN_SPOTS_FOR_SINGLE_AXIS);
}

export function indexableFeatures(): FilterFeature[] {
  return FILTER_FEATURES.filter((f) => spotsByFeature(f).length >= MIN_SPOTS_FOR_SINGLE_AXIS);
}

/** 市町村 × 設備のうち、載せるだけの件数があるものだけ。 */
export function indexableCityFeaturePairs(): Array<{ city: City; feature: FilterFeature }> {
  return indexableCities().flatMap((city) =>
    FILTER_FEATURES.filter(
      (feature) => spotsByCityAndFeature(city, feature).length >= MIN_SPOTS_FOR_COMBINATION,
    ).map((feature) => ({ city, feature })),
  );
}

export function isIndexableCityFeature(city: City, feature: FilterFeature): boolean {
  return spotsByCityAndFeature(city, feature).length >= MIN_SPOTS_FOR_COMBINATION;
}

/** ページのURL。sitemap と内部リンクで同じ関数を使い、末尾スラッシュのゆれを防ぐ。 */
export const collectionPath = {
  city: (city: City) => `/spots/city/${city}/`,
  category: (category: Category) => `/spots/category/${category}/`,
  feature: (feature: FilterFeature) => `/spots/feature/${FEATURE_SLUGS[feature]}/`,
  cityFeature: (city: City, feature: FilterFeature) =>
    `/spots/city/${city}/${FEATURE_SLUGS[feature]}/`,
};

/** 見出し・title に使う表示名。 */
export const collectionLabel = {
  city: (city: City) => CITY_LABELS[city],
  category: (category: Category) => CATEGORY_LABELS[category],
  feature: (feature: FilterFeature) => FEATURE_HEADINGS[feature],
};
