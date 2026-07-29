import type { Metadata } from "next";
import { CITY_LABELS, type Category, type Spot } from "@/lib/types";

export const SITE_URL = "https://uchina-map.nexeed-lab.com";
export const SITE_NAME = "うちなー子連れマップ";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/** サイト内パスを絶対URLにする（日本語ファイル名はエンコードする） */
export function absoluteUrl(path: string) {
  return `${SITE_URL}${encodeURI(path)}`;
}

export function spotUrl(id: string) {
  return `${SITE_URL}/spots/${id}/`;
}

export function spotOgImage(spot: Spot) {
  return spot.imageUrl ? absoluteUrl(spot.imageUrl) : DEFAULT_OG_IMAGE;
}

export function spotDescription(spot: Spot) {
  return spot.shortDescription ?? spot.description.slice(0, 120);
}

/**
 * 検索スニペットに出す設備の要約。
 * 「施設名＋授乳室」「施設名＋駐車場」のような検索が流入の中心なので、
 * 検索語がそのまま含まれるよう、需要の大きい設備から並べる。
 */
export function spotFacilitySummary(spot: Spot): string[] {
  const f = spot.features;
  const out: string[] = [];

  if (f.hasNursingRoom) out.push("授乳室あり");
  if (f.hasDiaperTable) out.push("オムツ替え台あり");
  if (f.hasParking) {
    out.push(
      f.parkingFree
        ? f.parkingSpacious
          ? "駐車場無料（広め）"
          : "駐車場無料"
        : "駐車場あり（有料）",
    );
  }
  if (f.rainOk) out.push("雨の日OK");
  if (f.hasKidsSpace) out.push("キッズスペースあり");
  else if (f.hasPlayground) out.push("遊具あり");
  if (f.strollerRental) out.push("ベビーカー貸出あり");
  else if (f.strollerFriendly) out.push("ベビーカーOK");

  return out;
}

/**
 * ページ固有の canonical / OGP / Twitter カードをまとめて生成する。
 * openGraph と twitter は親レイアウトとマージされず上書きになるため、
 * 各ページで必ずここを通してすべてのフィールドを出す。
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  noindex = false,
}: {
  /** 省略するとレイアウトの既定タイトルを使う（トップページ用） */
  title?: string;
  description: string;
  /** 先頭と末尾にスラッシュを付けたサイト内パス（例: "/spots/"） */
  path: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title}｜${SITE_NAME}` : `${SITE_NAME}｜沖縄の子連れOKスポット`;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "ja_JP",
      images: [{ url: image, alt: imageAlt ?? fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/** カテゴリごとに最も近い schema.org の型を割り当てる（すべて Place のサブタイプ） */
const SCHEMA_TYPE: Record<Category, string> = {
  park: "Park",
  indoor: "AmusementPark",
  aquarium: "Aquarium",
  beach: "Beach",
  restaurant: "Restaurant",
  shopping: "ShoppingCenter",
  learning: "Museum",
  onsen: "DaySpa",
};

const AMENITY_LABELS: Array<[keyof Spot["features"], string]> = [
  ["hasNursingRoom", "授乳室"],
  ["hasDiaperTable", "オムツ替え台"],
  ["hasMultipurposeToilet", "多目的トイレ"],
  ["strollerFriendly", "ベビーカー可"],
  ["strollerRental", "ベビーカー貸出"],
  ["hasParking", "駐車場"],
  ["hasKidsSpace", "キッズスペース"],
  ["hasPlayground", "遊具"],
  ["hasKidsChair", "子供用椅子"],
  ["rainOk", "雨の日OK"],
];

export function spotJsonLd(spot: Spot) {
  const url = spotUrl(spot.id);
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[spot.category],
    "@id": `${url}#place`,
    name: spot.name,
    description: spot.description,
    url,
    image: spotOgImage(spot),
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: "沖縄県",
      addressLocality: CITY_LABELS[spot.city],
      streetAddress: spot.address.replace(/^沖縄県/, "").replace(CITY_LABELS[spot.city], ""),
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: spot.lat,
      longitude: spot.lng,
    },
    ...(spot.phone ? { telephone: spot.phone } : {}),
    ...(spot.websiteUrl ? { sameAs: [spot.websiteUrl] } : {}),
    ...(spot.price?.free || spot.price?.adult === 0 ? { isAccessibleForFree: true } : {}),
    amenityFeature: AMENITY_LABELS.filter(([key]) => spot.features[key]).map(([, name]) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
  };
}

export function spotBreadcrumbJsonLd(spot: Spot) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "スポットをさがす", item: `${SITE_URL}/spots/` },
      { "@type": "ListItem", position: 3, name: spot.name, item: spotUrl(spot.id) },
    ],
  };
}

export function spotListJsonLd(spots: Spot[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "沖縄の子連れOKスポット一覧",
    numberOfItems: spots.length,
    itemListElement: spots.map((spot, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: spot.name,
      url: spotUrl(spot.id),
    })),
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "ja",
    description:
      "沖縄県内の「子連れで安心して行ける場所」が、授乳室・ベビーカー可・雨OKなどの設備で絞り込んで見つかるマップ。",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/spots/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
