/**
 * もしもアフィリエイト — PC左右余白用バナー。
 * メディア: うちなー子連れマップ（shop_site_id=690452）
 * 左右それぞれ上から順にスタック表示する。
 */
export type MoshimoSideBanner = {
  id: string;
  label: string;
  href: string;
  imageSrc: string;
  impressionSrc: string;
  width: number;
  height: number;
};

/** 左カラム（上→下）: たびらい + ちゃんぷるネット */
export const MOSHIMO_SIDE_LEFT: MoshimoSideBanner[] = [
  {
    id: "tabirai-activity-160x600",
    label: "たびらいアクティビティ",
    href: "https://af.moshimo.com/af/c/click?a_id=5821616&p_id=6857&pc_id=19622&pl_id=88496",
    imageSrc: "https://image.moshimo.com/af-img/5408/000000088496.png",
    impressionSrc:
      "https://i.moshimo.com/af/i/impression?a_id=5821616&p_id=6857&pc_id=19622&pl_id=88496",
    width: 160,
    height: 600,
  },
  {
    id: "chanpuru-net-120x600",
    label: "ちゃんぷるネット",
    href: "https://af.moshimo.com/af/c/click?a_id=5821615&p_id=7638&pc_id=22091&pl_id=95584",
    imageSrc: "https://image.moshimo.com/af-img/7406/000000095584.png",
    impressionSrc:
      "https://i.moshimo.com/af/i/impression?a_id=5821615&p_id=7638&pc_id=22091&pl_id=95584",
    width: 120,
    height: 600,
  },
];

/** 右カラム（上→下）: WORLDLIBRARY + Hilander */
export const MOSHIMO_SIDE_RIGHT: MoshimoSideBanner[] = [
  {
    id: "worldlibrary-personal-gift-160x600",
    label: "WORLDLIBRARY Personal Gift",
    href: "https://af.moshimo.com/af/c/click?a_id=5821617&p_id=7439&pc_id=21456&pl_id=93808",
    imageSrc: "https://image.moshimo.com/af-img/0726/000000093808.jpg",
    impressionSrc:
      "https://i.moshimo.com/af/i/impression?a_id=5821617&p_id=7439&pc_id=21456&pl_id=93808",
    width: 160,
    height: 600,
  },
  {
    id: "hilander-250x250",
    label: "Hilander",
    href: "https://af.moshimo.com/af/c/click?a_id=5821621&p_id=4864&pc_id=12948&pl_id=64484",
    imageSrc: "https://image.moshimo.com/af-img/4463/000000064484.gif",
    impressionSrc:
      "https://i.moshimo.com/af/i/impression?a_id=5821621&p_id=4864&pc_id=12948&pl_id=64484",
    width: 250,
    height: 250,
  },
];
