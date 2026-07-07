import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TASWEEQ — Next-Generation Marketing Studio",
    short_name: "TASWEEQ",
    description:
      "TASWEEQ استوديو تسويق يبني منظومات رقمية قابلة للتوسّع للعلامات الطموحة.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#00d9f5",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
