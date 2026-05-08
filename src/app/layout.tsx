import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header, BottomNav } from "@/components/header";

export const metadata: Metadata = {
  title: {
    default: "うちなー子連れマップ｜沖縄の子連れOKスポット",
    template: "%s｜うちなー子連れマップ",
  },
  description:
    "沖縄県内の「子連れで安心して行ける場所」が、親目線の本当に欲しい情報付きで見つかるWebアプリ。授乳室・ベビーカー可・雨OKなど、必要な設備で絞り込めます。",
  keywords: ["沖縄", "子連れ", "お出かけ", "授乳室", "ベビーカー", "公園", "雨の日"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "うちなー子連れマップ",
  },
  openGraph: {
    title: "うちなー子連れマップ",
    description:
      "沖縄の子連れOKスポットが、設備フィルタと地図で見つかる。",
    type: "website",
    locale: "ja_JP",
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
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <footer className="hidden md:block border-t border-border py-6 mt-12">
          <div className="mx-auto max-w-5xl px-4 text-xs text-charcoal/60">
            © 2026 うちなー子連れマップ・Nexeed Lab — 沖縄の親子が、もっと自由にお出かけできるように。
          </div>
        </footer>
      </body>
    </html>
  );
}
