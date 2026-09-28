"use client";

import { usePathname } from "next/navigation";
import {
  MOSHIMO_SIDE_LEFT,
  MOSHIMO_SIDE_RIGHT,
  type MoshimoSideBanner,
} from "@/data/moshimoSideBanners";

function BannerCard({ banner }: { banner: MoshimoSideBanner }) {
  return (
    <div className="w-full max-w-[160px]">
      <a
        href={banner.href}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        referrerPolicy="no-referrer-when-downgrade"
        className="block overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm transition-opacity hover:opacity-95"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- アフィリエイト計測用の固定サイズ画像 */}
        <img
          src={banner.imageSrc}
          width={banner.width}
          height={banner.height}
          alt={banner.label}
          className="mx-auto block h-auto max-w-full"
          loading="lazy"
          decoding="async"
        />
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.impressionSrc}
        width={1}
        height={1}
        alt=""
        className="h-px w-px opacity-0"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function SideStack({ banners }: { banners: MoshimoSideBanner[] }) {
  if (banners.length === 0) return null;

  return (
    <aside
      className="hidden w-[160px] shrink-0 flex-col gap-3 pt-2 xl:flex"
      aria-label="アフィリエイト広告"
    >
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/40">
        広告
      </p>
      {banners.map((banner) => (
        <BannerCard key={banner.id} banner={banner} />
      ))}
      <p className="text-center text-[10px] text-charcoal/45">アフィリエイト広告</p>
    </aside>
  );
}

/**
 * 本文と一緒に縦スクロールする左右バナー付きレイアウト。
 * fixed にせずドキュメントフローに置き、横スクロールなしで最初から見える。
 * /map ではラッパーだけ通し、バナーは出さない。
 */
export function ContentWithSideRails({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const onMap = pathname === "/map" || pathname === "/map/";
  const isHome = pathname === "/" || pathname === "";

  // トップはヒーローを全幅にするため、ヒーロー下だけ page.tsx 側でラップする
  if (onMap || isHome) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto grid w-full max-w-[90rem] grid-cols-1 gap-x-4 px-4 xl:grid-cols-[160px_minmax(0,1fr)_160px]">
      <SideStack banners={MOSHIMO_SIDE_LEFT} />
      <div className="min-w-0">{children}</div>
      <SideStack banners={MOSHIMO_SIDE_RIGHT} />
    </div>
  );
}
