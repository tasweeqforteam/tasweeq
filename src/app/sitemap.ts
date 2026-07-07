import type { MetadataRoute } from "next";

const SITE = "https://tasweeq-agency.com";
const CASE_STUDY_SLUGS = ["sakan", "neemo", "mawaeidk"];

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
