import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BARS = [40, 70, 100, 130, 100, 70, 40];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#111111",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 16,
              background: "#1f1f1f",
              border: "1px solid #2c2c2c",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {BARS.map((h, i) => (
                <div
                  key={i}
                  style={{ width: 7, height: h * 0.4, background: "#C9A063", borderRadius: 4 }}
                />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "white" }}>
            Video<span style={{ color: "#C9A063" }}>Loom</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#a1a1a1",
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          Transcribe, dub, clip, and chat with any video — powered by AI
        </div>
      </div>
    ),
    { ...size },
  );
}
