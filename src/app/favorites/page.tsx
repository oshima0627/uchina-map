import { FavoritesList } from "./favorites-list";

export const metadata = {
  title: "お気に入り",
  description: "あなたが保存したスポット一覧。",
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-charcoal">お気に入り</h1>
        <p className="text-sm text-charcoal/60 mt-1">
          気になるスポットを保存しておけます。データはこの端末のみに保存されます。
        </p>
      </header>
      <FavoritesList />
    </div>
  );
}
