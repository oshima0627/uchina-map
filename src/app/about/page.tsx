import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "このサイトについて",
  description:
    "うちなー子連れマップの運営者情報とお問い合わせ先。沖縄県内の子連れで安心して行ける場所を、授乳室・オムツ替え台・ベビーカー可・駐車場・雨の日OKといった条件で探せるサイトです。",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary-700">About</p>
        <h1 className="text-3xl font-bold text-charcoal">このサイトについて</h1>
      </header>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-charcoal/85">
        <p>
          沖縄県内の「子連れで安心して行ける場所」を、授乳室・オムツ替え台・ベビーカー可・駐車場・雨の日OK といった、親が本当に知りたい条件で探せるようにしたサイトです。
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">運営者</h2>
          <p>Nexeed Lab</p>
          <p>
            お問い合わせ:{" "}
            <a className="text-primary-700 hover:underline" href="mailto:info@nexeed-lab.com">
              info@nexeed-lab.com
            </a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">掲載情報の集め方</h2>
          <p>掲載している設備情報は、次の一次情報にあたって確認しています。</p>
          <ul className="list-inside list-disc space-y-1">
            <li>各施設の公式サイト</li>
            <li>沖縄県バリアフリーマップ（沖縄県）</li>
            <li>市町村・観光協会の公式サイト</li>
          </ul>
          <p>
            駐車場の台数や料金、営業時間、利用料金といった数字を載せるときは、出典と確認した時期をスポットのページに明記しています。裏が取れなかった情報は掲載していません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">情報の誤りを見つけたら</h2>
          <p>
            施設の設備や営業時間は変わります。掲載内容に誤りを見つけられた際は{" "}
            <a className="text-primary-700 hover:underline" href="mailto:info@nexeed-lab.com">
              info@nexeed-lab.com
            </a>{" "}
            までお知らせください。確認のうえ修正します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal">広告について</h2>
          <p>
            本サイトでは Google AdSense による広告を配信しています。詳しくは
            <Link className="text-primary-700 hover:underline" href="/privacy">
              プライバシーポリシー
            </Link>
            をご覧ください。
          </p>
        </section>
      </div>
    </article>
  );
}
