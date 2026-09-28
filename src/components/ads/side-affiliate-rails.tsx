"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  MOSHIMO_SIDE_LEFT,
  MOSHIMO_SIDE_RIGHT,
  type MoshimoSideBanner,
} from "@/data/moshimoSideBanners";

function BannerCard({ banner }: { banner: MoshimoSideBanner }) {
  return (
    <div className="w-[160px]">
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

function SideStack({
  banners,
  side,
}: {
  banners: MoshimoSideBanner[];
  side: "left" | "right";
}) {
  if (banners.length === 0) return null;

  const sideClass = side === "left" ? "left-2" : "right-2";

  return (
    <aside
      className={`pointer-events-auto fixed top-24 z-20 hidden max-h-[calc(100vh-7rem)] w-[160px] overflow-y-auto xl:flex xl:flex-col xl:gap-3 ${sideClass}`}
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
 * PC 左右に縦長アフィリエイトを固定スタック表示する。
 * - /map では出さない
 * - トップはヒーロー表示中は隠し、白背景に入ってから固定表示
 * - 本体は site-container で左右バナー枠分を空けつつ幅を広げる
 */
export function SideAffiliateRails() {
  const pathname = usePathname();
  const onMap = pathname === "/map" || pathname === "/map/";
  const isHome = pathname === "/" || pathname === "";
  const [pastHero, setPastHero] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }

    const hero = document.getElementById("home-hero");
    if (!hero) {
      setPastHero(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-56px 0px 0px 0px",
      },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  if (onMap || !pastHero) return null;

  return (
    <div className="pointer-events-none">
      <SideStack banners={MOSHIMO_SIDE_LEFT} side="left" />
      <SideStack banners={MOSHIMO_SIDE_RIGHT} side="right" />
    </div>
  );
}
