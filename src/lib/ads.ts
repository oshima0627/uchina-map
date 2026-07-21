/**
 * Google AdSense 設定。
 * パブリッシャーIDは審査・所有権確認のため常時読み込む（環境変数で上書き可能）。
 * 広告ユニット（スロット）IDは未設定の間、広告枠を一切描画しない。
 */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-4718076434751586";

/** 広告枠（スロット）ID。AdSense 管理画面で作成した広告ユニットのIDを環境変数で渡す。 */
export const ADSENSE_SLOTS = {
  /** 記事下・一覧下などの汎用ディスプレイ枠 */
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT ?? "",
} as const;

/** クライアントIDが設定されているときだけ広告を有効化する。 */
export const adsEnabled = ADSENSE_CLIENT.length > 0;
