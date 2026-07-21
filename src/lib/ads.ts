/**
 * Google AdSense 設定。
 * 審査通過後、Cloudflare Pages のビルド環境変数に実IDを設定するだけで広告が有効化される。
 * 未設定の間は広告関連の要素を一切描画しない（本番の見た目は変わらない）。
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/** 広告枠（スロット）ID。AdSense 管理画面で作成した広告ユニットのIDを環境変数で渡す。 */
export const ADSENSE_SLOTS = {
  /** 記事下・一覧下などの汎用ディスプレイ枠 */
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT ?? "",
} as const;

/** クライアントIDが設定されているときだけ広告を有効化する。 */
export const adsEnabled = ADSENSE_CLIENT.length > 0;
