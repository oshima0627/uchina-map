import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <span className="text-7xl block mb-4" aria-hidden>
        🏝️
      </span>
      <h1 className="text-2xl font-black text-charcoal">
        ページが見つかりません
      </h1>
      <p className="text-charcoal/60 mt-2 mb-6">
        このスポットは存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-primary text-white font-medium hover:bg-primary-600"
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
