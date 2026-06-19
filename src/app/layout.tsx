import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { newBlack, inter, plexArabic, thmanyah } from "@/lib/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Providers, { themeInitScript } from "@/components/Providers";
import "./globals.css";

const SITE = "https://tasweeq-agency.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "TASWEEQ — Next-Generation Marketing Studio",
    template: "%s · TASWEEQ",
  },
  description:
    "TASWEEQ designs scalable digital ecosystems for ambitious brands — branding, creative direction, social systems, content production, advertising and digital growth strategy.",
  keywords: [
    "marketing studio",
    "brand identity",
    "creative direction",
    "paid media",
    "social media",
    "digital growth",
    "TASWEEQ",
  ],
  authors: [{ name: "TASWEEQ" }],
  openGraph: {
    type: "website",
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
  "@type": "Organization",
  name: "TASWEEQ",
  description: "Next-generation marketing studio.",
  url: SITE,
  email: "tasweeqforall@gmail.com",
  telephone: "+20 101 4300 054",
  sameAs: ["https://www.instagram.com/tasweeq_agency/", "https://www.linkedin.com/in/tasweeq-agency/", "https://www.facebook.com/profile.php?id=100087189177148"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
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
        <Analytics />
      </body>
    </html>
  );
}
