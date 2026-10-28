import { AFFILIATE_OFFERS, type AffiliateOffer } from "@/data/affiliateOffers";
import { SPOTS } from "@/data/spots";
import { CATEGORY_LABELS, CITY_LABELS, type Spot } from "@/lib/types";
import { distanceKm } from "@/lib/utils";

/**
 * 「あわせてチェック（PR）」を出すスポット詳細ページ。
 *
 * 楽天CTA（AffiliateTicketCta）が無い、流入の多い無料〜低価格の施設ページ。
 * GSC（3か月・2026-10-26まで）で表示回数が多いページを中心に選んでいる。
 * 新しいアフィリエイトURLは足さない。既存オファー（affiliateOffers.ts = affiliateLinks.ts 由来）だけを使う。
 */
export const PR_SECTION_SPOT_IDS: readonly string[] = [
  "naha-main-place",
  "urasoe-parco-city",
  "urasoe-daikoen",
  "naha-airport-kids",
  "urasoe-asobi-park-kyozuka",
  "naha-shuri-castle-park",
  "kitanakagusuku-aeon-rycom",
  "naha-okimu",
  "naha-yogi-park",
  "chatan-american-village",
  "naha-the-kids-palette",
  "kitanakagusuku-sans-souci",
  "naha-waku-kids-land",
  "naha-shintoshin-park",
];

/** この距離（直線）より遠いオファーは「近く」とは言えないので出さない */
const MAX_DISTANCE_KM = 45;
const MAX_OFFERS = 2;

export type RelatedOffer = {
  offer: AffiliateOffer;
  /** カードに出す説明文（距離・カテゴリ・屋内かどうかは spots.ts の値から生成） */
  description: string;
};

/**
 * スポットの近くにある既存の楽天オファーを、直線距離の近い順に最大2件返す。
 * オファーの対象スポットは offer.id（`rakuten-<spotId>`）から引く。
 * 屋内かつ雨OKの対象にだけ「雨の日の候補にも」と添える（データにあることだけを書く）。
 */
export function relatedOffersFor(spot: Spot): RelatedOffer[] {
  const candidates = AFFILIATE_OFFERS.flatMap((offer) => {
    const target = SPOTS.find((s) => `rakuten-${s.id}` === offer.id);
    if (!target || target.id === spot.id) return [];
    const km = distanceKm(spot, target);
    if (km > MAX_DISTANCE_KM) return [];
    return [{ offer, target, km }];
  });

  return candidates
    .sort((a, b) => a.km - b.km)
    .slice(0, MAX_OFFERS)
    .map(({ offer, target, km }) => {
      const rain = target.features.isIndoor && target.features.rainOk;
      const parts = [
        `${CITY_LABELS[target.city]}の${CATEGORY_LABELS[target.category]}`,
        `${spot.name}から直線で約${Math.max(1, Math.round(km))}km`,
        rain ? "屋内で雨の日の候補にも" : "おでかけのあとに行く候補",
      ];
      return { offer, description: `${parts.join("・")}。` };
    });
}
