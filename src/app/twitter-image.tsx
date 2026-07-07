import { ImageResponse } from "next/og";

export const alt = "TASWEEQ — Next-Generation Marketing Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0b0b0c",
          padding: "90px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="44" height="22" viewBox="0 0 120 60" fill="#00d9f5">
            <path d="m74.9 1.9v7.6h-43.8v33h-14.9v-25.9c0-3.4-2.8-7.1-6.5-7.1h-7.5v-7.6h72.7z" />
            <path d="m91.4 1.9h-9.2v7.5h1.6c10 0 20.2 7.9 20.2 20.6 0 9.5-7.2 19.9-20.2 19.9h-67.6v8.1h75.2c15.7 0 26.6-12.3 26.7-27.1 0.2-14-11.4-29-26.7-29z" />
            <path d="m51.4 22.6c-3.7 0-7.4 3-7.4 7.3 0 3.7 2.7 7.4 7.4 7.4 4.1 0.1 7.2-3.3 7.2-7.2s-3-7.4-7.2-7.5z" />
            <path d="m83.6 22.6c-3.7 0.1-7.5 3.2-7.5 7.4 0 3.6 2.7 7.3 7.4 7.3 4.1 0.1 7.6-3 7.6-7.2 0.1-4.1-3.1-7.5-7.5-7.5z" />
          </svg>
          <div style={{ fontSize: 26, color: "#00d9f5", letterSpacing: 6, textTransform: "uppercase", display: "flex" }}>
            Marketing Studio
          </div>
        </div>
        <div style={{ fontSize: 132, fontWeight: 800, color: "#fff", letterSpacing: -5, marginTop: 28, display: "flex" }}>
          TASWEEQ
        </div>
        <div style={{ fontSize: 34, color: "#a3a3a3", marginTop: 26, display: "flex", maxWidth: 920 }}>
          Build Brands That Move Culture
        </div>
      </div>
    ),
    { ...size }
  );
}
