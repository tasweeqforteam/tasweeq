import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/case-studies";
import { SLUGS, getProject } from "@/lib/projects";
import CaseStudyPage from "@/components/CaseStudyPage";

const SITE = "https://tasweeq-agency.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  const study = caseStudies.ar.find((s) => s.slug === slug);
  if (!project || !study) return {};

  const title = `${project.titleAr} (${project.title})`;
  const description = study.brief[0].slice(0, 160);
  const coverUrl = `${SITE}${project.cover}`;

  return {
    title: `${title} - دراسة حالة`,
    description,
    keywords: [project.titleAr, project.title, study.meta.industry, study.meta.type, "دراسة حالة", "هوية بصرية"],
    alternates: {
      canonical: `${SITE}/work/${project.slug}`,
    },
    openGraph: {
      title: `${title} - دراسة حالة TASWEEQ`,
      description,
      url: `${SITE}/work/${project.slug}`,
      type: "article",
      images: [{ url: coverUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - دراسة حالة TASWEEQ`,
      description,
      images: [coverUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE },
      { "@type": "ListItem", position: 2, name: "الأعمال", item: `${SITE}/#work` },
      { "@type": "ListItem", position: 3, name: project.titleAr, item: `${SITE}/work/${project.slug}` },
    ],
  };

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.titleAr} (${project.title})`,
    url: `${SITE}/work/${project.slug}`,
    image: `${SITE}${project.cover}`,
    creator: { "@type": "Organization", name: "TASWEEQ" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <CaseStudyPage slug={project.slug} />
    </>
  );
}
