# HANDOFF

最終更新: 2026-09-11

## いま何をしているか

**「サイトを伸ばすために何ができるか」の調査を完了し、`docs/growth-audit-2026-09-11.md` に記録した。**
コードは変更していない（ドキュメントのみ）。次は調査で決めた優先順位に沿って実装に入る。

調査の結論（詳細は docs を読む）:

1. 検索されているのは「施設名 × 駐車場／授乳室」なのに、該当ページに駐車場・授乳室の中身がない
   （`parkingNote` 21/86、`nursingNote` 2/86）。**中身を厚くするのが最優先**
2. `public/_headers` の `/spots/*` 30日キャッシュがスポットの **HTML にも**効いている（本番で確認）
3. 誤り報告リンクが自己リンクで、モバイルには連絡手段がない
4. 共有ボタンがない（クリックの92%がモバイル）
5. 年齢ページがクエリ版のみで索引されない
6. 競合にない持ち物は「設備フラグを持つ DB」（`typhoonOk` 等）。記事で正面衝突しない

## 今回やったこと（2026-09-11）

- 調査のみ。`docs/growth-audit-2026-09-11.md` を新規作成、本ファイルを更新
- 実行した計測: GSC（28日比較・クエリ・ページ・インデックス・リンク・デバイス）、
  Cloudflare Web Analytics（30日）、本番 `curl`（ヘッダ・サイズ・JSON-LD）、
  競合 SERP 8クエリ、リポジトリ構造の棚卸し

## 検証済みの事実（2026-09-11 取得）

### GSC 28日比較（08/12〜09/08 vs その前）

- クリック 65（47）/ 表示 2,639（2,100）/ CTR 2.5%（2.2%）/ 順位 10.1（9.8）
- インデックス登録済み **127**（8/28 時点 94）、検出-未登録 **44**（79）。サイトマップ検出 119
- 外部リンク **0** / 内部 11。検索での見え方: データなし
- モバイル: クリック 60 / 表示 2,131。PC: 5 / 493
- naha-main-place がクリック 24（全体の37%）。naha-airport-kids の表示 913→490 に半減（原因未調査）
- 新規インデックスの効果: urasoe-asobi-park-kyozuka 表示 0→158、naha-the-kids-palette 0→79、chatan-american-village 0→54
- 表示多・クリック0: 浦添大公園 駐車場 87（順位29.6）/ おきみゅー 駐車場 46 / アメリカンビレッジ 授乳室 20 /
  パルコシティ 授乳室 18 / メインプレイス 授乳室 14 / 沖縄県立博物館 駐車場 8（順位33.4）

### メタ文言を変えた8ページ（変更後 08/29〜09/10 / 変更前 08/16〜08/28）

| ページ | 後 クリック/表示/順位 | 前 |
|---|---|---|
| urasoe-parco-city | 1/97/7.6 | 1/101/9.6 |
| urasoe-daikoen | 0/42/**35.5** | 0/67/17.6 |
| nanjo-okinawa-world | 0/51/11.3 | 0/20/8.4 |
| naha-okimu | 3/113/10.4 | 0/47/8.9 |
| naha-shuri-castle-park | 2/40/7.4 | 1/37/9.6 |
| tomi-dmm-aquarium | 2/17/4.4 | 0/12/6.5 |
| ginowan-harmony-chafe | 0/8/6.4 | 0/6/6.5 |
| naha-mori-no-ie-minmin | 0/9/11.6 | 0/5/8.0 |

母数が1桁なので効果とは言えない。浦添大公園は順位が悪化した。正式な答え合わせは 09/28 以降。

### Cloudflare Web Analytics（過去30日、10刻み）

訪問 120 / PV 170 / 参照元 Google 70・サイト内 50・Yahoo 30・直接 20 / Mobile 130・Desktop 40 / LCP Good 100%

### 本番 curl

- `/spots/naha-airport-kids/` `/spots/` `/spots/city/naha/` すべて `Cache-Control: public, max-age=2592000` + `CF-Cache-Status: HIT`
- `/` は `max-age=0, must-revalidate`
- スポット詳細の JS 合計 229KB（圧縮後）、HTML 17KB、ヒーロー画像 79KB。sitemap `<loc>` 119
- スポット詳細の JSON-LD: カテゴリ別 Place + BreadcrumbList。FAQPage / dateModified なし

### リポジトリ

- `nursingNote` 2/86、`parkingNote` 21/86、`imageUrl` 84/86、`websiteUrl` 41/86、`seoTitle` 10/86
- urasoe-daikoen / naha-okimu に `parkingNote` なし。urasoe-daikoen は `parkingFree` も未指定（デフォルト true）
- `src/components/spot-collection.tsx:101-107` の誤り報告リンクは `href={path}`（自己リンク）
- フッター `hidden md:block`（`src/app/layout.tsx:86`）
- トップの「年齢で選ぶ」は `/spots?age=` へのリンク。年齢の静的ルートは存在しない
- Service Worker なし（README の「オフライン対応」は事実と異なる）
- 記事・ガイド等のスポット以外のルートは 0

## 未検証のもの（推測であって事実ではない）

- 「本文に駐車場・授乳室の中身を入れれば順位・CTRが上がる」は仮説。§4 の実装後に GSC で測る
- naha-airport-kids の表示半減の原因
- うちなーマネーの表示急落の原因（別タスクのまま）
- 外部リンク0件と実在する6本の矛盾の原因
- 30日キャッシュが実際にユーザーに古い HTML を見せた事例は確認していない（ヘッダから導いた推論）
- 競合 SERP の順位は WebSearch の返却順であり Google 実順位ではない

## 次にやること

docs の §4 の順。手が動かせる粒度にすると:

1. `public/_headers` の `/spots/*` を `/spots/*.webp` と `/spots/card/*.webp` に分ける →
   デプロイ後 `curl -sI https://uchina-map.nexeed-lab.com/spots/naha-airport-kids/ | grep -i cache-control` で `max-age=0` を確認
2. `spot-collection.tsx` の自己リンクを `mailto:info@nexeed-lab.com` に変更。フッターのモバイル表示は**ユーザーに諮る**
3. `spot-data-curator` で浦添大公園・おきみゅー・パルコシティ・メインプレイス・アメリカンビレッジ・おきなわワールド・
   サンスーシー・県立博物館の `parkingNote` / `nursingNote` を一次情報つきで追加
   （出典: `http://okinawa-bf-map.jp/`（http のまま curl）と施設公式）
4. `/spots/age/[age]/` の静的ルート化と、トップ・サイトマップの向き先変更
5. 共有ボタン（`navigator.share` + LINE フォールバック）
6. **2026-09-28 以降**: CTR実験の答え合わせ（上の8ページ表と §1 のクエリ表が比較基準）

## 触ってはいけないところ

- **成績の良いページ**: `naha-main-place`(CTR 8.6%) / `ginowan-tropical-beach` / `tomi-toyosaki-beach` / `chatan-araha-park` / `tomi-dmm-aquarium`(11.8%)
- `src/lib/seo.ts` の `pageMetadata()` は全ページが通る共通関数。`titleAbsolute` の既定値 false を変えない
- `src/app/sitemap.ts` の市町村×設備40件の除外は**意図的**
- `public/_headers` の**セキュリティヘッダ**と `_next/static` の immutable は変えない（直すのは `/spots/*` の範囲だけ）
- `next.config.ts` の `output: "export"` / `trailingSlash: true` / `images.unoptimized: true`
- スポットの事実は `src/data/spots.ts` が唯一の出所。メタ文言に書く数字はここに無ければ書かない
- FAQPage の JSON-LD は追加しない（Google は行政・医療サイト以外に FAQ リッチリザルトを出さない）
- ワークツリーで作業中。**stash スタックは本体と共有**なので素の `git stash` を使わない
- 完了条件に書く数値は都度実測して確認する

## 保留中の判断

- モバイル幅でフッター非表示（`/about/` と連絡先がスマホで出ない）。全ページの設計に関わるのでユーザーに諮る
- Instagram 等の配信チャネルを始めるか（継続運用の人手が要る）

## 再利用可能な出典

**沖縄県バリアフリーマップ** `http://okinawa-bf-map.jp/facility-info/detail?facility_id=<ID>`
授乳室・ベビーベッド・多目的トイレ・ベビーカー貸出・給湯・駐車台数が構造化されて載っている。
**HTTPS は証明書不一致で `WebFetch` が失敗する。`curl` で `http://` のまま取る。**
施設IDは `WebSearch` を `allowed_domains: ["okinawa-bf-map.jp"]` で絞って探す。

**おきなわ子育て応援パスポート** `kosodate.pref.okinawa.jp` … 県事業、応援店 1,801件、授乳室・給湯・キッズルーム・座敷で絞り込み可。
出典としても、飲食店の「座敷・個室」フラグ追加の材料としても使える。

## デプロイ手順

- Cloudflare Workers の静的アセット配信。`wrangler.jsonc` が `assets.directory: "./out"` を指定
- **`main` への push で Cloudflare Workers Builds が走る**（反映まで数分）
- `git push origin HEAD:main` はこの環境で動作する。403 が返った場合のみ GitHub MCP に切り替える
