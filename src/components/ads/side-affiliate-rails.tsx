"use client";

import { usePathname } from "next/navigation";
import {
  MOSHIMO_SIDE_BANNERS,
  type MoshimoSideBanner,
} from "@/data/moshimoSideBanners";

function SideBanner({ banner, side }: { banner: MoshimoSideBanner; side: "left" | "right" }) {
  // max-w-5xl = 64rem。コンテンツ外側に 160px バナー + 余白を置く。
  // 2xl (1536px) 以上でのみ表示（それ以下だと左右余白が足りない）。
  const positionClass =
    side === "left"
      ? "left-[max(0.25rem,calc(50%-32rem-11rem))]"
      : "right-[max(0.25rem,calc(50%-32rem-11rem))]";

  return (
    <aside
      className={`pointer-events-auto fixed top-24 z-20 hidden w-[160px] 2xl:block ${positionClass}`}
      aria-label={`${banner.label}の広告`}
    >
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/40">
        広告
      </p>
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
          className="block h-auto w-[160px]"
          loading="lazy"
          decoding="async"
        />
      </a>
      {/* もしもインプレッション計測ピクセル */}
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
      <p className="mt-1 text-center text-[10px] text-charcoal/45">アフィリエイト広告</p>
    </aside>
  );
}

/**
 * PC の左右余白に縦長アフィリエイトバナーを固定表示する。
 * 地図フルスクリーン（/map）では出さない。
 */
export function SideAffiliateRails() {
  const pathname = usePathname();
  const onMap = pathname === "/map" || pathname === "/map/";

  if (onMap) return null;

  return (
    <div className="pointer-events-none" aria-hidden={false}>
      <SideBanner banner={MOSHIMO_SIDE_BANNERS.left} side="left" />
      <SideBanner banner={MOSHIMO_SIDE_BANNERS.right} side="right" />
    </div>
  );
}
