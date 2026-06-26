import { z } from "zod";

export const CITIES = [
  "naha",
  "urasoe",
  "ginowan",
  "tomigusuku",
  "nanjo",
  "yaese",
  "itoman",
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
