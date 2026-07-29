import { FavoritesList } from "./favorites-list";
import { pageMetadata } from "@/lib/seo";

// 端末ローカルの保存内容しか表示しないため、検索結果には出さない
export const metadata = pageMetadata({
  title: "お気に入り",
  description: "あなたが保存したスポット一覧。",
  path: "/favorites/",
  noindex: true,
});

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-charcoal">お気に入り</h1>
        <p className="text-sm text-charcoal/75 mt-1">
          気になるスポットを保存しておけます。データはこの端末のみに保存されます。
        </p>
      </header>
      <FavoritesList />
    </div>
  );
}
