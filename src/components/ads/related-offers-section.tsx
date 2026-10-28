import { InFeedOfferCard } from "@/components/ads/in-feed-offer-card";
import { relatedOffersFor } from "@/lib/related-offers";
import type { Spot } from "@/lib/types";

/**
 * スポット詳細の「あわせてチェック」PR セクション（楽天トラベル体験・既存オファーのみ、最大2件）。
 * 本文（Q&A）の後・関連スポットの前に置く。
 * 広告であることは見出しの「PR」ラベルと、カード直下の12px・通常コントラストの注記で明示する。
 * リンクは InFeedOfferCard を再利用（rel="sponsored nofollow noopener noreferrer"）。
 */
export function RelatedOffersSection({ spot }: { spot: Spot }) {
  const offers = relatedOffersFor(spot);
  if (offers.length === 0) return null;

  return (
    <section
      className="mb-10 rounded-2xl border border-border bg-sand-light/40 p-4"
      aria-label="あわせてチェック（PR）"
      data-section="related-offers"
    >
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-bold text-charcoal">あわせてチェック</h2>
        <span className="inline-flex items-center rounded-full border border-charcoal/40 px-2 py-0.5 text-xs font-bold text-charcoal">
          PR
        </span>
      </div>
      <p className="text-sm text-charcoal/85 mb-3 leading-relaxed">
        雨の日やこのあとに行く候補として、近くの有料の体験・施設のチケットを紹介します。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {offers.map(({ offer, description }) => (
          <InFeedOfferCard key={offer.id} offer={{ ...offer, description }} />
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-charcoal/85">
        【PR】アフィリエイト広告を含みます。上のリンクは楽天トラベル（楽天アフィリエイト）への広告リンクで、
        リンク先で予約・購入されると当サイトに紹介料が支払われることがあります。
        料金・空き状況・受付状況はリンク先でご確認ください。
      </p>
    </section>
  );
}
