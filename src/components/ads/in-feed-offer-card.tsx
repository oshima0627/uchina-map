import type { AffiliateOffer } from "@/data/affiliateOffers";
import { cn } from "@/lib/utils";

/** SpotCard と同じ見た目の PR カード。モバイル/PC 共通。 */
export function InFeedOfferCard({
  offer,
  className,
}: {
  offer: AffiliateOffer;
  className?: string;
}) {
  const isPhoto = offer.provider === "rakuten";
  return (
    <div className={cn("relative", className)} data-ad="in-feed-offer" data-offer-id={offer.id}>
      <a
        href={offer.href}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        referrerPolicy="no-referrer-when-downgrade"
        className="group relative block h-full rounded-2xl bg-card border border-border shadow-soft hover:shadow-pop hover:-translate-y-0.5 transition-all overflow-hidden"
      >
        <div className="relative h-32 overflow-hidden bg-sand-light">
          {/* eslint-disable-next-line @next/next/no-img-element -- 広告画像 */}
          <img
            src={offer.imageSrc}
            alt={offer.label}
            loading="lazy"
            decoding="async"
            width={offer.width}
            height={offer.height}
            className={cn(
              "absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105",
              isPhoto ? "object-cover" : "object-contain p-1",
            )}
          />
          <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-full glass-strong text-[10px] font-bold tracking-wider text-charcoal/80">
            PR
          </span>
        </div>
        <div className="p-4 space-y-1.5">
          <h3 className="font-bold text-charcoal leading-tight text-balance tracking-tight">
            {offer.label}
          </h3>
          <p className="text-xs text-charcoal/70 line-clamp-2">{offer.description}</p>
          <p className="text-[10.5px] text-charcoal/50 pt-1">
            {offer.provider === "rakuten" ? "楽天トラベル" : "もしもアフィリエイト"}・広告
          </p>
        </div>
      </a>
      {offer.impressionSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={offer.impressionSrc}
          width={1}
          height={1}
          alt=""
          className="absolute h-px w-px opacity-0"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
