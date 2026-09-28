/**
 * 楽天アフィリエイト（体験チケット等）のスポットID → URL 対応。
 * spots.ts を膨らませず、ここだけに寄せる。
 */
export const AFFILIATE_LINKS = {
  "motobu-churaumi-aquarium":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F60503&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "tomi-dmm-aquarium":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F23703&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "nanjo-okinawa-world":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F35398&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "onna-ryukyu-mura":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F61827&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "nago-neopark":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F39957&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "uruma-bios-hill":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F62496&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "nago-pineapple-park":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F22509&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "nago-fruitsland":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F31873&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "nago-dino-park":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F49752&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "nakijin-kouri-ocean-tower":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F26115&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "okinawa-southeast-botanical":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F59408&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
  "uruma-katsuren-castle":
    "https://hb.afl.rakuten.co.jp/hgc/57fcd013.8b771a3f.57fcd014.e3b84f5f/?pc=https%3A%2F%2Fexperiences.travel.rakuten.co.jp%2Fexperiences%2F43829&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9",
} as const satisfies Record<string, string>;

export type AffiliateSpotId = keyof typeof AFFILIATE_LINKS;

export function getAffiliateLink(spotId: string): string | undefined {
  return AFFILIATE_LINKS[spotId as AffiliateSpotId];
}
