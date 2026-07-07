import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/case-studies";
import CaseStudyPage from "@/components/CaseStudyPage";

const SITE = "https://tasweeq-agency.com";

const VALID_SLUGS = ["sakan", "neemo", "mawaeidk"] as const;

const TITLES: Record<(typeof VALID_SLUGS)[number], string> = {
  sakan: "Sakan",
  neemo: "Neemo",
  mawaeidk: "Mawaeidk",
};

const ARABIC_TITLES: Record<(typeof VALID_SLUGS)[number], string> = {
  sakan: "سكن",
  neemo: "نيمو",
  mawaeidk: "مواعيدك",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.ar.find((s) => s.slug === slug);
  if (!study) return {};

  const key = study.slug as (typeof VALID_SLUGS)[number];
  const title = `${ARABIC_TITLES[key]} (${TITLES[key]})`;
  const description = study.brief[0].slice(0, 160);
  const coverUrl = `${SITE}/work/${key}-cover.png`;

  return {
    title: `${title} - دراسة حالة`,
    description,
    keywords: [ARABIC_TITLES[key], TITLES[key], study.meta.industry, study.meta.type, "دراسة حالة", "هوية بصرية"],
    alternates: {
      canonical: `${SITE}/work/${key}`,
    },
    openGraph: {
      title: `${title} - دراسة حالة TASWEEQ`,
      description,
      url: `${SITE}/work/${key}`,
      type: "article",
      images: [{ url: coverUrl, width: 1200, height: 1200, alt: title }],
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
  if (!VALID_SLUGS.includes(slug as (typeof VALID_SLUGS)[number])) {
    notFound();
  }

  const key = slug as (typeof VALID_SLUGS)[number];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE },
      { "@type": "ListItem", position: 2, name: "الأعمال", item: `${SITE}/#work` },
      { "@type": "ListItem", position: 3, name: ARABIC_TITLES[key], item: `${SITE}/work/${key}` },
    ],
  };

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${ARABIC_TITLES[key]} (${TITLES[key]})`,
    url: `${SITE}/work/${key}`,
    image: `${SITE}/work/${key}-cover.png`,
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
      <CaseStudyPage slug={key} />
    </>
  );
}
