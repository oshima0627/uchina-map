import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header, BottomNav } from "@/components/header";

const SITE_URL = "https://uchina-map.nexeed-lab.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "うちなー子連れマップ｜沖縄の子連れOKスポット",
    template: "%s｜うちなー子連れマップ",
  },
  description:
    "沖縄県内の「子連れで安心して行ける場所」が、親目線の本当に欲しい情報付きで見つかるWebアプリ。授乳室・ベビーカー可・雨OKなど、必要な設備で絞り込めます。",
  keywords: ["沖縄", "子連れ", "お出かけ", "授乳室", "ベビーカー", "公園", "雨の日"],
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon-192.svg" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "うちなー子連れマップ",
  },
  openGraph: {
    title: "うちなー子連れマップ",
    description:
      "沖縄の子連れOKスポットが、設備フィルタと地図で見つかる。",
    url: SITE_URL,
    siteName: "うちなー子連れマップ",
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "うちなー子連れマップ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "うちなー子連れマップ",
    description:
      "沖縄の子連れOKスポットが、設備フィルタと地図で見つかる。",
    images: ["/og-image.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3DB8C9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-28 md:pb-0">{children}</main>
        <BottomNav />
        <footer className="hidden md:block border-t border-border py-6 mt-12">
          <div className="mx-auto max-w-5xl px-4 text-xs text-charcoal/75">
            © 2026 うちなー子連れマップ・Nexeed Lab — 沖縄の親子が、もっと自由にお出かけできるように。
          </div>
        </footer>
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "7720cfaf118644229c48e9d586355283"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
