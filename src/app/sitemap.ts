import type { MetadataRoute } from "next";
import { SLUGS as CASE_STUDY_SLUGS } from "@/lib/projects";

const SITE = "https://tasweeq-agency.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...CASE_STUDY_SLUGS.map((slug) => ({
      url: `${SITE}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
