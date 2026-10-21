import localFont from "next/font/local";
import { Inter_Tight } from "next/font/google";

// Latin typeface — Inter Tight (display + body)
export const interTight = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Arabic support — IBM Plex Sans Arabic
export const plexArabic = localFont({
  variable: "--font-arabic",
  display: "swap",
  src: [{ path: "../fonts/IBMPlexSansArabic-Regular.ttf", weight: "400", style: "normal" }],
});

// Editorial Arabic serif display — thmanyah
export const thmanyah = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [{ path: "../fonts/thmanyahserifdisplay-Black.otf", weight: "900", style: "normal" }],
});
