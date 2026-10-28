/**
 * ページの「最終更新日」の出所（sitemap の lastmod と JSON-LD の dateModified で共有）。
 *
 * スポットごとの更新日フィールド（lastVerified など）は spots.ts に無い。
 * そのためビルド時刻は使わず、次の2段で決める。
 *
 *  1. DATA_UPDATED_AT … スポットデータ（spots.ts）の最後の内容更新日。
 *     全スポットの既定値。**spots.ts の事実を更新してデプロイするたびに、この日付を更新する。**
 *  2. SPOT_UPDATED_AT … 表示内容（title / description / 本文）を個別に更新したスポットだけの日付。
 *     DATA_UPDATED_AT より新しいものだけを書く。
 *
 * 日付は "YYYY-MM-DD"（日本時間の暦日）。ビルド時刻（new Date()）は絶対に使わない。
 */

/** spots.ts の最終内容更新日（git: d95f13f 中北部11スポット追加、2026-09-11） */
export const DATA_UPDATED_AT = "2026-09-11";

/** 個別に表示内容を更新したスポットの更新日 */
export const SPOT_UPDATED_AT: Record<string, string> = {
  // 2026-10-28: 検索語に合わせた title/description の差し替え（src/data/seoOverrides.ts）
  "naha-airport-kids": "2026-10-28",
  "naha-okimu": "2026-10-28",
  "kitanakagusuku-aeon-rycom": "2026-10-28",
  "urasoe-daikoen": "2026-10-28",
  "naha-shuri-castle-park": "2026-10-28",
  "urasoe-asobi-park-kyozuka": "2026-10-28",
  "urasoe-parco-city": "2026-10-28",
  "naha-yogi-park": "2026-10-28",
  "chatan-american-village": "2026-10-28",
  "naha-the-kids-palette": "2026-10-28",
  "kitanakagusuku-sans-souci": "2026-10-28",
  "naha-waku-kids-land": "2026-10-28",
  "naha-shintoshin-park": "2026-10-28",
  // 2026-10-28: 「あわせてチェック」PR セクションを追加（title は変更なし）
  "naha-main-place": "2026-10-28",
};

/**
 * スポット以外のページ（トップ・一覧など）の最終更新日。
 * 該当ページのソースファイルの最終変更日（git log）と DATA_UPDATED_AT の新しいほう。
 */
export const STATIC_PAGE_UPDATED_AT = {
  home: "2026-10-10",
  about: "2026-10-13",
  privacy: "2026-10-13",
} as const;

/** 一覧ページの本文（導入文など）を個別に更新した日。キーはサイト内パス。 */
export const COLLECTION_PAGE_UPDATED_AT: Record<string, string> = {
  // 2026-10-28: 導入文と「選び方・確認していること」を追加
  "/spots/feature/nursing/": "2026-10-28",
  "/spots/category/beach/": "2026-10-28",
  "/spots/category/aquarium/": "2026-10-28",
  "/spots/age/0/": "2026-10-28",
};

export function spotUpdatedAt(spotId: string): string {
  return SPOT_UPDATED_AT[spotId] ?? DATA_UPDATED_AT;
}

/** ISO 日付文字列の新しいほう（YYYY-MM-DD は辞書順で比較できる） */
export function latestDate(dates: string[]): string {
  return dates.reduce((a, b) => (a >= b ? a : b), DATA_UPDATED_AT);
}
