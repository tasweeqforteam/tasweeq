import type { Metadata, Viewport } from "next";
import { newBlack, inter, plexArabic, thmanyah } from "@/lib/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Providers, { themeInitScript } from "@/components/Providers";
import "./globals.css";

const SITE = "https://tasweeq-agency.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "TASWEEQ — استوديو تسويق من الجيل الجديد",
    template: "%s · TASWEEQ",
  },
  description:
    "TASWEEQ استوديو تسويق يبني منظومات رقمية قابلة للتوسّع للعلامات الطموحة — هوية بصرية، إدارة إبداعية، أنظمة تواصل اجتماعي، إعلانات مدفوعة، واستراتيجية نمو رقمي.",
  keywords: [
    // local (Mansoura) — Arabic
    "وكالة تسويق في المنصورة",
    "شركة تسويق في المنصورة",
    "استوديو تسويق المنصورة",
    "وكالة هوية بصرية المنصورة",
    "شركة تصميم في المنصورة",
    "أفضل شركة تسويق في المنصورة",
    // local (Mansoura) — English
    "marketing agency Mansoura",
    "marketing company Mansoura Egypt",
    "branding agency Mansoura",
    "digital marketing Mansoura",
    // brand / long-tail (Arabic)
    "استوديو تسويق في مصر",
    "وكالة تسويق رقمي مصر",
    "تصميم هوية بصرية للعلامات التجارية",
    "شركة إدارة إبداعية",
    "إدارة السوشيال ميديا للشركات",
    "إعلانات ممولة ميتا وتيك توك",
    "استراتيجية نمو رقمي للعلامات",
    "بناء علامة تجارية من الصفر",
    "تسويق رقمي",
    "هوية بصرية",
    "إعلانات مدفوعة",
    "نمو الأعمال",
    // brand / long-tail (English)
    "branding agency Egypt",
    "digital marketing studio Egypt",
    "brand identity design agency",
    "creative direction agency MENA",
    "paid media agency Egypt",
    "social media management agency",
    "growth marketing studio",
    "TASWEEQ",
  ],
  authors: [{ name: "TASWEEQ" }],
  alternates: {
    canonical: SITE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    title: "TASWEEQ — Build Brands That Move Culture",
    description:
      "A next-generation marketing studio building scalable brand systems and measurable growth.",
    url: SITE,
    siteName: "TASWEEQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "TASWEEQ — Build Brands That Move Culture",
    description:
      "A next-generation marketing studio building scalable brand systems and measurable growth.",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d9f5",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MarketingAgency",
  name: "TASWEEQ",
  description:
    "TASWEEQ استوديو تسويق يبني منظومات رقمية قابلة للتوسّع للعلامات الطموحة — هوية بصرية، إدارة إبداعية، أنظمة تواصل اجتماعي، إعلانات مدفوعة، واستراتيجية نمو رقمي.",
  url: SITE,
  logo: `${SITE}/icon.svg`,
  image: `${SITE}/opengraph-image`,
  email: "tasweeqforall@gmail.com",
  telephone: "+20 101 4300 054",
  areaServed: [
    { "@type": "City", name: "Mansoura" },
    { "@type": "Country", name: "EG" },
    "SA",
    "QA",
    "AE",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mansoura",
    addressRegion: "Dakahlia",
    addressCountry: "EG",
  },
  sameAs: ["https://www.instagram.com/tasweeq_agency/", "https://www.linkedin.com/in/tasweeq-agency/", "https://www.facebook.com/profile.php?id=100087189177148"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${newBlack.variable} ${inter.variable} ${plexArabic.variable} ${thmanyah.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WDKB4NQK');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WDKB4NQK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
