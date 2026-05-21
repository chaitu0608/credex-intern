import type { Metadata } from "next";
import { getAppUrl } from "@/lib/app-url";

const OG_SIZE = { width: 1200, height: 630 } as const;

/** Build absolute OG image URL for Twitter / Facebook / Slack crawlers */
export function ogImageUrl(imagePath: string): string {
  const base = getAppUrl();
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${base}${path}`;
}

export function buildTwitterCard(
  title: string,
  description: string,
  imagePath: string
): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: ogImageUrl(imagePath), alt: title, ...OG_SIZE }],
  };
}

export function buildOpenGraph(opts: {
  title: string;
  description: string;
  /** Path only, e.g. `/` or `/audit/abc123` */
  path: string;
  /** Route to opengraph-image.tsx, e.g. `/opengraph-image` */
  imagePath: string;
  siteName?: string;
}): NonNullable<Metadata["openGraph"]> {
  const url = new URL(opts.path, getAppUrl()).toString();
  const image = ogImageUrl(opts.imagePath);

  return {
    siteName: opts.siteName ?? "SpendSense by Credex",
    type: "website",
    title: opts.title,
    description: opts.description,
    url,
    images: [
      {
        url: image,
        secureUrl: image.startsWith("https") ? image : undefined,
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        alt: opts.title,
        type: "image/png",
      },
    ],
  };
}

/** Shared metadataBase + OG helpers for a route */
export function baseMetadata(): Pick<Metadata, "metadataBase"> {
  return { metadataBase: new URL(getAppUrl()) };
}
