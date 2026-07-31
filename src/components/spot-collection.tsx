import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SpotCard } from "@/components/spot-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { ADSENSE_SLOTS } from "@/lib/ads";
import { SITE_URL, spotUrl } from "@/lib/seo";
import type { Spot } from "@/lib/types";

/**
 * 絞り込み一覧ページ（市町村別・カテゴリ別・設備別）の共通レイアウト。
 *
 * 4種類のルートで同じ構造を使う。見出しは h1 → h2 → h3（SpotCard）で揃え、
 * 検索語がそのまま h1 に入るようにする。
 */
export function SpotCollection({
  heading,
  lead,
  path,
  spots,
  breadcrumb,
  relatedLinks,
  children,
}: {
  /** h1。検索語をそのまま入れる（例: 「那覇市の子連れOKスポット」） */
  heading: string;
  lead: string;
  path: string;
  spots: Spot[];
  breadcrumb: Array<{ name: string; path: string }>;
  /** 同じ軸の他のページへのリンク。孤立ページを作らないために必ず渡す */
  relatedLinks: Array<{ label: string; href: string; count: number }>;
  /** 一覧の下に置く補足（Q&A など） */
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <JsonLd data={breadcrumbLd(breadcrumb)} />
      <JsonLd data={itemListLd(heading, spots)} />

      <nav className="text-xs text-charcoal/60">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.path}>
            {i > 0 && " / "}
            {i === breadcrumb.length - 1 ? (
              <span className="text-charcoal">{crumb.name}</span>
            ) : (
              <Link href={crumb.path} className="hover:underline">
                {crumb.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <header className="mt-3 mb-5">
        <h1 className="text-2xl md:text-3xl font-black text-charcoal tracking-tight">
          {heading}
        </h1>
        <p className="text-sm text-charcoal/75 mt-2 leading-relaxed">{lead}</p>
      </header>

      <section>
        {/* h1 と同じ文言を繰り返さない。h1 が主題、ここは一覧という役割の見出し。
            式を並べると React がテキストノードの間に <!-- --> を挟んで
            見出しが分断されるため、1本の文字列にしてから渡す。 */}
        <h2 className="text-lg font-bold text-charcoal mb-1">{`掲載スポット一覧（${spots.length}件）`}</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      {children}

      {relatedLinks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-charcoal mb-3">ほかの条件でさがす</h2>
          <ul className="flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-card border border-border text-sm font-bold text-charcoal hover:border-charcoal/30 transition"
                >
                  {link.label}
                  <span className="text-[11px] tabular-nums font-medium text-charcoal/55">
                    {link.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 一覧と関連リンクを見終わった位置に置く */}
      <AdSlot slot={ADSENSE_SLOTS.content} className="mt-10" />

      <p className="mt-8 text-[11px] leading-relaxed text-charcoal/55">
        掲載内容は変更される場合があります。おでかけ前に各施設の公式情報をご確認ください。
        <Link href={path} className="underline">
          このページ
        </Link>
        の情報に誤りを見つけられた場合はお知らせください。
      </p>
    </div>
  );
}

function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

function itemListLd(name: string, spots: Spot[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: spots.length,
    itemListElement: spots.map((spot, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: spot.name,
      url: spotUrl(spot.id),
    })),
  };
}
