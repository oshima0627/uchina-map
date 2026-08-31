# HANDOFF

最終更新: 2026-08-31

## いま何をしているか

「サイトを育てたい（＝検索流入を増やしたい、主軸は沖縄旅行に来る子連れ観光客）」という目的に対し、
Google Search Console の実測値からボトルネックを特定し、対策を実装した。
**実装・デプロイともに完了し、本番で反映を検証済み。**
次は GSC 側の操作（インデックス登録リクエスト）と、4週間後の答え合わせ。

## GSC で測った事実（Claude in Chrome で直接取得。プロパティ `sc-domain:uchina-map.nexeed-lab.com`）

期間 2026/05/29〜2026/08/28（90日）。

### 全体
- クリック 139 / 表示回数 5,170 / CTR 2.7% / 平均掲載順位 9.6
- `naha-airport-kids` が表示 2,331（全体の45%）、クリック 34、CTR 1.5%
- `naha-main-place` が表示 557、クリック 43、CTR 7.7%
- この2ページで全クリックの55%（77/139）

### インデックス登録レポート
- 登録済み 94 / 未登録 121
- 内訳: 検出-インデックス未登録 **79**、代替ページ（canonicalあり）23、リダイレクトあり 17、クロール済み-未登録 2
- **79件すべて「前回のクロール: 該当なし」＝ 一度もクロールされていない**
- 79件の内訳: スポット詳細 29ページ + 絞り込み 50ページ
- 未クロールのスポット詳細に含まれる主要観光地: 海洋博公園、ネオパーク、ナゴパイナップルパーク、
  DINO恐竜PARK、フルーツランド、ビオスの丘、むら咲むら、イオンモール沖縄ライカム、琉球ガラス村、
  アメリカンビレッジ、キッズパレット、ワクワクキッズランド
- サイトマップ: 2026/08/07 送信、2026/08/28 最終読込、ステータス成功、検出 156 URL

### リンクレポート
- **外部リンク 合計 0 件**
- 内部リンク 合計 11 件（Google が認識している数）

### 索引済みなのにクリック0のクエリ
- 浦添大公園 駐車場 157表示 0クリック
- おきなわワールド 駐車場 49表示 0クリック
- メインプレイス 授乳室 40表示 0クリック
- パルコシティ 授乳室 29表示 0クリック
- おきみゅー 駐車場 21表示 0クリック
- 流入クエリ123件の大半が「施設名 + 駐車場 / 授乳室 / キッズスペース」

### 絞り込みページの実績（90日）
- 66ページ合計で 26表示・0クリック（サイト全体の表示回数の0.5%）
- うち市町村×設備は 12表示・0クリック

## 本番HTMLを curl して確認した事実

- トップページの絞り込みリンクは全て旧クエリ形式だった:
  `/spots/?city=naha` 13本、`/spots/?category=park` 8本、`/spots/?feature=rainOk` 5本。
  **ディレクトリ版 `/spots/city/naha/` へのリンクは 0本。**
- `/spots/?city=naha` の canonical は `https://uchina-map.nexeed-lab.com/spots/`。
  つまりトップの絞り込みリンク26本の評価は全て `/spots/` に吸収され、
  ディレクトリ版66ページには1本も届いていなかった（commit 8a0b942 の取りこぼし）。
- `/spots/` 側には85スポット全部と単軸ページへのリンクが実在する（リンク切れではない）。
- `naha-airport-kids` の `seoTitle`/`seoDescription` は本番に反映済み。
  （前回の HANDOFF の「デプロイは未実行」は誤り。既にデプロイされていた）
- **Cloudflare Web Analytics は稼働中**（`static.cloudflareinsights.com/beacon.min.js` を確認）。
  `src/` に埋め込みが無いのは Cloudflare 側でエッジ注入しているため。解析の追加導入は不要。

## 今回の変更（3ファイル）

### 1. `src/app/page.tsx` — 内部リンクをディレクトリ版に張り替え
`collectionPath` を import し、12箇所のリンクを差し替えた（distinct 26 URL）。
`?age=` 4本と `?feature=hasParking&minDuration=180` 1本は対応するディレクトリページが無いのでクエリのまま。

### 2. `src/app/sitemap.ts` — 市町村×設備の40ページを sitemap から除外
`cityFeatureRoutes` と未使用になった import を削除し、理由をコメントで残した。
**ページ・ルート・内部リンクは残してある**ので、配列を戻すだけで復帰できる。

### 3. `src/data/spots.ts` — 8ページに `seoTitle` / `seoDescription` を追加
対象は「表示回数60以上 かつ CTR 3%未満」で機械的に選定:
`urasoe-parco-city` / `urasoe-daikoen` / `nanjo-okinawa-world` / `naha-okimu` /
`naha-shuri-castle-park` / `tomi-dmm-aquarium` / `ginowan-harmony-chafe` / `naha-mori-no-ie-minmin`

意図的に除外（成績が良いので触らない）: `naha-main-place`(7.7%) / `ginowan-tropical-beach`(8.1%) /
`tomi-toyosaki-beach`(12.5%) / `chatan-araha-park`(25%)

書いた事実はすべて `src/data/spots.ts` の既存フィールドから取った。創作していない。

## 検証済みの事実（実際に実行して出力を確認したもの）

- `pnpm install` … 成功
- `pnpm typecheck`（`tsc --noEmit`） … 成功・エラー出力なし
- `pnpm build` … 成功。`/spots/[id]` 85件、`city/[city]/[feature]` 40件を含め全ルートSSG
- `out/index.html` を grep … `/spots/(city|category|feature)/` 形式のリンクが **distinct 26本**
  （変更前は0本）。残るクエリ形式は `?age=` 4本と `?feature=hasParking&minDuration=180` 1本のみ
- `out/sitemap.xml` … **116 URL**（変更前156）、市町村×設備は **0件**
- `out/spots/city/naha/` … `nursing` `parking` `rain` `stroller` が存在（ページ自体は残っている）
- 変更した8ページの `<title>` と `<meta name="description">` が新しい文言になっていることを
  `out/` の生成HTMLで確認。全 `seoTitle` の全角換算幅は 23.5〜27.0（30以下）
- 触っていない `naha-main-place` / `ginowan-tropical-beach` の `<title>` が
  本番の現行値と完全一致することを確認

### デプロイ後に本番を curl して確認した（2026-08-31）

- `git push origin HEAD:main` … 成功（`1f46ffb..cb5f7f5`）。Cloudflare Workers Builds が自動実行
- 本番トップの `/spots/(city|category|feature)/` 形式リンク … **distinct 26本**
- 本番トップの残存クエリ型 … `?age=` 4本と `?feature=hasParking&minDuration=180` 1本のみ
- 本番 `sitemap.xml` … **116 URL**、市町村×設備 **0件**
- `https://uchina-map.nexeed-lab.com/spots/city/naha/nursing/` … **HTTP 200**（ページは生きている）
- 変更した8ページの `<title>` が新しい文言で配信されていることを確認
- `naha-main-place` / `ginowan-tropical-beach` の `<title>` は変更前のまま

## 未検証のもの（推測であって事実ではない）

- **この変更で流入が増えるかは未検証。** 効果はGSCで実測するまで分からない
- 「検出-インデックス未登録79件」の原因を内部リンクの孤児化と断定したわけではない。
  外部リンク0件によるクロール予算不足のほうが支配的な可能性がある
- `parkingFree` を明示していないスポットが3件あり、デフォルト値 `true`（＝無料）が効いている:
  **`naha-okimu` / `naha-shintoshin-park` / `urasoe-daikoen`**。
  `urasoe-daikoen` は「浦添大公園 駐車場」が157表示の最重要クエリなので、
  新しいタイトルに「駐車場は無料・広め」と書いた。**この無料はデフォルト値であって未確認。**
  `naha-okimu` は同じ理由で意図的に「無料」と書かず「広めの駐車場」に留めた。
  3件とも公式情報で有料/無料を確認して `spots.ts` に明示すべき

## 専門エージェントを5体作成した（2026-08-31）

`.claude/agents/` に技術領域ごとの専門家を定義した。`description` に発火条件を書いてあるので、
作業内容に応じて自動で振り分けられる。追加の仕組み（コマンドやオーケストレーター）は作っていない。
`harness-agents-skills.md` の「最初からオーケストレーター・ワーカーを設計しない」に従った。

| ファイル | 担当 | Edit/Write |
|---|---|---|
| `seo-analyst.md` | GSC実測、CTR/インデックス診断、seoTitle/seoDescription、sitemap、JSON-LD | Edit のみ |
| `spot-data-curator.md` | spots.ts の事実データ、設備フラグ、出典つき parkingNote、Zod型 | あり |
| `frontend-dev.md` | Next.js/React/Tailwind のUI、見出し構造、レスポンシブ | あり |
| `deploy-operator.md` | build、wrangler、_headers、main への push、本番検証 | なし |
| `verifier.md` | 他エージェントの成果物の独立検証 | **なし（意図的）** |

`verifier` から Edit/Write を外してあるのは、`harness-agents-skills.md` の
「生成と評価を分離する」を指示ではなく構造で守るため。
ただし **`verifier` は Bash を持っている**（typecheck/build の実行に必要）ため、
シェル経由でファイルを書くことは技術的には可能。完全な封鎖ではなく、
「編集の導線を外したうえで定義文で禁止している」状態である。

5体とも frontmatter の `name` とファイル名の一致、ツール名の妥当性を検証済み。
**実際にエージェントを起動して動作確認はしていない（未検証）。**

## 次にやること

1. GSC で未クロールの観光地スポットを URL検査 → インデックス登録リクエスト（`seo-analyst` に担当させる）。
   **2026-08-31 時点で「観光地優先で10件」の実行がユーザー承認済み。未実行のまま保留中。**
   優先順: 海洋博公園 → ネオパーク → ナゴパイナップルパーク → イオンモール沖縄ライカム →
   アメリカンビレッジ → ビオスの丘 → むら咲むら → 琉球ガラス村 → DINO恐竜PARK → フルーツランド
2. `parkingFree` 未指定の3件（`naha-okimu` / `naha-shintoshin-park` / `urasoe-daikoen`）の
   駐車場料金を公式情報で確認し `spots.ts` に明示する
3. 外部リンク0件の解消（コードでは解決できない。最大のボトルネック）
4. 4週間後（2026-09-28以降）にGSCで答え合わせ:
   - B: 上の「クリック0のクエリ」表と、対象8ページのCTRを再取得
   - A: 「検出-インデックス未登録 79件 / 登録済み 94件」の推移を再取得
   改善しなければ文言を変えて再測定する

## 触ってはいけないところ

- **成績の良いページ**: `naha-main-place`(CTR 7.7%) / `ginowan-tropical-beach`(8.1%) /
  `tomi-toyosaki-beach`(12.5%) / `chatan-araha-park`(25%)。
  `seoTitle` を設定しない限り従来のテンプレートが使われる設計なので、放置でよい
- `src/lib/seo.ts` の `pageMetadata()` は全ページが通る共通関数。`titleAbsolute` の既定値 false を
  変えると全ページのタイトルが壊れる
- `public/_headers`（セキュリティヘッダとキャッシュ規則）。意味を理解せずに編集しない
- `next.config.ts` の `output: "export"` / `trailingSlash: true` / `images.unoptimized: true`。
  静的エクスポート前提なので Server Actions・ISR・middleware は使えない
- スポットの事実（階・営業時間・料金・設備）は `src/data/spots.ts` が唯一の出所。
  メタ文言に書く数字はここに無ければ書かない
- `src/app/sitemap.ts` の市町村×設備の除外は**意図的**。ページを消したわけではないので、
  「ルートがあるのに sitemap に無い」のを不整合とみなして戻さないこと

## デプロイ手順

- ホスティングは Cloudflare Workers の静的アセット配信。ルートの `wrangler.jsonc` が
  `assets.directory: "./out"` を指定。Workerスクリプト（`main`）は無い
- 手動デプロイ: `pnpm deploy`（`next build && wrangler deploy`）。`wrangler login` が必要
- 自動デプロイ: Cloudflare の Workers Builds が GitHub `oshima0627/uchina-map` と連携済み。
  `main` への push でビルド（Build command `pnpm build`）が走る
- カスタムドメイン `uchina-map.nexeed-lab.com` は Worker の Settings → Domains & Routes
