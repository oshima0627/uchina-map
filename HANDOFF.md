# HANDOFF

最終更新: 2026-09-11

## いま何をしているか

**手薄な中北部へのスポット追加**（ユーザー指示 2026-09-11）。docs §4-8。
2班の `spot-data-curator` が計 **11件** を追加し、`types.ts` に今帰仁村を追加。86→**97件**、15→**16市町村**。
`verifier` 12条件合格 → `main` に push（`d95f13f`）→ **本番反映を確認済み**（2026-09-11）。
残りは GSC の登録リクエスト（`seo-analyst` 実行中。本日すでに12件送っているため上限で止まる可能性あり）。
- 北部班 **完了**（末尾に7件追加、`types.ts` の `CITIES` 末尾に `"nakijin"`、`CITY_LABELS` に `nakijin: "今帰仁村"`）:
  `nakijin-castle`（今帰仁城跡）/ `nakijin-kouri-ocean-tower` / `nakijin-kouri-beach` / `onna-onnanoeki`（おんなの駅）/
  `onna-ryukyu-mura`（琉球村）/ `nago-21seiki-forest`（21世紀の森公園）/ `motobu-bise-fukugi`（備瀬のフクギ並木）
- 中部班 **完了**（`nago-ufuya` の直前に4件追加、`types.ts` は未変更、typecheck 成功、Zod 4件 OK、id 重複なし、総数 90）:
  `uruma-katsuren-castle`（勝連城跡・あまわりパーク）/ `uruma-ikei-beach`（伊計ビーチ）/ `okinawa-koza-sports-park`（コザ運動公園 アスレチック広場）/ `yomitan-zakimi-castle`（座喜味城跡・ユンタンザミュージアム）。
  **見送り**: 八重島公園（駐車場の公式記載なし）、北谷公園（遊具の公式記載なし）

`verifier` の指摘で `motobu-bise-fukugi` の `strollerFriendly` を false にした（未舗装の小道で根拠なし）。
他の指摘（description 内の数字は `websiteUrl` が暗黙の出典、`parkingNote` が2出典に触れるのに `source` は1つ）は今回は据え置き。

これより前の作業（docs §4 の「今週」「今月」項目）は**本番反映まで確認済み**（下記）。

## 今回やったこと

### 進行中（未コミット）

- `src/app/page.tsx` … トップの古い文言「沖縄本島南部・親子のお出かけ」「沖縄南部のスポットを地図で」を「沖縄本島」に変更（北部が増えるため）
- `src/data/spots.ts` … 中部班4件（+172行）+ 北部班7件（+354行）。`src/lib/types.ts` … +2行（nakijin）
- 北部班の裏が取れず明示した判断: `motobu-bise-fukugi` の `parkingFree: false`（観光協会は駐車場「有」のみで料金不明。保守的に有料表示）、
  `onna-ryukyu-mura` の `parkingFree: true`（BFマップ「駐車料支払機 無」から）、`nakijin-kouri-ocean-tower` の `isIndoor/rainOk: true`（建物内施設からの判断）、
  `strollerFriendly: true` に根拠が無いもの: 古宇利オーシャンタワー・おんなの駅・21世紀の森・備瀬。
  書かなかった: 古宇利ビーチと備瀬の `price`/`businessHours`/電話、21世紀の森の遊具（Park-PFI 募集段階）、琉球村の最終受付
- 中部班の裏が取れず書かなかった項目: 勝連城跡の授乳室・オムツ替え（公式・市・BFマップに記載なし）、伊計ビーチの駐車料金の公式記載（おきなわ物語の「入場料込み」で `parkingFree: false`）、コザ運動公園のトイレ設備と平面駐車場の料金（`parkingFree: true` は立体駐車場の公園利用者無料が根拠）、座喜味城跡の授乳室・多目的トイレ。`strollerFriendly: false` は勝連・座喜味とも「石段・高台」からの推論でコメント明記

### 中北部追加の `verifier` 独立検証（総合判定 合格、12条件）

既存86件に削除行 0、`types.ts` の差分2行のみ、新規11件すべてで `hasParking`/`parkingFree`/`strollerFriendly`/`isIndoor` を明示、
`parkingNote`/`nursingNote` の出典URL 18本すべてが `out/` の HTML に出力、`/map/` は「97件表示中」で北部にクラスタと今帰仁城跡のマーカー。

### 中北部追加のデプロイ後の本番 curl（2026-09-11、push から約1分で反映）

- `sitemap.xml` の `<loc>` **135**
- `/spots/city/nakijin/` `/spots/nakijin-castle/` `/spots/uruma-katsuren-castle/` `/spots/onna-ryukyu-mura/` `/spots/motobu-bise-fukugi/` … すべて HTTP 200、title はテンプレート生成
- トップの市町村統計 16、「南部」の出現 0
- 備瀬に「ベビーカーでの移動には向きません」
- `naha-main-place` の title 不変

### 中北部追加のビルド結果（自分で実行、2026-09-11）

- `pnpm typecheck` 成功。`pnpm build` 成功、**184ページ**（従来167）
- `grep -c 'id: "' src/data/spots.ts` = **97**。`out/sitemap.xml` の `<loc>` = **135**（123 + 11 + `/spots/city/nakijin/`）
- `out/spots/` = 199 エントリ。`out/spots/city/nakijin/index.html` の title「今帰仁村の子連れOKスポット｜うちなー子連れマップ」
- `out/spots/nakijin-castle/` に出典 `nakijinjoseki-osi.jp`、`out/spots/uruma-katsuren-castle/` に `katsuren-jo.jp`
- トップの市町村統計が 16。備瀬は「駐車場あり（有料）」表示

### 完了・push 済み（2026-09-11、`main`: `c588196` `dce5c09` `9a73432` `144177c` `0daec90`）

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
| `.claude/launch.json` | 新規。`pnpm preview` を 4173 で起動するプレビュー設定（自動コミットに含まれた。害はないので残す） |
| `src/data/spots.ts` | `spot-data-curator` が8スポットに `parkingNote` / `nursingNote` を追加（出典つき、+74行）。加えて出典と矛盾したものを修正: `urasoe-daikoen` の `hasNursingRoom` / `hasDiaperTable` を false（県バリアフリーマップ 2020-05 に「無」。従来の true に根拠なし）、`chatan-american-village` の `hasNursingRoom` を false（公式・観光協会・BFマップに記載なし）、`kitanakagusuku-sans-souci` の営業時間を公式の `11:00-16:00（L.O. 15:00）`・無休に。`urasoe-daikoen` の seoTitle / seoDescription から裏の取れない「無料」を外した |
| `docs/growth-audit-2026-09-11.md` | 調査結果（コミット `bc96997` で push 済み） |

## 検証済みの事実

### 自分で実行して確認（2026-09-11）

- `pnpm typecheck` … 成功、エラー出力なし（データ変更後にも再実行して成功）
- `pnpm build` … 成功。`Generating static pages (167/167)`（データ変更後にも再実行して成功）
- データ変更後の `out/` で確認: `urasoe-daikoen` の title「浦添大公園の駐車場はどこ？滑り台に近いのはC-2」、本文に「C-2駐車場が近いです」、`kitanakagusuku-sans-souci` に「11:00-16:00（L.O. 15:00）」、`kitanakagusuku-aeon-rycom` に「赤ちゃんルームは2階…」と出典 `guide/equipment`
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

### `verifier` の独立検証（総合判定 合格）

9条件すべて合格。375px の画面でフッターが下部ナビと重ならず「このサイトについて」が見えること、
`/spots/?age=0` のクエリ版絞り込みが引き続き動くこと（48件）、`naha-main-place` と `onna-manzamo` の
title が本番と完全一致することを確認。差分に `any` / `@ts-ignore` / 設定ファイル変更なし。

### デプロイ後に本番を curl して確認（2026-09-11、push から約2分半で反映）

- `sitemap.xml` の `<loc>` **123**
- `/spots/naha-airport-kids/` と `/spots/city/naha/` … `Cache-Control: public, max-age=0, must-revalidate`（30日キャッシュが外れた）
- `/spots/card/新都心公園.webp` … `max-age=2592000`（画像の30日キャッシュは維持）
- `/spots/age/0/` … title「沖縄で0歳の赤ちゃんと行ける子連れスポット｜うちなー子連れマップ」
- `/spots/urasoe-daikoen/` … title「浦添大公園の駐車場はどこ？滑り台に近いのはC-2」、本文に「C-2駐車場が近い」
- `/spots/naha-okimu/` に「一般駐車場158台」、`/spots/kitanakagusuku-aeon-rycom/` に「赤ちゃんルームは2階」
- `/spots/naha-airport-kids/` に「家族に送る」、`/spots/feature/rain/` に「台風のときはどこに行ける？」
- トップの `href="/spots/age/` **7本**（0歳が4、他3）、`spots?age=` **0**
- `naha-main-place` の title は不変、フッターは `border-t border-border pt-6 pb-28 md:pb-6 mt-12`

### GSC インデックス登録リクエスト（2026-09-11、`seo-analyst` が画面で実行）

12件すべて「インデックス登録をリクエスト済み」。上限による拒否なし（`nanjo-okinawa-world` は1回目に一時エラー、再試行で成功）。
- 新規の年齢ページ4件: 「URL が Google に登録されていません」「参照元サイトマップが検出されませんでした」（sitemap の前回読み込みが 09/08 でデプロイ前のため）
- 注記を更新した8件: すべて登録済み。前回クロールは 08/31〜09/10 でデプロイ前。本文更新の反映は再クロール後
- 参照元ページとして `/spots/?age=0`（sans-souci）や `/spots?city=ginowan`（rycom）のクエリ版 URL が検出されていた。
  次回の URL 検査でディレクトリ型（`/spots/age/0/` 等）に変わるかが観測点

### 調査で取得した実測値

`docs/growth-audit-2026-09-11.md` §1 と、下の「GSC の実測ベースライン」を参照。

## 未検証のもの（推測であって事実ではない）

- データの裏が取れず**そのままにしたもの**: `urasoe-daikoen` と `kitanakagusuku-sans-souci` の `parkingFree`（既定 true のまま。料金の記載を公式・市・県で見つけられず）、`kitanakagusuku-sans-souci` の `hasDiaperTable` と description の「オムツ替え台」（公式は「ベビーベッド完備」のみ）、`urasoe-daikoen` の `hasMultipurposeToilet`（BFマップは「無」だが同ページ本文に車椅子トイレの記載あり）
- `naha-main-place` の授乳室の階・室数は公式に記載がなく書いていない（非公式の「1F/2F・4室」は採用せず）
- 共有ボタンを実機で押した動作は未確認（HTML に描画されていることのみ確認）
- 「注記を厚くすれば順位・CTR が上がる」は仮説。**2026-10-09 以降**に GSC の該当クエリで測る
- 年齢ページが索引され表示回数がつくかは未検証
- 年齢ページ4件が sitemap 経由で検出されるかは、GSC が sitemap を再読み込みしてから分かる（前回読み込み 09/08）

## 次にやること

1. `seo-analyst` の登録リクエスト結果を記録する。上限で送れなかった分は**翌日以降に送る**（対象は新規11件 + `/spots/city/nakijin/`）
2. 見送った八重島公園・北谷公園は、駐車場・遊具の一次情報が取れたら追加する
3. **2〜7日後**: GSC で年齢ページ4件が「登録済み」になったか、sitemap の検出ページ数を確認
4. docs §4: 飲食店の「座敷」「個室」「夜営業」フラグ追加（`types.ts` の `FeaturesSchema` 変更が要る）。
   出典はおきなわ子育て応援パスポート（座敷で絞り込める）
5. 裏の取れなかった事実の再調査: 浦添大公園の駐車料金と授乳室、サンスーシーのオムツ替え台、備瀬のフクギ並木の駐車料金とベビーカー可否
6. **2026-09-28 以降**: CTR 実験の答え合わせ。**2026-10-09 以降**: 注記追加8ページの「施設名 駐車場／授乳室」クエリの順位・CTR を下のベースラインと比較。年齢ページ4件の表示回数も見る
7. 外部リンク: うちなーマネーの表示急落の原因調査（別タスク）のあとにリンクを張る。掲載依頼（ママモネ・mamasky・fun okinawa）は**送信前に必ず許可を取る**

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
