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

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "SpendSense by Credex — Free AI Tool Spend Audit",
    template: "%s | SpendSense by Credex",
  },
  description:
    "Instant audit of your AI tool stack. Find overspend on Cursor, Claude, ChatGPT, Copilot, and more — with defensible savings math.",
  ...(appUrl ? { metadataBase: new URL(appUrl) } : {}),
  openGraph: {
    siteName: "SpendSense by Credex",
    type: "website",
    title: "SpendSense by Credex — Free AI Tool Spend Audit",
    description:
      "See where you're overspending on AI tools. Free audit in under 3 minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSense by Credex — Free AI Tool Spend Audit",
    description:
      "See where you're overspending on AI tools. Free audit in under 3 minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${outfit.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
