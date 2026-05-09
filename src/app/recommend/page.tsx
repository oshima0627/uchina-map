import { RecommendClient } from "./recommend-client";

export const metadata = {
  title: "今日どこ？",
  description:
    "天気・年齢・滞在時間に応じて、今日ぴったりのお出かけ先をレコメンド。",
};

export default function RecommendPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-hibiscus/10 text-hibiscus text-xs font-bold">
          ✨ 今日のおすすめ
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-charcoal mt-2">
          今日どこ？
        </h1>
        <p className="text-sm text-charcoal/75 mt-1">
          条件を選ぶと、今日の天気を加味したおすすめスポットが見つかります。
        </p>
      </header>

      <RecommendClient />
    </div>
  );
}
