import { Ticket } from "lucide-react";

type AffiliateTicketCtaProps = {
  href: string;
  spotName: string;
};

/**
 * スポット詳細のチケット・予約 CTA（楽天アフィリエイト）。
 * 地図ナビや一覧リンクの近くには置かず、本文末（Q&A 後）に配置する想定。
 */
export function AffiliateTicketCta({ href, spotName }: AffiliateTicketCtaProps) {
  return (
    <section
      className="mb-10 rounded-2xl border border-primary-200 bg-primary-50 p-4"
      aria-label={`${spotName}のチケット・予約`}
    >
      <h2 className="text-sm font-bold text-primary-800 mb-2">チケット・予約</h2>
      <p className="text-sm text-charcoal/80 mb-3 leading-relaxed">
        {spotName}の入場チケットや体験予約を、楽天トラベル体験で確認できます。
      </p>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 h-11 rounded-full bg-primary text-white font-medium hover:bg-primary-600 active:bg-primary-700 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
      >
        <Ticket className="w-4 h-4" strokeWidth={2.25} aria-hidden />
        チケット・予約を確認
      </a>
      <p className="mt-2 text-[11px] text-charcoal/55 text-center">
        アフィリエイト広告を含みます
      </p>
    </section>
  );
}
