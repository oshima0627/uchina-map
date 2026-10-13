/**
 * アフィリエイト広告の統合オファー一覧（楽天）。
 * URL は既存の affiliateLinks.ts からのみ流用する。
 * 新しいアフィリエイトURLをここで直接書き足さないこと。
 */
import { AFFILIATE_LINKS, type AffiliateSpotId } from "@/data/affiliateLinks";
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
  provider: "rakuten";
  categories?: Category[];
  cities?: City[];
  formats: OfferFormat[];
};

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
];
