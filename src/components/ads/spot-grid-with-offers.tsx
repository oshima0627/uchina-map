import { Fragment } from "react";
import { SpotCard } from "@/components/spot-card";
import { InFeedOfferCard } from "@/components/ads/in-feed-offer-card";
import { mode, pickOffers } from "@/lib/pick-offers";
import type { Category, City, Spot } from "@/lib/types";

const EVERY = 4;
const MAX = 3;

/**
 * SpotCard グリッドに 4枚ごと1枚（最大3枚）の PR カードを差し込む。
 */
export function SpotGridWithOffers({
  spots,
  className,
  category,
  city,
  exclude,
  seed,
}: {
  spots: Spot[];
  className: string;
  category?: Category;
  city?: City;
  exclude?: string[];
  seed?: string;
}) {
  const slots = Math.min(MAX, Math.floor(spots.length / EVERY));
  const offers = slots
    ? pickOffers({
        category: category ?? mode(spots.map((s) => s.category)),
        city: city ?? mode(spots.map((s) => s.city)),
        format: "card",
        limit: slots,
        exclude,
        seed: seed ?? spots.map((s) => s.id).join(","),
      })
    : [];

  return (
    <div className={className}>
      {spots.map((spot, i) => {
        const offer = (i + 1) % EVERY === 0 ? offers[(i + 1) / EVERY - 1] : undefined;
        return (
          <Fragment key={spot.id}>
            <SpotCard spot={spot} />
            {offer && (
              <InFeedOfferCard offer={offer} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
