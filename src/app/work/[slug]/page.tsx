import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/case-studies";
import CaseStudyPage from "@/components/CaseStudyPage";

const VALID_SLUGS = ["sakan", "neemo", "mawaeidk"] as const;

const TITLES: Record<(typeof VALID_SLUGS)[number], string> = {
  sakan: "Sakan",
  neemo: "Neemo",
  mawaeidk: "Mawaeidk",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.en.find((s) => s.slug === slug);
  if (!study) return {};

  const title = TITLES[study.slug as (typeof VALID_SLUGS)[number]];

  return {
    title: `${title} - Case Study`,
    description: study.brief[0].slice(0, 160),
    openGraph: {
      title: `${title} - TASWEEQ Case Study`,
      description: study.brief[0].slice(0, 160),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug as (typeof VALID_SLUGS)[number])) {
    notFound();
  }

  return <CaseStudyPage slug={slug as (typeof VALID_SLUGS)[number]} />;
}
