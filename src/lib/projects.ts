/**
 * Single source of truth for portfolio projects. Order here = order on the site.
 * Adding a project: add an entry here + its copy in case-studies.ts and i18n showcase.projects.
 */
export const PROJECTS = [
  {
    slug: "sakan",
    title: "Sakan",
    titleAr: "سكن",
    accent: "#3f71e4",
    cover: "/work/sakan-cover.png",
    gallery: { count: 27, ext: "png" },
  },
  {
    slug: "neemo",
    title: "Neemo",
    titleAr: "نيمو",
    accent: "#7F59B0",
    cover: "/work/neemo-cover.png",
    gallery: { count: 34, ext: "png" },
  },
  {
    slug: "mawaeidk",
    title: "Mawaeidk",
    titleAr: "مواعيدك",
    accent: "#004D43",
    cover: "/work/mawaeidk-cover.png",
    gallery: { count: 21, ext: "png" },
  },
  {
    slug: "loop",
    title: "LOOP",
    titleAr: "لووب",
    accent: "#DA7B29",
    cover: "/work/loop-cover.jpg",
    gallery: { count: 25, ext: "jpg" },
  },
  {
    slug: "mh-stud",
    title: "MH Stud",
    titleAr: "إم إتش ستد",
    accent: "#841641",
    cover: "/work/mh-stud-cover.jpg",
    gallery: { count: 32, ext: "jpg" },
  },
] as const;

export type Project = (typeof PROJECTS)[number];
export type ProjectSlug = Project["slug"];

export const SLUGS = PROJECTS.map((p) => p.slug) as ProjectSlug[];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function gallerySlides(p: Project): string[] {
  return Array.from({ length: p.gallery.count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `/work/${p.slug}/${p.slug}-${n}.${p.gallery.ext}`;
  });
}
