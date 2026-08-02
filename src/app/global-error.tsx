"use client";

// This replaces the entire root layout when an error escapes it, so it can't rely on
// globals.css, theme context, or fonts having loaded successfully — kept fully self-contained.
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1.5rem",
          textAlign: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#0e0c14",
          color: "#f5f3fa",
        }}
      >
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#a78bfa", margin: 0 }}>500</p>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 600, margin: "0.5rem 0" }}>
            Something broke on our end
          </h1>
          <p style={{ color: "#a1a1aa", maxWidth: "28rem", margin: "0 auto" }}>
            We hit an unexpected error rendering this page. Try again — if it keeps happening,
            please check back shortly.
          </p>
        </div>
        <button
          onClick={() => unstable_retry()}
          style={{
            padding: "0.625rem 1.5rem",
            borderRadius: "0.5rem",
            background: "#7c3aed",
            color: "white",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            fontSize: "0.925rem",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
