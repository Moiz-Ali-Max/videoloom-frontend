import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VideoLoom — Transcribe, Dub & Repurpose Video with AI",
    template: "%s · VideoLoom",
  },
  description:
    "VideoLoom turns any video into transcripts, multilingual AI dubs, viral short clips, and a chat-with-your-video assistant — in minutes.",
  openGraph: {
    title: "VideoLoom — Transcribe, Dub & Repurpose Video with AI",
    description:
      "Turn any video into transcripts, multilingual AI dubs, viral short clips, and a chat-with-your-video assistant.",
    url: SITE_URL,
    siteName: "VideoLoom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VideoLoom — Transcribe, Dub & Repurpose Video with AI",
    description:
      "Turn any video into transcripts, multilingual AI dubs, viral short clips, and a chat-with-your-video assistant.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
