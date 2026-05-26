import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/Dipti0704"),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.bio,
  keywords: [
    "Dipti Hatwar",
    "AI Engineer",
    "AI/ML",
    "Agentic AI",
    "Automation",
    "Data Engineering",
    "LangGraph",
    "n8n",
    "PySpark",
    "Hive",
    "Bengaluru",
  ],
  authors: [{ name: site.name, url: site.links.github }],
  creator: site.name,
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    url: "https://github.com/Dipti0704",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">{children}</body>
    </html>
  );
}
