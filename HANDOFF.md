# HANDOFF

最終更新: 2026-08-25

## いま何をしているか

Google Search Console の実測値をもとに、**表示回数は多いのにクリックされていないスポット詳細ページ**の
タイトル・メタディスクリプションを、テンプレート生成から個別最適な文言に差し替える作業。
第1弾として `naha-airport-kids`（サイト全体の表示回数の約19%を占める最大の入口）に対応した。

## 今回やったこと

1. `src/lib/types.ts` の `SpotSchema` に `seoTitle` / `seoDescription`（どちらも optional）を追加。
2. `src/lib/seo.ts` の `pageMetadata()` に `titleAbsolute`（既定 false）を追加。
   true のときサイト名 `｜うちなー子連れマップ` を付けず、`title: { absolute }` でレイアウトの
   `template` をバイパスする。
3. `src/app/spots/[id]/page.tsx` の `generateMetadata()` で、`seoTitle` / `seoDescription` が
   設定されているスポットだけ上書きを使う分岐を追加。未設定のスポットは従来どおりテンプレート生成。
4. `src/data/spots.ts` の `naha-airport-kids` に `seoTitle` / `seoDescription` を設定。

## 検証済みの事実（実際に実行・取得して確認したもの）

### 変更前（2026-08-25 に本番 https://uchina-map.nexeed-lab.com を curl して取得）

- naha-airport-kids
  - title: `那覇空港 キッズスペース（那覇市）の子連れ情報｜うちなー子連れマップ`（全角34文字）
  - description: `那覇空港 キッズスペース（那覇市）の子連れ情報。授乳室あり・オムツ替え台あり・駐車場あり（有料）・雨の日OK。飛行機を見ながら遊べる空港内施設`（71文字）
  - h1: `那覇空港 キッズスペース`
  - OGP: og:title / og:description は上記と同一。og:url・og:image・og:locale・twitter:card(summary_large_image) あり。
- naha-main-place
  - title: `サンエー那覇メインプレイス（那覇市）の子連れ情報｜うちなー子連れマップ`（35文字）
  - description: `サンエー那覇メインプレイス（那覇市）の子連れ情報。授乳室あり・オムツ替え台あり・駐車場無料（広め）・雨の日OK。子連れ向け設備が揃う大型モール`（71文字）

**両ページはまったく同じテンプレートから生成されている**（`generateMetadata` の1箇所）。
つまり CTR 5倍差は「テンプレートの出来の違い」では説明できない。差分として確認できたのは以下。

- naha-main-place は施設名そのものが検索語（指名／ナビゲーショナル検索）。テンプレの定型文でもクリックされる。
- naha-airport-kids の主要クエリ「那覇空港 キッズスペース」は情報検索で、知りたいのは
  **どこにあるか（ターミナル・階）・営業時間・授乳室の有無**。旧タイトルは「（那覇市）の子連れ情報」という
  中身のない定型句で、その答えが1つも入っていない。
- 旧タイトルは34文字で、サイト名 `｜うちなー子連れマップ` が末尾11文字を占める。日本語SERPの表示上限
  （おおむね30文字前後）を超えるため、後半は切れる可能性が高く、その11文字はクリック誘因になっていない。
- 旧ディスクリプションは設備フラグの羅列で、**全スポットで同じ語がほぼ同じ順に並ぶ**ため差別化がない。

### 変更後（`pnpm build` の生成物 `out/spots/naha-airport-kids/index.html` を grep して確認）

- title: `那覇空港 キッズスペースはどこ？国内線2F・授乳室あり`（全角27文字）
- description: `那覇空港のキッズスペースは国内線ターミナル2Fにあります。飛行機を眺めながら遊べて、授乳室・オムツ替え台・多目的トイレも利用可。利用は無料で5:30-22:00、駐車場は有料。子連れの待ち時間や乗り継ぎの時間調整に。`（108文字）
- og:title / twitter:title も同じ文字列に更新されている（サイト名は付かない）
- canonical は `https://uchina-map.nexeed-lab.com/spots/naha-airport-kids/` のまま
- h1 は `那覇空港 キッズスペース` のまま（すでに主要クエリを含むため未変更）

新しい文言に書いた事実は、すべて `src/data/spots.ts` の既存フィールドから取った。創作していない。
- 国内線ターミナル2F → `floor: "国内線ターミナル 2F"`
- 5:30-22:00 → `businessHours: "5:30-22:00"`
- 無料 → `price: { adult: 0, free: true }`
- 授乳室・オムツ替え台・多目的トイレ → `features` の各フラグ true
- 駐車場は有料 → `hasParking: true, parkingFree: false`

### naha-main-place は未変更

ビルド生成物 `out/spots/naha-main-place/index.html` の title / description / og:* が
本番の現行値と完全一致することを確認済み。

### コマンドの実行結果

- `pnpm install` … 成功（`node_modules` が無い状態だったので実行が必要だった）
- `pnpm typecheck`（`tsc --noEmit`） … 成功・エラー出力なし
- `pnpm build` … 成功。`/spots/[id]` が85件 SSG（`+82 more paths` 表示）、静的エクスポート `out/` 生成

## 未検証のもの（推測であって事実ではない）

- **この変更でCTRが上がるかどうかは未検証**。効果はGSCで実測するまで分からない。
  再クロール・スニペット再生成には数日〜数週間かかる。Googleがタイトルを書き換える可能性もある。
- GSCが警告している「naha-airport-kids の表示回数 68%減」の原因は特定していない。
  今回の変更はCTR対策であって、表示回数減の対策ではない。別問題として調査が必要。
- 「タイトルが34文字でSERPで切れていた」は日本語SERPの一般的な表示幅からの推定であり、
  実際の検索結果画面で切れていることを確認したわけではない。
- **デプロイは未実行**。本番は変更前のままである。

## 次にやること

1. デプロイ（下記「デプロイ手順」参照）。デプロイ後に本番HTMLを curl して反映を確認する。
2. デプロイ後、GSC で `https://uchina-map.nexeed-lab.com/spots/naha-airport-kids/` を URL検査 →
   インデックス登録をリクエストして再クロールを促す。
3. 2〜4週間後にGSCで CTR を再計測する。改善したら、同じ `seoTitle` / `seoDescription` の仕組みを
   他の「表示回数が多いのにCTRが低い」ページへ横展開する。改善しなければ文言を変えて再測定する。
4. 表示回数68%減の原因調査（別タスク）。

## デプロイ手順（このリポジトリでの実際の構成）

- ホスティングは **Cloudflare Workers の静的アセット配信**（旧 Cloudflare Pages）。
- ルートの `wrangler.jsonc` が `assets.directory: "./out"` を指定。Workerスクリプト（`main`）は無い。
- 手動デプロイ: `pnpm deploy`（中身は `next build && wrangler deploy`）。`wrangler` は devDependencies に入っている。
  Cloudflare アカウントへのログイン（`wrangler login`）が必要。
- 自動デプロイ: Cloudflare ダッシュボードの Workers Builds で GitHub リポジトリ `oshima0627/uchina-map`
  と連携済み。`main` への push でビルド（Build command `pnpm build`）が走る想定。
- カスタムドメイン `uchina-map.nexeed-lab.com` は Worker の Settings → Domains & Routes で設定。

## 触ってはいけないところ

- **`src/data/spots.ts` の `naha-main-place`**。CTR 7.1% と成績が良いので現状維持。
  同様に、成績の良いページのテンプレート出力を変えないこと（`seoTitle` を設定しない限り従来の
  テンプレートがそのまま使われる設計にしてある）。
- `public/_headers`（セキュリティヘッダとキャッシュ規則）。意味を理解せずに編集しない。
- `next.config.ts` の `output: "export"` / `trailingSlash: true` / `images.unoptimized: true`。
  静的エクスポート前提の構成なので Server Actions・ISR・middleware は使えない。
- `src/lib/seo.ts` の `pageMetadata()` は全ページが通る共通関数。`titleAbsolute` の既定値 false を
  変えると全ページのタイトルが壊れる。
- スポットの事実（階・営業時間・料金・設備）は `src/data/spots.ts` が唯一の出所。
  メタ文言に書く数字はここに無ければ書かない。
