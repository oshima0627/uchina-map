import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <span
        aria-hidden
        className="grid place-items-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 text-primary-700 border border-primary-100"
      >
        <Compass className="w-8 h-8" strokeWidth={1.75} />
      </span>
      <h1 className="text-2xl font-black text-charcoal tracking-tight">
        ページが見つかりません
      </h1>
      <p className="text-charcoal/75 mt-2 mb-6">
        このスポットは存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-charcoal text-white font-bold shadow-soft hover:shadow-pop transition"
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
