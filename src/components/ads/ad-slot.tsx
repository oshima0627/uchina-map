"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  /** AdSense 広告ユニットのスロットID */
  slot: string;
  /** data-ad-format（既定 "auto"） */
  format?: string;
  /** レスポンシブ広告にするか（既定 true） */
  responsive?: boolean;
  className?: string;
};

/**
 * AdSense のディスプレイ広告枠。「広告」ラベル付きで表示する。
 * クライアントID未設定・スロットID未指定のときは何も描画しない。
 */
export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className,
}: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsEnabled || !slot || pushed.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // ライブラリ未読込・重複pushは無視
    }
  }, [slot]);

  if (!adsEnabled || !slot) return null;

  return (
    <aside className={cn("w-full text-center", className)}>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/40">
        広告
      </span>
      <ins
        className="adsbygoogle mt-1 block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </aside>
  );
}
