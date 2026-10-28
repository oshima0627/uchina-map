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

## 2026-10-28（追記）seoOverrides の正確性見直しと更新日の修正（fix: seoOverrides accuracy + updatedAt）

| # | 変更 | 主なファイル | 目的 |
|---|------|--------------|------|
| 10 | #14（授乳室メモ17件）・#15（駐車場メモ30件）で `nursingNote` / `parkingNote` を追加した40スポット（重複を除く）を `SPOT_UPDATED_AT` に 2026-10-28 で追加。sitemap の `lastmod` と JSON-LD の `dateModified` が実際の更新日になる。`DATA_UPDATED_AT`（全スポットの既定値）は 2026-09-11 のまま据え置き（変更していない57スポットの lastmod を「今日」にしないため） | `src/data/dataUpdatedAt.ts` | 更新日の誠実さ |
| 11 | `seoOverrides.ts` 全13件を spots.ts の事実・公式情報と照合。根拠が弱い2件の description を修正（下表）。title は変更なし | `src/data/seoOverrides.ts` | 根拠のない断定を避ける |
| 12 | 公式情報とフラグが食い違うスポットは、フラグは変更せず、テンプレート生成の description（`spotFacilitySummary`）から断定表記を外す。`SEO_FLAG_DISPUTES` を新設（詳細は下表）。該当スポットの `SPOT_UPDATED_AT` も 2026-10-28 に | `src/data/seoOverrides.ts`, `src/lib/seo.ts`, `src/data/dataUpdatedAt.ts` | 「駐車場無料」「授乳室あり」が検索結果に出る誤りを防ぐ |

### seoOverrides の文言変更（旧 → 新）
- `naha-shuri-castle-park` description
  - 旧: 首里城公園は園内に起伏があり、ベビーカーでの移動には向きません。授乳室・オムツ替え台・多目的トイレはあり、駐車場は有料で広め。無料エリアにも見どころが多く、子連れの散策に人気の公園です。8:30-18:00（季節変動あり）。
  - 新: 首里城公園は園内に起伏があり、ベビーカーでは移動しづらい場所もあります。ベビーカーは無料で借りられ（台数限り・予約不可）、授乳室・オムツ替え台・多目的トイレもあり。駐車場は有料。8:30-18:00（季節変動あり）。
  - 理由: 「向きません」の断定は根拠が薄く、同じ公園が無料でベビーカーを貸し出している（nursingNote の出典）ため。「広め」は出典なしのため削除。
- `naha-the-kids-palette` description
  - 旧: ザキッズ 沖縄パレットくもじ店はデパートリウボウ7Fの全天候型の屋内遊園地。ボールプールやトランポリンで遊べ、授乳室・オムツ替え台あり。大人500円・子供1,000円で1歳未満は無料。平日10:00-19:00、土日祝〜20:00。
  - 新: ザキッズ 沖縄パレットくもじ店はデパートリウボウ7Fの屋内遊園地。ボールプールで遊べます。ベビー休憩室は8階（10:00-19:30）。大人500円・子供1,000円、1歳未満無料。平日10:00-19:00、土日祝〜20:00。
  - 理由: nursingNote の出典（パレットくもじ公式お知らせ）にあるのは8階の「ベビー休憩室」（利用10〜19時30分）で、店内の授乳室・オムツ替え台とは書かれていないため。
- 他11件（naha-airport-kids, naha-okimu, naha-yogi-park, naha-waku-kids-land, naha-shintoshin-park, urasoe-daikoen, urasoe-asobi-park-kyozuka, urasoe-parco-city, kitanakagusuku-aeon-rycom, kitanakagusuku-sans-souci, chatan-american-village）は変更なし。`naha-yogi-park` と `naha-shintoshin-park` は駐車場に触れておらず、食い違いの影響なし。

### 食い違いスポットのテンプレート生成 description（`SEO_FLAG_DISPUTES`）
| スポットID | 食い違い | 旧（生成される表記） | 新 |
|-----------|----------|----------------------|----|
| tomi-senagajima | 公式FAQは授乳室なし（オムツ替え台つき多目的トイレはあり） | 授乳室あり・… | 「授乳室あり」を出さない |
| ginowan-maririn | 県バリアフリーマップ（2018-06）で授乳室「無」 | 授乳室あり・… | 「授乳室あり」を出さない |
| tomi-toyosaki-beach | 駐車場は有料（最初の10分無料、1時間200円(5〜10月)/100円(11〜4月)、1日最大500円） | 駐車場無料（広め） | 駐車場あり（有料） |
| naha-wakasa-park | 有料（30分無料、以後1時間200円、以降1時間100円、24時間最大800円） | 駐車場無料 | 駐車場あり（有料） |
| naha-shintoshin-park | 那覇市ページで園内は有料駐車場（日本パーキング） | （overrides で駐車場に言及なし） | 万一 override が外れても「駐車場あり（有料）」 |
| naha-yogi-park | 公式: 駐車場なし | （overrides で駐車場に言及なし） | 万一 override が外れても駐車場表記なし |
| itoman-himeyuri | 専用駐車場なし | 駐車場無料 | 駐車場の表記を出さない |

※ 詳細ページ本体の Q&A・設備バッジ・一覧のバッジ・JSON-LD の `amenityFeature` はフラグから生成されるため、フラグが変わるまで「駐車場無料」「授乳室あり」と表示されたままになる。メタ情報（title / description）だけ先に控えている。

### オーナー判断待ち: フラグと公式情報の食い違い（spots.ts は未変更）
| スポットID | 現在のフラグ | 公式・自治体の情報 | 判断してほしいこと |
|-----------|--------------|---------------------|---------------------|
| tomi-senagajima | `hasNursingRoom: true` | 公式FAQ「授乳室はご準備しておりません」。オムツ替え台つき多目的トイレはあり | `hasNursingRoom` を false に |
| ginowan-maririn | `hasNursingRoom: true` | 県バリアフリーマップ（2018-06）で授乳室「無」 | 同上（情報が古いため要再確認） |
| tomi-toyosaki-beach | `parkingFree: true` | 有料。最初の10分無料、1時間200円（5〜10月）/100円（11〜4月）、1日最大500円 | `parkingFree` を false に |
| naha-shintoshin-park | `parkingFree: true`（hasParking: true） | 那覇市ページで園内駐車場は有料（日本パーキング） | `parkingFree` を false に |
| naha-yogi-park | `hasParking: true`, `parkingFree: true` | 公式: 駐車場なし | `hasParking` を false に |
| itoman-himeyuri | `parkingFree: true` | 専用駐車場なし | `hasParking` を false に（周辺有料駐車場の扱いも） |
| naha-wakasa-park | `parkingFree: true` | 有料。30分無料、以後1時間200円、以降1時間100円、24時間最大800円 | `parkingFree` を false に |

## 2026-10-28（追記）新規スポット3件の追加（feat: add 3 spots）

| # | 変更 | 主なファイル | 目的 |
|---|------|--------------|------|
| 13 | 新規スポット3件を追加（97 → 100件）。`firstBatch` の3件。写真なし（`imageUrl` 省略、`imageEmoji` のみ）。事実は公式ページを再度開いて確認できたものだけ | `src/data/spots.ts` | 豊見城市・沖縄市・読谷村の授乳室ありスポットを補強 |
| 14 | 3件を `SPOT_UPDATED_AT`（2026-10-28）に追加。`DATA_UPDATED_AT` は全スポットの既定値のため据え置き。件数は `SPOTS.length` などから計算されるため、導入文・一覧の件数は自動で更新（ハードコードなし） | `src/data/dataUpdatedAt.ts` | sitemap lastmod / dateModified を実日付に |
| 15 | 料金が公式未記載の2スポットは `SEO_FLAG_DISPUTES` の `parking: "omit"` で、title/description の駐車場表記（有料と読める「駐車場あり（有料）」）を出さない | `src/data/seoOverrides.ts` | 不明を「有料」と断定しない |

### 追加スポットと確認元（2026-10-28 に公式ページを再オープンして確認）
| ID | 名称 | 確認元（運営者・自治体の公式） | 座標の出所 |
|----|------|--------------------------------|------------|
| tomi-iias-okinawa-toyosaki | イーアス沖縄豊崎 | toyosaki.iias.jp/service/nursing_room/（授乳室1階2部屋・3階3部屋、授乳用給湯器・流し台・おむつ交換台、キッズスペース、こどもトイレ、各階の多目的トイレ、ベビーカー貸出100円リターン）、/access/（約3,000台・優先34台、営業時間、住所・電話） | 国土地理院 住所検索（豊崎3番地）26.1573, 127.6512 と OSM Nominatim「イーアス沖縄豊崎」26.1571, 127.6517 が一致 → 26.1571, 127.6517 |
| okinawa-kenso-sogo-undo-park | 沖縄県総合運動公園 | okinawa-kenso.com/?page_id=66803（キッズルーム: 供用日・開放時間・無料・授乳室/おむつ交換台/ベビーベッド/ウォーターサーバー・受付方法）、/?page_id=10（駐車場11か所・普通車1,138台・大型23台、大型遊具・ちびっこ広場）、トップ（営業中・住所・電話） | 国土地理院 住所検索（比屋根五丁目3番）26.3095, 127.8209。OSM「沖縄県総合運動公園」26.3079, 127.8240 とは園が広いため約300m差 |
| yomitan-library-yunlabo-miraikan | 読谷村立図書館（ゆんラボ・未来館） | 読谷村公式 vill.yomitan.okinawa.jp/soshiki/library/gyomu/shisetsu/1417.html（施設内容: 児童書コーナー・工作スペース・イベントスペース・こどもトイレ、授乳室・スターバックス、開館10:00-22:00、休館日）、yomitan-lib.jp（営業中・住所・電話・開館時間・休館日） | 国土地理院 住所検索（座喜味2901番地）26.3960, 127.7448。OSM「読谷村役場」（同番地）26.3962, 127.7446 と一致。OSM の「読谷村立図書館」（26.4066, 127.7334）は旧所在の可能性があり不採用 |

### 不明として保守的に扱った項目（公式ページに記載なし。推測していない）
- 駐車料金: イーアス沖縄豊崎・沖縄県総合運動公園（`parkingFree: false` は「不明」の既定。`parkingNote` に「確認できていません」と明記）。読谷村立図書館は駐車場そのものの記載なし（`hasParking: false` は「不明」の既定、`parkingNote` に明記）。
- 読谷村立図書館: おむつ替え台、ベビーカー（`hasDiaperTable` / `strollerFriendly` は false の既定。`nursingNote` に「確認できていません」と明記）。
- 沖縄県総合運動公園: 公園の入場料・雨の日の利用可否・ベビーカーでの回りやすさ・大型遊具の対象年齢。料金（`price`）は3件とも未設定（公式に記載がないため）。
- 3件とも滞在目安（`durationMin`）は編集上の目安で、公式の数値ではない。
- 判断を加えた項目: `isIndoor` / `rainOk` は、イーアス（階層・館内施設の記載）と図書館（学習室・工作スペースなど館内施設のみ）を屋内と判断して true。イーアスの `strollerFriendly` は公式のベビーカー貸出を根拠に true。イーアスの `hasMultipurposeToilet` は公式の「各階の多目的トイレ（おむつ交換台設置）」で true。
- 既存の `tomi-kijimuna-iias`（同じ施設内の飲食店）は店舗サイトを出典に「無料の駐車場」と書いているが、イーアス公式ページには料金の記載がない。本変更では触っていない。

### オーナー判断待ち（追加）
- 料金・駐車場が「不明」のスポットは、スキーマに「不明」の値がないため、詳細ページのバッジは「駐車場あり（有料）」と表示される（Q&A は `parkingNote` に置き換わる）。`parkingFree` の三値化（不明を表示できる）を検討する。
