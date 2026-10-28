# 運用台帳（変更履歴と効果比較）

SEO・収益導線まわりの変更を日付つきで記録し、あとで GSC の数値と比較するための台帳。

## 2026-10-28 の変更

| # | 変更 | 主なファイル | PR | 目的 | 比較日（+14日 / +28日） |
|---|------|--------------|----|------|--------------------------|
| 1 | 13スポットの title / description を個別に上書き。タイトル生成の括弧二重化（例: `与儀公園（汽車のある公園）（那覇市）`）を解消 | `src/data/seoOverrides.ts`（新規）, `src/lib/seo.ts`, `src/app/spots/[id]/page.tsx` | #11 | 検索結果の CTR 改善。クエリに合う事実（駐車場台数・授乳室・ベビーカー等）を title に入れる | 2026-11-11 / 2026-11-25 |
| 2 | sitemap の `lastmod` をビルド時刻ではなくページごとの実日付に変更。`DATA_UPDATED_AT` と `SPOT_UPDATED_AT` を新設 | `src/data/dataUpdatedAt.ts`（新規）, `src/app/sitemap.ts` | #11 | 更新日の誠実な通知。スポット単位の更新日欄がないため、既定は最後に内容を変えた日 `2026-09-11`、本日変更したスポットは `2026-10-28` | 2026-11-11 / 2026-11-25 |
| 3 | スポット JSON-LD に `dateModified` を追加（sitemap と同じ日付） | `src/lib/seo.ts` | #11 | 構造化データの更新日を sitemap と一致させる | 2026-11-11 / 2026-11-25 |
| 4 | `/spots/?category=...` などのパラメータURLの canonical を、単一軸なら該当コレクションページ、複数軸・`q` 指定なら `/spots/` に切り替え（hydrate 後にクライアントで書き換え）。sitemap には元々含めない | `src/lib/spot-collections.ts`, `src/app/spots/spots-browser.tsx` | #11 | パラメータURLの重複評価を避ける（robots / noindex は使わない） | 2026-11-11 / 2026-11-25 |
| 5 | 楽天CTAのない高流入14スポットに「あわせてチェック」(PR) を追加（楽天オファー最大2件、近い順、開示文12px、`rel="sponsored nofollow noopener noreferrer"`） | `src/lib/related-offers.ts`（新規）, `src/components/ads/related-offers-section.tsx`（新規）, `src/app/spots/[id]/page.tsx` | #12 | 既存の楽天オファーへの導線を、関連スポットの手前に明示的な広告として置く。AdSense広告ユニットは追加していない | 2026-11-11 / 2026-11-25 |
| 6 | 授乳室ありの設備ページ・ビーチ・水族館・0歳ページに、データから生成した導入文（200〜350字）と「選び方・確認していること」を一覧の上に静的描画 | `src/lib/collection-editorial.ts`（新規）, `src/components/spot-collection.tsx`, 一覧ページ3ファイル | #12 | 一覧ページの独自性・読み応えの補強（数値はすべて spots.ts から集計） | 2026-11-11 / 2026-11-25 |
| 7 | 本台帳を追加 | `docs/ops-ledger.md` | #13 | 変更と比較日の記録 | — |
| 8 | 授乳室メモ（`nursingNote`）を17件追加。`hasNursingRoom: true` で未記入だった27件中、公式の一次情報で確認できた分のみ。残り10件は空（確認できず8件、公式と食い違い2件） | `src/data/spots.ts` | #14 | 詳細ページの Q&A（授乳室）に出典・確認月つきの回答を表示。数値・場所は出典に書かれたものだけを記載 | 2026-11-11 / 2026-11-25 |
| 9 | 駐車場メモ（`parkingNote`）を30件追加。`hasParking && parkingFree` で未記入だった48件中、公式の一次情報で確認できた分のみ。残り18件は空（確認できず13件、公式と食い違い5件）。料金・台数が出典に無い場合は「確認できていません」と明記 | `src/data/spots.ts` | #15 | 同上（駐車場の Q&A） | 2026-11-11 / 2026-11-25 |

### 補足
- スポット単位の更新日欄は無い。`DATA_UPDATED_AT`（2026-09-11）は spots.ts の内容を最後に変えた日。別作業で spots.ts（授乳・駐車メモ）が更新された場合は、マージ後に `DATA_UPDATED_AT` と該当スポットの `SPOT_UPDATED_AT` を更新すること。
- `seoOverrides.ts` の title / description は spots.ts の現在の事実に基づく。spots.ts の該当項目が変わったら併せて見直すこと。
- パラメータURLの canonical は静的HTMLでは `/spots/` のまま、hydrate 後に書き換わる（Google は JavaScript を描画する）。
- `/spots/naha-main-place/`（CTR 7.9%）は title を変更していない。「あわせてチェック」(PR) のみ追加。

### 2026-10-28 授乳室・駐車場メモの追加（#14・#15）で残した宿題
- フラグと公式情報が食い違い、フラグ・メモとも**変更していない**スポット（スキーマに「要確認」の表示がないため）:
  - 授乳室: `tomi-senagajima`（公式FAQは「授乳室はご準備しておりません」）、`ginowan-maririn`（県バリアフリーマップ 2018-06 は授乳室「無」）
  - 駐車場無料: `tomi-toyosaki-beach`（有料・最初の10分無料）、`naha-shintoshin-park`（公園内は有料駐車場）、`naha-yogi-park`（駐車場なし）、`itoman-himeyuri`（専用駐車場なし）、`naha-wakasa-park`（有料・30分以内無料）
- 一次情報が見つからずメモを空にしたスポットは授乳室8件・駐車場13件。授乳室は `ginowan-tropical-beach`, `tomi-michinoeki-toyosaki`, `nanjo-sugar-hall`, `tomi-senagajima-spa`, `nago-neopark`, `nago-pineapple-park`, `uruma-shimin-shokudo`, `tomi-toyosaki-beach`。
- `DATA_UPDATED_AT` と該当スポットの `SPOT_UPDATED_AT`（`src/data/dataUpdatedAt.ts`）は別作業の担当ファイルのため、この変更では触っていない。マージ後に更新すること。
- `seoOverrides.ts` は食い違いスポット（与儀公園・新都心公園ほか）の文言も含めて見直すこと。

## タイトル変更（旧 → 新）

| スポットID | 旧 title | 新 title |
|------------|----------|----------|
| naha-airport-kids | 那覇空港 キッズスペースはどこ？国内線2F・授乳室あり | 那覇空港のキッズスペース｜国内線2Fの遊び場・授乳室あり・無料 |
| naha-okimu | おきみゅーの駐車場・授乳室｜沖縄県立博物館・美術館 | おきみゅーの駐車場は無料で158台｜授乳室・ベビーカー貸出あり |
| naha-shuri-castle-park | 首里城公園はベビーカーで回れる？授乳室・駐車場情報 | 首里城公園のベビーカー事情｜起伏あり・授乳室・駐車場情報 |
| naha-yogi-park | 与儀公園（汽車のある公園）（那覇市）の子連れ情報｜うちなー子連れマップ | 与儀公園（汽車のある公園）｜那覇の遊具・オムツ替え台・入園無料 |
| naha-the-kids-palette | ザキッズ 沖縄パレットくもじ店（那覇市）の子連れ情報｜うちなー子連れマップ | ザキッズ 沖縄パレットくもじ店｜7Fの屋内遊園地・0歳無料 |
| naha-waku-kids-land | 波の上わくわくキッズランド（那覇市）の子連れ情報｜うちなー子連れマップ | 波の上わくわくキッズランド｜辻エスパーナ2Fの屋内遊び場 |
| naha-shintoshin-park | 新都心公園（那覇市）の子連れ情報｜うちなー子連れマップ | 新都心公園｜おもろまちの長い滑り台・遊具・オムツ替え台・入園無料 |
| urasoe-daikoen | 浦添大公園の駐車場はどこ？滑り台に近いのはC-2 | 浦添大公園の駐車場3か所｜滑り台近くはC-2・休暇中は満車 |
| urasoe-asobi-park-kyozuka | あそびパーク サンエー経塚シティ店（浦添市）の子連れ情報｜うちなー子連れマップ | あそびパーク サンエー経塚シティ店｜2Fの室内遊び場・授乳室 |
| urasoe-parco-city | パルコシティの授乳室・キッズパーク｜ベビーカー貸出あり | パルコシティの授乳室｜ベビーケアルーム・キッズパーク・駐車場無料 |
| kitanakagusuku-aeon-rycom | イオンモール沖縄ライカム（北中城村）の子連れ情報｜うちなー子連れマップ | ライカムの授乳室は6か所｜イオンモール沖縄・キッズフロア |
| kitanakagusuku-sans-souci | 琉京甘味 SANS SOUCI（サンスーシー）（北中城村）の子連れ情報｜うちなー子連れマップ | 琉京甘味 サンスーシー｜キッズルーム席・子供椅子・駐車場18台 |
| chatan-american-village | 美浜アメリカンビレッジ（北谷町）の子連れ情報｜うちなー子連れマップ | アメリカンビレッジの授乳室・おむつ替え｜駐車場は無料1,500台 |

## 比較の基準値（GSC 3か月の数値・2026-10-26 まで／uchina-map のみ）

> すべて **GSC 3か月の数値（〜2026-10-26）**。変更後の数値は同じ指標で、2026-11-11（+14日）と 2026-11-25（+28日）に直近28日分を取り、期間の長さの違いに注意して比べる。ここに載せたのは手元で確認できた値だけで、空欄は未取得。

サイト全体: 226 クリック / 9,380 表示 / CTR 2.4% / 平均掲載順位 9.9

| ページ | 表示 | クリック | CTR | 平均順位 | 主なクエリ（表示数） |
|--------|------|----------|-----|----------|----------------------|
| /spots/naha-airport-kids/ | 1,991 | 13 | 0.7% | 8.9 | 那覇空港 キッズスペース / 那覇空港キッズスペース / 沖縄空港 キッズスペース / 那覇空港 子供 遊び場 |
| /spots/naha-okimu/ | 404 | 3 | — | 11.7 | おきみゅ 駐車場（97） |
| /spots/kitanakagusuku-aeon-rycom/ | 363 | 2 | — | 7.8 | ライカム 授乳室 / ライカム キッズスペース |
| /spots/urasoe-daikoen/ | 550 | 14 | — | 18.2 | 浦添大公園 駐車場（222、順位32.2、クリック0） |
| /spots/naha-shuri-castle-park/ | 317 | 5 | — | — | 首里城 ベビーカー（140） |
| /spots/urasoe-asobi-park-kyozuka/ | 421 | 7 | — | — | 経塚シティ あそびパーク / あそびパーク サンエー経塚シティ店 |
| /spots/urasoe-parco-city/ | 748 | 21 | — | — | — |
| /spots/naha-main-place/（title 変更なし・PR追加のみ） | 877 | 69 | 7.9% | — | — |
| /spots/naha-yogi-park/ ほか5ページ（the-kids-palette, waku-kids-land, shintoshin-park, sans-souci, chatan-american-village） | 未取得 | 未取得 | 未取得 | 未取得 | 変更前に3か月値を取っていない。2026-11-11 までに旧期間（〜2026-10-26）の値を GSC から取得して追記する |

「—」はこの台帳作成時に手元の集計に値がなかったもの。
