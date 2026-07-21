import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

/**
 * AdSense のライブラリ読み込み。クライアントID未設定なら何も出力しない。
 * React 19 が native <script async src> を自動で <head> に巻き上げるため、
 * AdSense が要求するスニペットがそのまま HTML の <head> に出力される（所有権確認・審査用）。
 */
export function AdSenseScript() {
  if (!adsEnabled) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
