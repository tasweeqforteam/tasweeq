import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/case-studies";
import CaseStudyPage from "@/components/CaseStudyPage";

const VALID_SLUGS = ["sakan", "neemo"] as const;

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

  return {
    title: `${study.slug === "sakan" ? "Sakan" : "Neemo"} - Case Study`,
    description: study.brief[0].slice(0, 160),
    openGraph: {
      title: `${study.slug === "sakan" ? "Sakan" : "Neemo"} - TASWEEQ Case Study`,
      description: study.brief[0].slice(0, 160),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug as (typeof VALID_SLUGS)[number])) {
    notFound();
  }

  return <CaseStudyPage slug={slug as "sakan" | "neemo"} />;
}
