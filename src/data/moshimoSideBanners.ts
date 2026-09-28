/**
 * もしもアフィリエイト — PC左右余白用の縦長バナー（160×600）。
 * メディア: うちなー子連れマップ（shop_site_id=690452）
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

export const MOSHIMO_SIDE_BANNERS = {
  left: {
    id: "tabirai-activity",
    label: "たびらいアクティビティ",
    href: "https://af.moshimo.com/af/c/click?a_id=5821616&p_id=6857&pc_id=19622&pl_id=88496",
    imageSrc: "https://image.moshimo.com/af-img/5408/000000088496.png",
    impressionSrc:
      "https://i.moshimo.com/af/i/impression?a_id=5821616&p_id=6857&pc_id=19622&pl_id=88496",
    width: 160,
    height: 600,
  },
  right: {
    id: "worldlibrary-personal-gift",
    label: "WORLDLIBRARY Personal Gift",
    href: "https://af.moshimo.com/af/c/click?a_id=5821617&p_id=7439&pc_id=21456&pl_id=93808",
    imageSrc: "https://image.moshimo.com/af-img/0726/000000093808.jpg",
    impressionSrc:
      "https://i.moshimo.com/af/i/impression?a_id=5821617&p_id=7439&pc_id=21456&pl_id=93808",
    width: 160,
    height: 600,
  },
} as const satisfies Record<"left" | "right", MoshimoSideBanner>;
