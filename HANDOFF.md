# HANDOFF

最終更新: 2026-09-11

## いま何をしているか

`docs/growth-audit-2026-09-11.md` §4 の優先順で**実装中**。ユーザーから「運用はお任せ」と委任済み。
コード側の実装は終わり、型チェックとビルドが通った。**未コミット。**
並行して (a) `spot-data-curator` が `src/data/spots.ts` に駐車場・授乳室の注記を追加中、
(b) `verifier` がコード変更を独立検証中。両方の結果を待ってからコミット → `main` へ push → 本番確認。

## 今回やったこと（2026-09-11、未コミット）

| ファイル | 変更 |
|---|---|
| `public/_headers` | `/spots/*` → `/spots/*.webp`（30日キャッシュを画像だけに限定） |
| `src/app/layout.tsx` | フッターの `hidden md:block` を外しモバイルでも表示。`main` の `pb-28` をフッター `pb-28 md:pb-6` に移動 |
| `src/lib/seo.ts` | `reportMailto(pageName, path)` を追加（件名にページ名、本文に URL） |
| `src/components/spot-collection.tsx` | 自己リンクだった誤り報告を `reportMailto` の mailto に変更 |
| `src/components/share-button.tsx` | 新規。`navigator.share`、非対応ならクリップボードにコピー。「家族に送る」 |
| `src/app/spots/[id]/page.tsx` | 見出し下に `ShareButton`、末尾に誤り報告 mailto |
| `src/lib/spot-collections.ts` | `AGE_HEADINGS` / `isAgeTag` / `spotsByAge` / `indexableAges` / `collectionPath.age` |
| `src/app/spots/age/[age]/page.tsx` | 新規。年齢別一覧 + Q&A（市町村別件数・授乳室・雨・無料） |
| `src/app/sitemap.ts` | `ageRoutes` を追加 |
| `src/app/page.tsx` | `/spots?age=` の5箇所を `collectionPath.age()` に変更 |
| `src/app/spots/page.tsx` | 「年齢からさがす」の導線を追加 |
| `src/app/spots/feature/[feature]/page.tsx` | `rainOk` ページだけに `TyphoonSection`（`typhoonOk` 17件を列挙） |
| `.claude/launch.json` | 新規。`pnpm preview` を 4173 で起動するプレビュー設定（コミットしない） |
| `docs/growth-audit-2026-09-11.md` | 調査結果（コミット `bc96997` で push 済み） |

## 検証済みの事実

### 自分で実行して確認（2026-09-11）

- `pnpm typecheck` … 成功、エラー出力なし
- `pnpm build` … 成功。`Generating static pages (167/167)`
- `out/spots/age/` に `0` `1-3` `4-6` `school` の4ディレクトリ
- `out/sitemap.xml` の `<loc>` **123**（従来119 + 年齢4）
- `out/index.html` に `spots?age=` **0件**、`href="/spots/age/` **7件**
- `out/_headers` の該当行が `/spots/*.webp`
- `out/spots/naha-airport-kids/index.html` に「家族に送る」1回、`mailto:info@nexeed-lab.com?subject=` あり
- `out/spots/city/naha/index.html` にも mailto あり
- `out/spots/feature/rain/index.html` に h2「台風のときはどこに行ける？」、「台風のときにも利用できる施設は 17 件」
- `out/spots/age/0/index.html` の title「沖縄で0歳の赤ちゃんと行ける子連れスポット｜うちなー子連れマップ」、h1 同文、48件
- ローカルプレビュー（375px）でスポット詳細を開き、年齢バッジの下に「家族に送る」ボタンが描画されているのをスクリーンショットで確認
- 年齢ページ `/spots/age/0/` をスクリーンショットで確認（パンくず「ホーム / スポットをさがす / 0歳」、h1、リード、一覧48件）

### 調査で取得した実測値

`docs/growth-audit-2026-09-11.md` §1 と、下の「GSC の実測ベースライン」を参照。

## 未検証のもの（推測であって事実ではない）

- **`verifier` の判定は未着**。フッターのモバイル表示（下部ナビと重ならないか）は CSS からの推論で、画面では未確認
- **`spot-data-curator` の結果は未着**。spots.ts の注記追加は取り込んでいない
- 雨の日ページの台風セクションは HTML と `find` で存在確認したが、スクリーンショットは取得に失敗（ページが長くタイムアウト）
- 共有ボタンを実際に押した動作は未確認（Web Share API はローカルの HTTP では動かない可能性）
- 「注記を厚くすれば順位・CTR が上がる」は仮説。デプロイ後4週間で GSC の該当クエリで測る
- **デプロイは未実行。本番は `bc96997`（docs のみ）の状態**

## 次にやること

1. `verifier` と `spot-data-curator` の結果を受け取る。不合格なら直す
2. `pnpm typecheck && pnpm build` を再実行（spots.ts の変更を含めるため）
3. コミット（`.claude/launch.json` は含めない）→ `git push origin HEAD:main`
4. 数分後、本番を curl して確認:
   ```bash
   curl -sI https://uchina-map.nexeed-lab.com/spots/naha-airport-kids/ | grep -i cache-control
   curl -s https://uchina-map.nexeed-lab.com/sitemap.xml | grep -c "<loc>"
   curl -s https://uchina-map.nexeed-lab.com/spots/age/0/ | grep -o "<title>[^<]*"
   ```
   期待値: `max-age=0, must-revalidate` / 123 / 年齢ページの title
5. GSC で `/spots/age/0/` 等4件と、注記を足したスポットの URL 検査 → インデックス登録リクエスト
6. HANDOFF を「デプロイ済み」に書き直す
7. **2026-09-28 以降**: CTR 実験の答え合わせ。**2026-10-09 以降**: 注記追加ページの「施設名 駐車場／授乳室」クエリの順位・CTR を §1 の表と比較

## 触ってはいけないところ

- **成績の良いページ**: `naha-main-place`(CTR 8.6%) / `ginowan-tropical-beach` / `tomi-toyosaki-beach` / `chatan-araha-park` / `tomi-dmm-aquarium`。注記の追加は可、name / description / seoTitle / features は不変
- `src/lib/seo.ts` の `pageMetadata()` は全ページが通る共通関数。`titleAbsolute` の既定値 false を変えない
- `src/app/sitemap.ts` の市町村×設備40件の除外は**意図的**
- `public/_headers` の**セキュリティヘッダ**と `_next/static` の immutable は変えない
- `next.config.ts` の `output: "export"` / `trailingSlash: true` / `images.unoptimized: true`
- スポットの事実は `src/data/spots.ts` が唯一の出所
- FAQPage の JSON-LD は追加しない（Google は行政・医療サイト以外に FAQ リッチリザルトを出さない）
- ワークツリーで作業中。**stash スタックは本体と共有**なので素の `git stash` を使わない
- `/spots/?age=0` のクエリ版絞り込みは UI として残す（canonical は `/spots/`）

## GSC の実測ベースライン（答え合わせに使う。消さないこと）

プロパティ `sc-domain:uchina-map.nexeed-lab.com`、期間 08/12〜09/08（28日）。取得 2026-09-11。

- 全体: クリック65 / 表示2,639 / CTR 2.5% / 順位10.1（前期 47 / 2,100 / 2.2% / 9.8）
- インデックス: 登録済み127 / 未登録94（検出-未登録44、代替27、リダイレクト17、クロール済み未登録6）
- 外部リンク 0 / 内部 11
- 表示多・クリック0: 浦添大公園 駐車場 87（順位29.6）/ おきみゅー 駐車場 46（9.9）/ 那覇空港 赤ちゃん 遊び場 22 /
  アメリカンビレッジ 授乳室 20（7.0）/ パルコシティ 授乳室 18（9.5）/ メインプレイス 授乳室 14（9.4）/ 沖縄県立博物館 駐車場 8（33.4）
- 上位ページ: naha-main-place 24クリック/280表示 / naha-airport-kids 6/490（前期913）/ urasoe-parco-city 3/219 /
  naha-okimu 3/169 / urasoe-asobi-park-kyozuka 3/158（前期0）
- 8ページの CTR 実験（変更後 08/29〜09/10 / 前 08/16〜08/28）: urasoe-parco-city 1/97/7.6（1/101/9.6）/
  urasoe-daikoen 0/42/35.5（0/67/17.6）/ nanjo-okinawa-world 0/51/11.3（0/20/8.4）/ naha-okimu 3/113/10.4（0/47/8.9）/
  naha-shuri-castle-park 2/40/7.4（1/37/9.6）/ tomi-dmm-aquarium 2/17/4.4（0/12/6.5）/ ginowan-harmony-chafe 0/8/6.4 /
  naha-mori-no-ie-minmin 0/9/11.6
- Cloudflare Web Analytics 30日: 訪問120 / PV170 / Google 70・サイト内50・Yahoo 30・直接20 / Mobile 130

## 再利用可能な出典

**沖縄県バリアフリーマップ** `http://okinawa-bf-map.jp/facility-info/detail?facility_id=<ID>`
授乳室・ベビーベッド・多目的トイレ・ベビーカー貸出・給湯・駐車台数が構造化されて載っている。
**HTTPS は証明書不一致で `WebFetch` が失敗する。`curl` で `http://` のまま取る。**

**おきなわ子育て応援パスポート** `kosodate.pref.okinawa.jp` … 県事業、応援店 1,801件、授乳室・給湯・キッズルーム・座敷で絞り込み可。

## デプロイ手順

- Cloudflare Workers の静的アセット配信。`wrangler.jsonc` が `assets.directory: "./out"` を指定
- **`main` への push で Cloudflare Workers Builds が走る**（反映まで数分）
- `git push origin HEAD:main` はこの環境で動作する。403 が返った場合のみ GitHub MCP に切り替える
