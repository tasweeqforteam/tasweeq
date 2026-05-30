import localFont from "next/font/local";
import { Inter } from "next/font/google";

// Brand display typeface — NewBlack (self-hosted, full weight range)
export const newBlack = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/NewBlackTypeface-UltraLight.ttf", weight: "200", style: "normal" },
    { path: "../fonts/NewBlackTypeface-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/NewBlackTypeface-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/NewBlackTypeface-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/NewBlackTypeface-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/NewBlackTypeface-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/NewBlackTypeface-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
});

// Body / UI typeface — Inter
export const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
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
