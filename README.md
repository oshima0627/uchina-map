# うちなー子連れマップ

> 沖縄県内の「子連れで安心して行ける場所」が、親目線の本当に欲しい情報付きで見つかるWebアプリ

## 概要

- **対象エリア（MVP）**: 沖縄本島南部7市町村（那覇市・浦添市・宜野湾市・豊見城市・南城市・八重瀬町・糸満市）
- **特徴**: 授乳室・ベビーカー可・雨OK・駐車場などの設備で絞り込みが可能
- **差別化**: 在住者・地図ベース・設備フィルタ検索（既存サービスは記事メディア型または観光客向け）

## 機能

- スポット一覧・検索（エリア / カテゴリ / 対象年齢 / 設備 / フリーワード）
- スポット詳細ページ（子連れ特化情報・地図・ナビ起動）
- MapLibre GL JSによる地図表示
- お気に入り（localStorage保存、認証不要）
- 「今日どこ行く？」レコメンド（Open-Meteo APIで天気を加味）
- PWA対応（ホーム画面追加、オフライン基本対応）

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| ランタイム | React 19 |
| 言語 | TypeScript 5.7+ (strict) |
| スタイル | Tailwind CSS v4 (CSS-first) |
| 状態管理 | Zustand (persist) |
| バリデーション | Zod |
| 地図 | MapLibre GL JS + OpenStreetMap |
| 天気 | Open-Meteo (キー不要) |
| アイコン | lucide-react |

## 開発

```bash
pnpm install
pnpm dev
```

http://localhost:3000

### 主要コマンド

```bash
pnpm dev        # 開発サーバ (http://localhost:3000)
pnpm build      # 静的エクスポート（out/ に書き出し）
pnpm preview    # out/ をローカルプレビュー (http://localhost:4173)
pnpm typecheck  # 型チェック
```

## ディレクトリ構成

```
src/
  app/                 # Next.js App Router
    page.tsx           # ホーム
    spots/             # 一覧・詳細
    map/               # 地図
    favorites/         # お気に入り
    recommend/         # 今日どこ行く？
  components/          # 共通コンポーネント
  data/                # モックスポットデータ（Phase 0）
  lib/                 # ユーティリティ・型・ストア
public/                # 静的ファイル
```

## データ

現状は `src/data/spots.ts` のモックデータで動作します。Phase 2 で Supabase + PostGIS に移行予定。

## デプロイ（Cloudflare Pages）

公開URL: **https://uchina-map.nexeed-lab.com**

このリポジトリは `next.config.ts` で `output: "export"` を有効化し、`pnpm build` で `out/` ディレクトリに完全な静的サイトを書き出します。Cloudflare Pages は静的サイトを無料枠で配信できるため、追加コストなしで運用できます。

### Pages 設定

| 項目 | 値 |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `pnpm build` |
| Build output directory | `out` |
| Root directory | `/` |
| Node version | `22` |
| Environment variables | （現状不要） |

`public/_headers` でセキュリティヘッダ（X-Frame-Options, Referrer-Policy, Permissions-Policy）と、`/_next/static/*` の immutable キャッシュを定義しています。

### カスタムドメイン

Cloudflare Pages の Custom domains に `uchina-map.nexeed-lab.com` を追加し、Cloudflare DNS の `nexeed-lab.com` ゾーンに CNAME を作成すれば公開できます。

### 制約

- 静的エクスポートなのでサーバ機能は利用不可（Server Actions、ミドルウェア、画像最適化、ISR ❌）。
- `/recommend` の天気は **クライアントサイド fetch + localStorage 30分キャッシュ** で実装。
- スポット詳細は `generateStaticParams` で全件 SSG（`dynamicParams: false`）。

Phase 2 で Supabase + Server Component を入れる際は、`@opennextjs/cloudflare` 等で Workers ランタイムへ移行予定。

## ロードマップ

- **Phase 0** (準備・〜2026/06): ドメイン取得、スポット50件投入
- **Phase 1** (MVP・2026/06〜08): 本リポジトリの内容 + β公開
- **Phase 2** (拡張・2026/09〜): Supabase連携、ユーザー投稿、中部対応
- **Phase 3** (本格運用): 北部・離島対応、AI対話プラン、保活情報連携

## ライセンス・データ提供

- 地図データ: © OpenStreetMap contributors
- 各スポット情報: 各施設の公式サイト・公開情報を参考に独自取材

---

© 2026 Nexeed Lab — 沖縄の親子が、もっと自由にお出かけできるように。
