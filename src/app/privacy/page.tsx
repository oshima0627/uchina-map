import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description:
    "うちなー子連れマップのプライバシーポリシー。アクセス解析・広告配信における情報の取り扱いについて記載しています。",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary-700">Privacy Policy</p>
        <h1 className="text-3xl font-bold text-charcoal">プライバシーポリシー</h1>
      </header>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-charcoal/85">
        <p>
          Nexeed Lab（以下「当方」）は、うちなー子連れマップ（以下「本サービス」）における利用者の情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">1. 取得する情報</h2>
          <p>本サービスでは、以下の情報を取得することがあります。</p>
          <ul className="list-inside list-disc space-y-1">
            <li>アクセスログ（IPアドレス、ユーザーエージェント、リファラ、参照ページ等）</li>
            <li>広告配信・アクセス解析のために付与される Cookie 等の識別子</li>
          </ul>
          <p>
            お気に入り機能で選択したスポットは、サーバーには送信されず、ご利用の端末（ブラウザの localStorage）内にのみ保存されます。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">2. アクセス解析ツール</h2>
          <p>
            本サービスは、サイト改善のためのアクセス解析として Cloudflare, Inc. が提供する{" "}
            <strong>Cloudflare Web Analytics</strong>{" "}
            を利用しています。個人を識別する情報は取得せず、ページビュー数・参照元・利用デバイス種別等の集計的な情報のみが記録されます。詳細は{" "}
            <a
              className="text-primary-700 hover:underline"
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare のプライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">3. 広告配信について</h2>
          <p>
            本サービスでは、第三者配信の広告サービス「Google AdSense」を利用する場合があります。広告配信事業者は、利用者の興味に応じた広告を表示するために Cookie を使用することがあります。Cookie を無効にする方法や、Google による広告のカスタマイズについては{" "}
            <a
              className="text-primary-700 hover:underline"
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google の広告に関するポリシー
            </a>
            をご確認ください。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">4. アフィリエイト広告について</h2>
          <p>
            本サービスでは、楽天グループ株式会社が提供する楽天アフィリエイト（楽天アフィリエイト・プログラム）を利用し、一部スポットの詳細ページにチケット・予約へのリンクを掲載することがあります。また、株式会社もしもが提供するもしもアフィリエイトを利用し、PC表示時の左右余白などにバナー広告を掲載することがあります。利用者が当該リンク経由で商品・サービスを購入した場合、当方に紹介料が支払われることがあります。
          </p>
          <p>
            各リンク付近および本ポリシーにてアフィリエイト広告である旨を明示します。掲載内容はあくまで参考情報であり、料金・在庫・受付状況はリンク先の公式情報をご確認ください。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">5. 利用目的</h2>
          <p>取得した情報は、以下の目的で利用します。</p>
          <ul className="list-inside list-disc space-y-1">
            <li>本サービスの提供・維持・改善</li>
            <li>利用状況の分析および UI/UX の改善</li>
            <li>広告の配信・最適化</li>
            <li>アフィリエイトリンク経由の紹介・成果計測</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">6. 第三者提供</h2>
          <p>
            法令に基づく場合を除き、利用者の同意なしに個人情報を第三者に提供することはありません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">7. 改定</h2>
          <p>
            本ポリシーは予告なく改定する場合があります。最新の内容は本ページに掲載します。
          </p>
        </section>

        <p className="text-xs text-charcoal/50">最終更新日: 2026年9月28日</p>
      </div>
    </article>
  );
}
