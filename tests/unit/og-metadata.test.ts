import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { buildOpenGraph, ogImageUrl } from "@/lib/og-metadata";

describe("og-metadata", () => {
  const original = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "https://credex-intern.vercel.app";
  });

  afterEach(() => {
    if (original !== undefined) process.env.NEXT_PUBLIC_APP_URL = original;
    else delete process.env.NEXT_PUBLIC_APP_URL;
  });

  it("builds absolute OG image URL from app base", () => {
    expect(ogImageUrl("/opengraph-image")).toBe(
      "https://credex-intern.vercel.app/opengraph-image"
    );
  });

  it("includes images and url in openGraph object", () => {
    const og = buildOpenGraph({
      title: "Test",
      description: "Desc",
      path: "/audit/abc123",
      imagePath: "/audit/abc123/opengraph-image",
    });
    expect(og.url).toBe("https://credex-intern.vercel.app/audit/abc123");
    expect(og.images?.[0]).toMatchObject({
      url: "https://credex-intern.vercel.app/audit/abc123/opengraph-image",
      width: 1200,
      height: 630,
    });
  });
});
