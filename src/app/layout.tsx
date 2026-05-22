import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

import {
  baseMetadata,
  buildOpenGraph,
  buildTwitterCard,
} from "@/lib/og-metadata";

const defaultTitle = "SpendSense by Credex — Free AI Tool Spend Audit";
const defaultDescription =
  "See where you're overspending on AI tools. Free audit in under 3 minutes.";

export const metadata: Metadata = {
  ...baseMetadata(),
  title: {
    default: defaultTitle,
    template: "%s | SpendSense by Credex",
  },
  description:
    "Instant audit of your AI tool stack. Find overspend on Cursor, Claude, ChatGPT, Copilot, and more — with defensible savings math.",
  openGraph: buildOpenGraph({
    title: defaultTitle,
    description: defaultDescription,
    path: "/",
    imagePath: "/opengraph-image",
  }),
  twitter: buildTwitterCard(defaultTitle, defaultDescription, "/opengraph-image"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${outfit.variable} min-h-screen overflow-x-hidden font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
