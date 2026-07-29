import type { MetadataRoute } from "next";
import { SPOTS } from "@/data/spots";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "daily" },
    { url: `${SITE_URL}/spots/`, lastModified: now, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/map/`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/recommend/`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${SITE_URL}/privacy/`, lastModified: now, priority: 0.2, changeFrequency: "yearly" },
  ];

  const spotRoutes: MetadataRoute.Sitemap = SPOTS.map((spot) => ({
    url: `${SITE_URL}/spots/${spot.id}/`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...spotRoutes];
}
