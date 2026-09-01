# HANDOFF

最終更新: 2026-09-01

## いま何をしているか

**外部リンク0件の解消。** 段階1（リンクされる資格を作る）を実装し、
**本番反映まで確認済み**（2026-09-01）。次は段階2の残り（うちなーマネーからのリンク）と段階3。

外部リンクは「もらいに行く」のではなく「もらえる状態を作ってから、載る資格のある場所に申し出る」
順序でしか安全に増やせない。

| 段階 | 内容 | 状態 |
|---|---|---|
| 1. 資格を作る | 運営者・連絡先・出典方針・Organization 構造化データ | **完了（本番反映を確認済み）** |
| 2. 手元の1本 | 姉妹サイトとの相互リンク | **uchina-map 側は完了。うちなーマネー側が未対応** |
| 3. 申し出る | 自治体・観光協会へ掲載依頼（送信は要許可） | 未着手 |
| 4. 引かれる | 出典として引用される品質のデータを積む | 継続 |

**やらないと決めたこと**: 有料リンク、リンクファーム、相互リンク集、大量のディレクトリ一括登録。
Google のスパムポリシー違反で、積み上げた土台ごと失うリスクがある。

## 今回やったこと（2026-09-01）

| コミット | 内容 |
|---|---|
| `284d444` | `/about/` の実装3ファイル（**Stop フックによる自動コミット**。私が作ったものではない） |
| `6272f4a` | HANDOFF の整理 |
| `3222692` | 運営主体を構造化データと運営者ページで明示 |

- `src/app/about/page.tsx`（新規） … h1「このサイトについて」→ h2 4つ（運営者 / 掲載情報の集め方 /
  情報の誤りを見つけたら / 広告について）。`mailto:info@nexeed-lab.com` を2箇所、
  運営者名は運営元 `https://nexeed-lab.com/` へのリンク
- `src/app/sitemap.ts` … `staticRoutes` に `/about/`（priority 0.3 / yearly）
- `src/app/layout.tsx` … フッターに `/about/` リンク
- `src/lib/seo.ts` … `PUBLISHER` 定数を追加し、`siteJsonLd()` に `publisher`（Organization）を追加

## 検証済みの事実

### `/about/` の実装（`verifier` が独立検証、総合判定 **合格**）

`verifier` は変更前コミット `bcc32ac` を使い捨て worktree に**独立してビルドし、
変更後の `out/` と全ページ比較**した。結果「`_next` のチャンクハッシュを除くページ本文の差分は
フッターの4行のみ、追加ディレクトリは `out/about` だけ、削除ファイルはゼロ」。
報酬ハッキング（`any` / `@ts-ignore` / `eslint-disable` / 設定ファイル改変）も検出なし。

### `3222692` の追加分（自分でビルドして確認）

- `pnpm typecheck` / `pnpm build` … 成功
- `out/index.html` に
  `"publisher":{"@type":"Organization","@id":"https://nexeed-lab.com/#organization","name":"Nexeed Lab","url":"https://nexeed-lab.com/","email":"info@nexeed-lab.com"}`
- `out/about/index.html` に `href="https://nexeed-lab.com/"`、`mailto:info@nexeed-lab.com` が4箇所
- 退行なし: sitemap `<loc>` **119** / 市町村×設備 **0件** /
  トップのディレクトリ型リンク **27本** / `onna-manzamo` と `naha-main-place` の `<title>` は不変

### デプロイ後に本番を curl して確認した（2026-09-01）

- `https://uchina-map.nexeed-lab.com/about/` … **HTTP 200**、
  `<title>このサイトについて｜うちなー子連れマップ</title>`、canonical も `/about/`
- `mailto:info@nexeed-lab.com` … **4箇所**
- `/about/` に運営元リンク `href="https://nexeed-lab.com/"`
- トップに `"publisher":{"@type":"Organization","@id":"https://nexeed-lab.com/#organization",...}`
- 退行なし: sitemap `<loc>` **119** / 市町村×設備 **0件** /
  トップのディレクトリ型リンク **27本** / フッターの `/about/` リンク **1本** /
  `onna-manzamo` と `naha-main-place` の `<title>` は不変

### 姉妹サイトの実態（`seo-analyst` が GSC で実測。2026-09-01 取得、期間 2026/05/30–08/29）

プロパティ `sc-domain:nexeed-lab.com` 全体: クリック265 / 表示12,500 / CTR 2.1% / 順位 11.8

| ホスト | クリック | 表示回数 | GSC実績ページ数 |
|---|---|---|---|
| uchina-money（うちなーマネー） | 62 | 5,467 | 263 |
| uchina-map | 140 | 5,280 | 87 |
| nexeed-lab.com（運営元） | 35 | 1,130 | 64 |
| ai.nexeed-lab.com | 25 | 658 | 107 |
| ikunavi / childcare / maternity | 0 | 152 | 5 |

**姉妹サイトは1つではなく6ホストあった。**

### uchina-map へのリンクは既に6本存在する（`curl` 実測）

`nexeed-lab.com` の `/products/uchina-map/` `/products/` `/about/` と、
ikunavi・childcare・maternity のフッターから各1本。`rel="nofollow"` は付いていない。

**にもかかわらず GSC のリンクレポートは外部リンク0件のまま**（内部リンク11件）。
この矛盾の原因は特定できていない。

**最大規模のうちなーマネー（263ページ）からのリンクは0本。** ここが実際に空いている穴。

## 未検証のもの（推測であって事実ではない）

- GSC 外部リンク0件と実在する6本のリンクの**矛盾の原因は未特定**。
  「リンク元3サイトが新しく反映が遅れている」「サブドメイン間リンクは集計に出にくい」は**どちらも推測**
- リンク元6ページが Google にインデックスされているかは**未確認**
- **うちなーマネーの表示回数が 2026-07-18 以降ほぼ0に落ちている。原因は未調査。**
  別タスクとして切り出し済み。263ページ・5,467表示のサイトなので、uchina-map より損失が大きい可能性がある
- 今回の一連の変更で流入や被リンクが増えるかは未検証
- `parkingFree` を明示していないスポット3件（`naha-okimu` / `naha-shintoshin-park` /
  `urasoe-daikoen`）はデフォルト値 `true`（無料）が効いている。
  `urasoe-daikoen` は「浦添大公園 駐車場」157表示の最重要クエリで新タイトルに「無料」と書いた。**未確認**
- 今帰仁村は未追加（今帰仁城跡の観覧料の一次情報が未取得。`nakijinjoseki.jp` が接続タイムアウト）

## 保留中の判断

**モバイル幅でフッターが非表示**（`<footer class="hidden md:block …">`）のため、
`/about/` へのリンクがスマホで出ない。`verifier` が CSS 実測で事実と確認済み
（既存のプライバシーポリシーリンクと同条件）。

- 外部リンクを増やす目的（クローラーと、掲載を検討する組織が運営者を確認できること）には**足りている**
- 「設備情報の誤りを知らせてもらう」目的には**効かない**。利用者はほぼスマホのはず

全ページのフッター表示に関わる設計判断なので、ユーザーに諮ってから決める。

## 次にやること

1. **うちなーマネーの表示回数急落の原因調査**（別タスク）。うちなーマネーからのリンクを張るのは
   このあと。表示0のサイトから張っても効果は薄い
2. モバイルのフッター問題をユーザーと決める
3. 段階3（自治体・観光協会への掲載依頼）。**メール送信は必ず事前に許可を取る**。
   狙い目は市町村の観光協会（例: 恩納村観光協会 `goto-onna.com`）。
   沖縄県「こどもミライ」は民間サイトへのリンク集も掲載依頼の仕組みも無く**見込み薄**（確認済み）
4. **2〜7日後**: GSC のインデックス登録レポートで「検出 - インデックス未登録 79件」が減ったか確認
5. **2026-09-28以降**: CTR実験（下記8ページ）とクロール実験（内部リンク+sitemap）の答え合わせ

## GSC の実測ベースライン（答え合わせに使う。消さないこと）

プロパティ `sc-domain:uchina-map.nexeed-lab.com`、期間 2026/05/29〜08/28（90日）。

- 全体: クリック139 / 表示5,170 / CTR 2.7% / 平均掲載順位 9.6
- インデックス: 登録済み94 / 未登録121（検出-インデックス未登録 **79**、代替ページ23、
  リダイレクト17、クロール済み-未登録2）
- **外部リンク 0 件** / 内部リンク 11件
- 表示はあるがクリック0のクエリ: 浦添大公園 駐車場 157、おきなわワールド 駐車場 49、
  メインプレイス 授乳室 40、パルコシティ 授乳室 29、おきみゅー 駐車場 21
- 絞り込みページ66枚の合計: 26表示・0クリック
- スポット詳細ページの表示回数の**中央値は90日で15**

**メタ文言を個別化した8ページ（変更前の実測値）**:
`urasoe-parco-city`(390表示6クリック) / `urasoe-daikoen`(233/1) / `nanjo-okinawa-world`(187/2) /
`naha-okimu`(168/0) / `naha-shuri-castle-park`(132/3) / `tomi-dmm-aquarium`(92/1) /
`ginowan-harmony-chafe`(84/2) / `naha-mori-no-ie-minmin`(74/0)
選定基準は「表示回数60以上 かつ CTR 3%未満」。

**インデックス登録リクエスト**: 未クロールだったスポット詳細29ページ + 万座毛の計30ページ、
2026-08-31 に全件送信済み（画面で確認）。`kitanakagusuku-aeon-rycom` は送信数分後に
「インデックスに登録済み」へ変化した。絞り込みページ50件は sitemap から外した対象と重なるため意図的に未送信。

**URL検査で得た参照元ページ**: `motobu-kaiyohaku-park` は `/spots/?age=0`、
`nago-fruitsland` は `/spots/?feature=rainOk`、**他8件は「検出されませんでした」**。
内部リンク孤児化が実在したことの Google 側からの裏付け。
次回は**この欄がディレクトリ型URLに変わっているか**を観測点にする。

## 発見した再利用可能な出典

**沖縄県バリアフリーマップ** `http://okinawa-bf-map.jp/facility-info/detail?facility_id=<ID>`

沖縄県の公的サイト。授乳室・ベビーベッド・多目的トイレ・ベビーカー貸出・哺乳瓶の洗い場・
ミルクのお湯提供・キッズスペース・駐車場台数・段差・エレベーター基数・通路幅が
**構造化されて最終更新日つきで載っている**。緯度経度も取れる。

**HTTPS で証明書のホスト名が一致しないため `WebFetch` は必ず失敗する。`curl` で `http://` のまま取る。**
施設IDは `WebSearch` を `allowed_domains: ["okinawa-bf-map.jp"]` で絞って探す。
手順は `.claude/agents/spot-data-curator.md` に記載済み。

施設の公式サイト（`manzamo.jp` / `onnanoeki.com`）には子連れ設備の記載が**一切無かった**。
公式サイトだけ見て「記載なし＝設備が無い」と判断しないこと。

## 触ってはいけないところ

- **成績の良いページ**: `naha-main-place`(CTR 7.7%) / `ginowan-tropical-beach`(8.1%) /
  `tomi-toyosaki-beach`(12.5%) / `chatan-araha-park`(25%)
- `src/lib/seo.ts` の `pageMetadata()` は全ページが通る共通関数。`titleAbsolute` の既定値 false を
  変えると全ページのタイトルが壊れる（`siteJsonLd()` はトップのみで使用）
- `src/app/sitemap.ts` の市町村×設備40件の除外は**意図的**。
  「ルートがあるのに sitemap に無い」のを不整合とみなして戻さないこと
- `public/_headers` / `next.config.ts` の `output: "export"` / `trailingSlash: true` /
  `images.unoptimized: true`
- スポットの事実は `src/data/spots.ts` が唯一の出所。メタ文言に書く数字はここに無ければ書かない
- ワークツリーで作業中。**stash スタックは本体と共有**なので素の `git stash` を使わない
- **完了条件に書く数値は都度実測して確認する。** トップのディレクトリ型リンクは恩納村追加で
  26→27に変わっており、古い数値を基準に渡して `verifier` に指摘された

## デプロイ手順

- Cloudflare Workers の静的アセット配信。`wrangler.jsonc` が `assets.directory: "./out"` を指定
- **`main` への push で Cloudflare Workers Builds が走る**（反映まで数分）
- `git push origin HEAD:main` はこの環境で動作する（CLAUDE.md の GitHub MCP 経由は
  git が403を返す環境向けの記述。403が返った場合のみMCPに切り替える）
- 長時間のポーリングは `run_in_background` で実行する（前面で `sleep` を回さない）
