/**
 * アフィリエイト広告の統合オファー一覧（楽天 + もしも）。
 * URL は既存の affiliateLinks.ts / moshimoSideBanners.ts からのみ流用する。
 * 新しいアフィリエイトURLをここで直接書き足さないこと。
 */
import { AFFILIATE_LINKS, type AffiliateSpotId } from "@/data/affiliateLinks";
import {
  MOSHIMO_SIDE_LEFT,
  MOSHIMO_SIDE_RIGHT,
  type MoshimoSideBanner,
} from "@/data/moshimoSideBanners";
import { SPOTS } from "@/data/spots";
import type { Category, City } from "@/lib/types";
import { cardImageUrl } from "@/lib/utils";

export type OfferFormat =
  | "card"
  | "banner-320x50"
  | "rect-300x250"
  | "skyscraper-160x600";

export type AffiliateOffer = {
  id: string;
  label: string;
  description: string;
  href: string;
  imageSrc: string;
  impressionSrc?: string;
  width: number;
  height: number;
  provider: "rakuten" | "moshimo";
  categories?: Category[];
  cities?: City[];
  formats: OfferFormat[];
  /** PC左右レールにも出ているバナーか */
  inSideRail?: boolean;
};

const MOSHIMO_META: Record<
  string,
  { description: string; formats: OfferFormat[]; categories?: Category[] }
> = {
  "tabirai-activity-160x600": {
    description: "沖縄の体験・アクティビティをまとめて予約",
    formats: ["skyscraper-160x600"],
  },
  "chanpuru-net-120x600": {
    description: "沖縄の暮らし・旅の情報サイト",
    formats: [],
  },
  "worldlibrary-personal-gift-160x600": {
    description: "名入れ絵本など子どもへのギフトに",
    formats: ["skyscraper-160x600"],
  },
  "hilander-250x250": {
    description: "家族のアウトドア・キャンプ用品",
    formats: ["card"],
  },
};

function fromMoshimo(b: MoshimoSideBanner): AffiliateOffer {
  const meta = MOSHIMO_META[b.id] ?? { description: "", formats: [] };
  return {
    id: `moshimo-${b.id}`,
    label: b.label,
    description: meta.description,
    href: b.href,
    imageSrc: b.imageSrc,
    impressionSrc: b.impressionSrc,
    width: b.width,
    height: b.height,
    provider: "moshimo",
    categories: meta.categories,
    formats: meta.formats,
    inSideRail: true,
  };
}

const RAKUTEN_OFFERS: AffiliateOffer[] = (
  Object.keys(AFFILIATE_LINKS) as AffiliateSpotId[]
).flatMap((spotId) => {
  const spot = SPOTS.find((s) => s.id === spotId);
  if (!spot || !spot.imageUrl) return [];
  return [
    {
      id: `rakuten-${spotId}`,
      label: `${spot.name} 体験チケット`,
      description: "楽天トラベル 観光体験で事前予約",
      href: AFFILIATE_LINKS[spotId],
      imageSrc: cardImageUrl(spot.imageUrl),
      width: 480,
      height: 256,
      provider: "rakuten" as const,
      categories: [spot.category],
      cities: [spot.city],
      formats: ["card"] as OfferFormat[],
    },
  ];
});

export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  ...RAKUTEN_OFFERS,
  ...[...MOSHIMO_SIDE_LEFT, ...MOSHIMO_SIDE_RIGHT].map(fromMoshimo),
];
