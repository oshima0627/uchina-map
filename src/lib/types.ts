import { z } from "zod";

export const CITIES = [
  "naha",
  "urasoe",
  "ginowan",
  "tomigusuku",
  "nanjo",
  "yaese",
  "itoman",
  "chatan",
  "kitanakagusuku",
  "okinawa",
  "uruma",
  "yomitan",
  "onna",
  "nago",
  "motobu",
] as const;
export type City = (typeof CITIES)[number];

export const CITY_LABELS: Record<City, string> = {
  naha: "那覇市",
  urasoe: "浦添市",
  ginowan: "宜野湾市",
  tomigusuku: "豊見城市",
  nanjo: "南城市",
  yaese: "八重瀬町",
  itoman: "糸満市",
  chatan: "北谷町",
  kitanakagusuku: "北中城村",
  okinawa: "沖縄市",
  uruma: "うるま市",
  yomitan: "読谷村",
  onna: "恩納村",
  nago: "名護市",
  motobu: "本部町",
};

export const CATEGORIES = [
  "park",
  "indoor",
  "aquarium",
  "beach",
  "restaurant",
  "shopping",
  "learning",
  "onsen",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  park: "公園",
  indoor: "屋内遊び場",
  aquarium: "水族館・動物",
  beach: "ビーチ",
  restaurant: "飲食店",
  shopping: "ショッピング",
  learning: "学習・体験",
  onsen: "温浴施設",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  park: "#4caf6e",
  indoor: "#7b5cff",
  aquarium: "#0097c7",
  beach: "#3db8c9",
  restaurant: "#ff8a3d",
  shopping: "#e84855",
  learning: "#ffb627",
  onsen: "#d96bb0",
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  park: "🌳",
  indoor: "🎮",
  aquarium: "🐠",
  beach: "🏖️",
  restaurant: "🍽️",
  shopping: "🛍️",
  learning: "✏️",
  onsen: "♨️",
};

export const AGE_TAGS = ["0", "1-3", "4-6", "school"] as const;
export type AgeTag = (typeof AGE_TAGS)[number];

export const AGE_LABELS: Record<AgeTag, string> = {
  "0": "0歳",
  "1-3": "1〜3歳",
  "4-6": "4〜6歳",
  school: "小学生",
};

export const FeaturesSchema = z.object({
  hasNursingRoom: z.boolean(),
  hasDiaperTable: z.boolean(),
  strollerFriendly: z.boolean(),
  strollerRental: z.boolean(),
  isIndoor: z.boolean(),
  isOutdoor: z.boolean(),
  rainOk: z.boolean(),
  typhoonOk: z.boolean(),
  hasParking: z.boolean(),
  parkingFree: z.boolean(),
  parkingSpacious: z.boolean().optional(),
  hasKidsSpace: z.boolean(),
  hasKidsChair: z.boolean(),
  noiseTolerant: z.boolean(),
  hasMultipurposeToilet: z.boolean().optional(),
  hasPlayground: z.boolean().optional(),
});
export type Features = z.infer<typeof FeaturesSchema>;

export const PriceSchema = z.object({
  adult: z.number(),
  child: z.number().optional(),
  freeUnder: z.number().optional(),
  free: z.boolean().optional(),
});
export type Price = z.infer<typeof PriceSchema>;

export const ImageCreditSchema = z.object({
  author: z.string(),
  license: z.string(),
  source: z.string().url(),
});
export type ImageCredit = z.infer<typeof ImageCreditSchema>;

/**
 * 駐車場・授乳室などの補足説明。数字を含む情報は必ず出典と確認時期を残す。
 * 施設情報は変わるため、いつの情報かが分からない状態にしない。
 */
export const FacilityNoteSchema = z.object({
  text: z.string(),
  /** 出典。現地で自分が確認した場合など、URLが無いときは省略 */
  source: z
    .object({
      name: z.string(),
      url: z.string().url(),
    })
    .optional(),
  /** 情報を確認した時期。例: "2026年7月" */
  checkedOn: z.string().optional(),
});
export type FacilityNote = z.infer<typeof FacilityNoteSchema>;

export const SpotSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameKana: z.string().optional(),
  category: z.enum(CATEGORIES),
  description: z.string(),
  shortDescription: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  address: z.string(),
  city: z.enum(CITIES),
  lat: z.number(),
  lng: z.number(),
  phone: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  businessHours: z.string().optional(),
  closedDays: z.array(z.string()).default([]),
  price: PriceSchema.optional(),
  durationMin: z.number(),
  ageTags: z.array(z.enum(AGE_TAGS)).default([]),
  features: FeaturesSchema,
  imageUrl: z.string().optional(),
  imageCredit: ImageCreditSchema.optional(),
  imageEmoji: z.string().optional(),
  floor: z.string().optional(),
  /**
   * 駐車場・授乳室の具体的な説明文。設備の boolean だけでは
   * 「◯◯ 駐車場」のような検索意図に答えられないため補足する。
   * 設定するとQ&Aの回答文を置き換える。
   *
   * 台数・料金・室数などの数字を書くときは、公式サイトか自治体・観光協会などの
   * 観光情報サイトを出典として source に残す。個人ブログやポータルの数字は
   * 食い違うことがあるため根拠にしない。裏が取れないものは数字を出さず
   * 「ゆとりがあります」のような書き方にする。
   */
  parkingNote: FacilityNoteSchema.optional(),
  nursingNote: FacilityNoteSchema.optional(),
  /**
   * 検索結果向けのタイトル・説明文の上書き。
   * 既定はテンプレート生成（「◯◯（市町村）の子連れ情報」＋設備の羅列）だが、
   * 表示回数が多いのにクリックされていないページは、検索語を前方に置き
   * フロア・時間などの具体情報を入れた文言に差し替える。
   * seoTitle はサイト名を付けずそのままタイトルになる（全角30文字前後に収める）。
   * 事実はこのファイルの他フィールド（floor / businessHours / features）から取る。
   */
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});
export type Spot = z.infer<typeof SpotSchema>;

export const FILTER_FEATURES = [
  "hasNursingRoom",
  "strollerFriendly",
  "rainOk",
  "hasParking",
] as const;
export type FilterFeature = (typeof FILTER_FEATURES)[number];

export const FILTER_FEATURE_LABELS: Record<FilterFeature, string> = {
  hasNursingRoom: "授乳室",
  strollerFriendly: "ベビーカーOK",
  rainOk: "雨OK",
  hasParking: "駐車場",
};
