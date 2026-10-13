"use client";

import { usePathname } from "next/navigation";

/**
 * 旧: PC左右にアフィリエイトバナーを出していたレイアウト。
 * 現在は左右バナーを出さない（楽天のインフィードのみ）。
 * layout.tsx / page.tsx から使われているため export は維持し、
 * トップ（force）では本文を通常の site-container 幅に収める。
 */
export function ContentWithSideRails({
  children,
  force = false,
}: {
  children: React.ReactNode;
  force?: boolean;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  if (force && isHome) {
    return <div className="site-container">{children}</div>;
  }
  return <>{children}</>;
}
