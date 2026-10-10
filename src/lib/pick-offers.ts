import { AFFILIATE_OFFERS, type AffiliateOffer, type OfferFormat } from "@/data/affiliateOffers";
import type { Category, City } from "@/lib/types";

/**
 * 文脈（カテゴリ・市町村）に合うオファーを関連度順に返す。
 * 一致がなければ沖縄全般のオファーでフォールバック。exclude と結果内で重複排除。
 * 同点は id の安定ハッシュ + seed で並べ、ビルドごとに結果が揺れないようにする。
 */
export function pickOffers({
  category,
  city,
  format = "card",
  limit = 3,
  exclude = [],
  seed = "",
  offers = AFFILIATE_OFFERS,
}: {
  category?: Category;
  city?: City;
  format?: OfferFormat;
  limit?: number;
  exclude?: string[];
  seed?: string;
  offers?: AffiliateOffer[];
}): AffiliateOffer[] {
  const excluded = new Set(exclude);
  const scored = offers
    .filter((o) => o.formats.includes(format) && !excluded.has(o.id))
    .map((o) => {
      let score = 0;
      if (category && o.categories?.includes(category)) score += 2;
      if (city && o.cities?.includes(city)) score += 3;
      // 汎用（沖縄全般）オファーは弱い加点で常に候補に残す
      if (!o.categories?.length && !o.cities?.length) score += 0.5;
      return { o, score, tie: hash(seed + o.id) };
    })
    .sort((a, b) => b.score - a.score || a.tie - b.tie);

  const out: AffiliateOffer[] = [];
  const seen = new Set<string>();
  for (const { o } of scored) {
    if (seen.has(o.href)) continue;
    seen.add(o.href);
    out.push(o);
    if (out.length >= limit) break;
  }
  return out;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 配列の最頻値（一覧ページの文脈推定用） */
export function mode<T>(values: T[]): T | undefined {
  const counts = new Map<T, number>();
  let best: T | undefined;
  let bestN = 0;
  for (const v of values) {
    const n = (counts.get(v) ?? 0) + 1;
    counts.set(v, n);
    if (n > bestN) {
      best = v;
      bestN = n;
    }
  }
  return best;
}
