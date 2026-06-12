import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/supabase-queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

  let slugs: string[] = [];
  try {
    slugs = await getAllSlugs();
  } catch {
    slugs = [];
  }

  const wordEntries = slugs.map((slug) => ({
    url: `${baseUrl}/word/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...wordEntries,
  ];
}
