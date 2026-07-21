import Script from "next/script";
import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

/**
 * AdSense のライブラリ読み込み。クライアントID未設定なら何も出力しない。
 * layout.tsx で一度だけ読み込む。
 */
export function AdSenseScript() {
  if (!adsEnabled) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
