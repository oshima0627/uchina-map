import { Sparkles } from "lucide-react";
import { RecommendClient } from "./recommend-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "今日どこ？",
  description:
    "今日の沖縄の天気・子どもの年齢・滞在時間から、ぴったりのお出かけ先をレコメンド。雨の日は屋内、晴れならビーチや公園を自動で提案します。",
  path: "/recommend/",
});

export default function RecommendPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-bold tracking-[0.18em] uppercase">
          <Sparkles className="w-3 h-3" strokeWidth={2.25} />
          Today
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-charcoal mt-2 tracking-tight">
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
